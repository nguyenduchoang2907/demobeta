'use server'
import { bucket, db } from '@/lib/firebase'
import type { DocumentData } from 'firebase/firestore'
import mime from 'mime'

interface ChatRoomParams {
  roomId: string
  role: string
}

export interface Message {
  id: string
  text: string
  from: string
  createdAt: Date
  fileUrls: string[]
  fileNames: string[]
}

async function getMessages(params: ChatRoomParams) {
  try {
    const itemsCol = db.collection(`rooms/${params.roomId}/messages`)
    const itemsSnapshot = await itemsCol.get()

    const itemsList: Message[] = []
    for (const doc of itemsSnapshot.docs) {
      const itemData = doc.data() as DocumentData
      const createdAt: Date = itemData.createdAt.toDate() // Convert Firestore Timestamp to JavaScript Date
      const dataUrls = []
      if (itemData.fileUrls) {
        for (const dUrl of itemData.fileUrls) {
          dataUrls.push(await getSignUrl(dUrl))
        }
      }

      itemsList.push({
        id: doc.id,
        text: itemData.text,
        from: itemData.from,
        fileUrls: dataUrls,
        fileNames: itemData.fileNames ? itemData.fileNames : [],
        createdAt,
      })
    }

    console.log(itemsList)
    return itemsList
  } catch (e) {
    console.log('error is', e)
    return []
  }
}

const getPresignedLink = async (fileName: string) => {
  const file = bucket.file(fileName)
  const contentType = mime.getType(fileName) || ''
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  })
  return url
}

async function getListFilesOfPatient(subFolder: string) {
  const [files] = await bucket.getFiles({ prefix: subFolder })
  console.log('files uploaded is', files)
  const fileList = await Promise.all(
    files.map(async (file) => {
      const [metadata] = await file.getMetadata()
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 3600 * 1000,
      })
      return {
        name: file.name,
        url: signedUrl,
        date: metadata.timeCreated,
      }
    }),
  )

  // const fileList = files.map(file => ({
  //   name: file.name,
  //   url: file.publicUrl(),
  //   // data: file
  // }))
  return fileList
}

async function generatePresignedUploadLink(fileName: string) {
  const url = await getPresignedLink(fileName)
  return url
}

async function sendMessage(
  newMessage: string,
  roomId: string,
  role: string,
  fileUrls: string[],
  fileNames: string[],
) {
  const itemsCol = db.collection(`rooms/${roomId}/messages`)
  await itemsCol.add({
    text: newMessage,
    from: role,
    createdAt: new Date(),
    fileUrls,
    fileNames,
  })
}

async function getSignUrl(imageUrl: string) {
  //TODO: valid if user has permission
  if (imageUrl) {
    const imageRef = bucket.file(imageUrl)

    // Generate a download URL for the image
    const signedUrls = await imageRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 3600 * 1000,
    }) // Specify expiration date or duration
    return signedUrls[0] as string
  } else {
    return ''
  }
}

export {
  generatePresignedUploadLink,
  getListFilesOfPatient,
  getMessages,
  getSignUrl,
  sendMessage,
}
