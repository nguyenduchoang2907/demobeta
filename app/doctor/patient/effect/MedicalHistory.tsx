'use client'

import Table from '@/components/Table'
import { EffectMedicineRecord } from '@/gen/proto/v1/effect_medicine_pb'
import { effectMedicineList } from '@/server/medicine'
import { generateMedicineDummyData } from '@/utils/dummy'
import { useEffect, useMemo, useState } from 'react'

interface MedicalHistoryComponentProps {
  startDate: Date
  patientId: string
  onClickFunction: () => void
}

const MedicalHistoryComponent: React.FC<MedicalHistoryComponentProps> = ({
  onClickFunction,
}) => {
  const [medicines, setMedicines] = useState<EffectMedicineRecord[]>([])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _response = await effectMedicineList({
          page: 1,
        })
        const _newData = _response.medicines
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      const testData = generateMedicineDummyData()
      const newData = testData.map((i) => EffectMedicineRecord.fromJson(i))
      setMedicines(newData)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [setMedicines])

  const medicialHistoryColumns = useMemo(
    () => [
      {
        title: '薬剤名',
        index: 'name',
        render: (value: string) => (
          <p className="ml-8 w-full text-left">{value}</p>
        ),
        className: `text-center max-w-[150px] min-w-[150px] text-sm text-gray-600 border-t border-b`,
      },
      {
        title: '投与開始日',
        index: 'administrationDate',
        render: (value: string) => (
          <p className="w-full text-left">{value || '-'}</p>
        ),
        className:
          'max-w-[150px] min-w-[150px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '禁忌開始日',
        index: 'contraindicationDate',
        render: (value: string) => (
          <p className="w-full text-left">{value || '-'}</p>
        ),
        className:
          'max-w-[150px] min-w-[150px] text-sm text-gray-600 border-t border-b',
      },

      {
        title: '',
        index: 'name',
        render: (_: string) => (
          <div className="w-full text-center">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        ),
        className: 'text-sm text-gray-600 border-t border-b',
      },
    ],
    [],
  )

  return (
    <>
      <div className="flex py-4 text-black">
        <p className="mx-2 text-xl font-bold">禁忌薬</p>
        <div className="mx-auto"></div>
        <div className="flex w-32 items-center">
          <button
            className="font-base flex items-center rounded border-2 border-main-200 bg-gray-100 px-4"
            onClick={onClickFunction}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-4 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            追加
          </button>
        </div>
      </div>

      <div>
        <Table
          columns={medicialHistoryColumns}
          data={medicines}
          headerClass="bg-primary-admin"
          onRowClick={() => {}}
        />
      </div>
    </>
  )
}

export default MedicalHistoryComponent
