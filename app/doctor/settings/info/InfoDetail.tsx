'use client'
import EditableInput from '@/components/EditableInput'
import React, { useState } from 'react'

const InfoDetail: React.FC = () => {
  function handleChange(): void {
    throw new Error('Function not implemented.')
  }

  const [image, setImage] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0])
    }
  }

  const handleImageClick = (src: string) => {
    setSelectedImage(src)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="w-full">
      {/* <div className="my-4 flex w-full bg-main-50 p-4 font-bold text-black">
        <select className="w-42 ml-4 rounded py-2 text-center">
          <option>クララ美容皮膚科那覇院</option>
        </select>

        <div className="mx-auto"></div>
      </div> */}

      <div className="my-4 flex w-full text-gray-500">
        <div className="flex w-96 flex-col items-center justify-center">
          {/* 画像リスト */}
          <div className="flex flex-col items-center justify-center">
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                className="size-64 cursor-pointer rounded border border-gray-300 object-cover"
                onClick={() => handleImageClick(URL.createObjectURL(image))}
              />
            )}
          </div>

          {/* 画像追加 */}
          <div className="mt-4 hidden items-center justify-center">
            <label className="font-base flex cursor-pointer items-center rounded border-2 border-main-200 bg-white px-4 hover:bg-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mx-auto size-6 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="ml-2">ロゴ設定</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
        <div className="w-2/3 px-4">
          <h1 className="w-full py-2 text-xl">基本情報</h1>
          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">医療機関名</p>
            <EditableInput
              value="クララ美容皮膚科那覇院"
              setValue={handleChange}
            />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">院長</p>
            <EditableInput value="仲田力次" setValue={handleChange} />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">電話番号</p>
            <EditableInput value="098-996-4444" setValue={handleChange} />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">ホームページURL</p>
            <EditableInput
              value="https://clarabeautyclinic.jp/nahain/"
              setValue={handleChange}
            />
          </div>

          <h1 className="py-2 text-xl">医療機関所在地</h1>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">郵便番号</p>
            <EditableInput value="〒902-0063" setValue={handleChange} />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">都道府県</p>
            <EditableInput value="沖縄県" setValue={handleChange} />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">市区町村</p>
            <EditableInput value="那覇市" setValue={handleChange} />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">番地・ビル名</p>
            <EditableInput
              value="三原1丁目26番1号メゾンみはら1階"
              setValue={handleChange}
            />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">受付時間</p>
            <EditableInput value="10:00~19:00" setValue={handleChange} />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">LINE公式アカウントURL</p>
            <EditableInput
              value="https://page.line.me/513kkyow"
              setValue={handleChange}
            />
          </div>

          <div className="flex w-full px-4 py-2">
            <p className="w-1/5">Instagram公式アカウントURL</p>
            <EditableInput
              value="https://www.instagram.com/clara_okinawa/"
              setValue={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 拡大表示モーダル */}
      {selectedImage && (
        <div
          className="bg-opacity/50 fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black"
          onClick={handleCloseModal}
        >
          <div
            className="max-h-full max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Selected"
              className="h-auto max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InfoDetail
