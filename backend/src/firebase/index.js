import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'

import config from './config'
import * as Firestore from './firestore'
import * as Database from './database'
import * as Storage from './storage'

const firebaseApp = getApps().length ? getApp() : initializeApp(config);

const Auth = getAuth(firebaseApp)
const DatabaseRef = getDatabase(firebaseApp)
// const Firestore = firebase.firestore()


export {
  Auth,
  Database,
  Firestore,
  Storage,
  DatabaseRef,
  signInWithEmailAndPassword
}
