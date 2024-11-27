import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

import config from './config'
import * as Firestore from './firestore'
import * as Database from './database'
import * as Storage from './storage'
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const Auth = firebase.auth()
const DatabaseRef = firebase.database()
// const Firestore = firebase.firestore()


export {
  Auth,
  Database,
  Firestore,
  Storage,
  DatabaseRef
}
