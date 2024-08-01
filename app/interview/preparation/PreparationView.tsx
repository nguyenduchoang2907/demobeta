'use client'
import React, { useCallback } from 'react'

import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  session: Session | null
}

const PreparationView: React.FC<Props> = ({ session }) => {
  const router = useRouter()
  const params = useSearchParams()

  const currentUser = session?.user as SessionUser

  const role = currentUser.role ?? 'patient'

  const roomId = params.get('iv') ?? '1'

  const handleStartMeeting = useCallback(() => {
    router.push(`/interview/meeting?role=${role}&iv=${roomId}`)
  }, [role, router, roomId])

  return (
    <>
      <div className="flex items-center justify-center bg-main-150">
        <div className="mx-auto flex h-screen items-center justify-center">
          <img
            src={
              role == 'patient'
                ? '/interview_client.png'
                : '/interview_admin.jpeg'
            }
            className="inset-0 flex h-3/5 items-center justify-center"
            alt=""
          />
          <div className="absolute inset-0 flex size-full items-center justify-center">
            <div className="block rounded-3xl bg-white/50 p-8">
              <div className="mx-auto block items-center justify-center text-center text-3xl font-bold text-gray-700">
                接続準備ができました。診察を開始してください。
              </div>
              <div className="flex w-full text-4xl">
                <button
                  className="mx-auto mt-8 w-96 rounded-xl bg-main-500 p-4 text-white"
                  onClick={handleStartMeeting}
                >
                  診察を開始する
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PreparationView
