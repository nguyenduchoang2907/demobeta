'use client'

import { verifyPayment } from '@/server/payment'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const PaymentSuccessPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const query = useSearchParams()
  const sessionId = query.get('session_id')

  useEffect(() => {
    const handleVerifyPayment = async () => {
      try {
        const response = await verifyPayment(sessionId || '')
        console.log('response is', response)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    handleVerifyPayment()
  }, [sessionId])

  return (
    <div>
      {isLoading ? (
        <h1 className="text-other-blue">決済中...</h1>
      ) : (
        <h1 className="text-other-blue">決済が完了しました。</h1>
      )}
    </div>
  )
}

export default PaymentSuccessPage
