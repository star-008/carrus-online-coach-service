const { db, storage } = require('../../firebase')
const { functions } = require('../config')

const mkdirp = require('mkdirp-promise')
const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')

const THUMB_PREFIX = 'thumb'
const JPEG_EXTENSION = '.jpg'

module.exports = functions.storage.object().onFinalize(async object => {
  // File and directory paths.
  const filePath = object.name
  const contentType = object.contentType
  const baseFileName = path.basename(filePath, path.extname(filePath))
  const tempLocalFile = path.join(os.tmpdir(), filePath)
  const tempLocalDir = path.dirname(tempLocalFile)

  if (!filePath.startsWith('userProfileImages/')) return
  if (!contentType.startsWith('image/')) return
  if (baseFileName.startsWith(THUMB_PREFIX)) return

  const dirList = path.dirname(filePath).split(path.sep)
  const userId = dirList[dirList.length - 1]

  const bucket = storage.bucket()
  const file = bucket.file(filePath)

  await mkdirp(tempLocalDir)

  await file.download({ destination: tempLocalFile })

  const config = {
    action: 'read',
    expires: '03-01-2500',
  }

  const [x88Result, x340Result] = await Promise.all([
    createAndUploadThumb(
      '88x88',
      filePath,
      baseFileName,
      tempLocalFile,
      config,
      bucket
    ),
    createAndUploadThumb(
      '340x340',
      filePath,
      baseFileName,
      tempLocalFile,
      config,
      bucket
    ),
  ])

  fs.unlinkSync(tempLocalFile)

  const thumb_88x88 = x88Result[0]
  const thumb_340x340 = x340Result[0]
  const [fileUrl] = await file.getSignedUrl(config)

  return db
    .collection('users')
    .doc(userId)
    .update({
      profileImage: { path: fileUrl, thumb_88x88, thumb_340x340 },
    })
})

async function createAndUploadThumb(
  size,
  filePath,
  baseFileName,
  tempLocalFile,
  config,
  bucket
) {
  const fileDir = path.dirname(filePath)
  const thumbFilePath = path.normalize(
    path.format({
      dir: fileDir,
      name: `${THUMB_PREFIX}_${size}_${baseFileName}`,
      ext: JPEG_EXTENSION,
    })
  )
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath)
  const thumbFile = bucket.file(thumbFilePath)

  await spawn(
    'convert',
    [
      tempLocalFile,
      '-thumbnail',
      size + '^',
      '-gravity',
      'center',
      '-extent',
      size,
      tempLocalThumbFile,
    ],
    { capture: ['stdout', 'stderr'] }
  )

  await bucket.upload(tempLocalThumbFile, { destination: thumbFilePath })

  fs.unlinkSync(tempLocalThumbFile)

  return thumbFile.getSignedUrl(config)
}
