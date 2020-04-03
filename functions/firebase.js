const functions = require('firebase-functions')
const admin = require('firebase-admin')

const serviceAccount = functions.config().service_account

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: JSON.parse(process.env.FIREBASE_CONFIG).databaseURL,
  storageBucket: JSON.parse(process.env.FIREBASE_CONFIG).storageBucket,
})

const db = admin.firestore()
const storage = admin.storage()

module.exports = {
  db,
  storage,
  admin,
}
