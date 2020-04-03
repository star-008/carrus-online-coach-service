import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/functions'

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
}

firebase.initializeApp(config)

const rt = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()
const db = firebase.firestore()
const functions = firebase.functions()

export { rt, auth, storage, db, functions, firebase }
