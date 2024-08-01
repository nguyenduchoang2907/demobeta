'use client'
import { patientReceptionList, receptionDetail } from '@/server/reception'
// import { useRouter, useSearchParams } from 'next/navigation'
import CommonModal from '@/components/CommonModal'
import PaymentSuccess from '@/components/PaymentSuccess'
import type { Reception } from '@/gen/proto/v1/reception_pb'
import { verifyPayment } from '@/server/payment'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

const PatientReceptionList: React.FC = () => {
  const params = useSearchParams()
  const receiptParam = params.get('id') ?? ''
  const patientId = params.get('pid') ?? ''

  const router = useRouter()

  const [receptions, setReceptions] = useState<Reception[]>([])
  const [receiptId, setReceiptId] = useState(receiptParam)
  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const sessionId = params.get('session_id') ?? ''
  const [isPayment, setIsPayment] = useState(false)
  const [orderId, setOrderId] = useState<string>()

  useEffect(() => {
    const verifySessionFunc = async () => {
      if (sessionId) {
        const orderIdValue = await verifyPayment(sessionId)
        if (orderIdValue) {
          setIsPayment(true)
          setOrderId(orderIdValue.toString())
          console.log('payment success', orderIdValue)
        }
      }
    }
    verifySessionFunc()
  }, [sessionId])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        if (receiptParam) {
          const reception = await receptionDetail(Number(receiptParam))
          const response = await patientReceptionList(
            Number(reception?.patient?.id),
          )
          setReceptions(
            response.sort((a, b) => {
              return Number(b.id - a.id)
            }),
          )
          console.log(response)
        } else if (patientId) {
          const response = await patientReceptionList(Number(patientId))
          setReceptions(
            response.sort((a, b) => {
              return Number(b.id - a.id)
            }),
          )
          console.log(response)
          // setReceptions(response)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('患者情報が見つかりません')
        setModalIsOpen(true)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [receiptParam, patientId])

  const handleClickItem = useCallback(
    (id: string) => {
      setReceiptId(id)
      router.push(`/doctor/patient/reception?id=${id}`)
    },
    [router, setReceiptId],
  )

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  return (
    <div className="justify-center text-black">
      {receptions.map((item) => (
        <div
          key={item.id ?? '0'}
          className={`flex w-full cursor-pointer justify-between border-b border-gray-100 hover:cursor-pointer ${item.id.toString() == receiptId ? 'bg-green-100' : ''}`}
        >
          <div
            key={item.id}
            className={`block w-full `}
            onClick={(event) => {
              event.stopPropagation()
              handleClickItem(item.id.toString())
            }}
          >
            <div className="flex">
              {item.appointmentTime}{' '}
              {item.id.toString() == receiptId && (
                <button className="mx-4 rounded border bg-green-500 px-2">
                  編集中
                </button>
              )}
            </div>
            <div className="flex">一般内容: {item.examination?.name}</div>
          </div>
        </div>
      ))}
      <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
        <div>{errorMessage}</div>
      </CommonModal>

      <PaymentSuccess
        isDisplay={isPayment}
        setIsDisplay={setIsPayment}
        title="お会計が完了しました!"
        contentId={orderId}
      />
    </div>
  )
}

export default PatientReceptionList
