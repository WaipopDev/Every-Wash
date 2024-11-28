import { initializeApp, getApps, getApp } from 'firebase/app';
import  { getStorage } from 'firebase/storage'
import config from './config'

const firebaseApp = getApps().length ? getApp() : initializeApp(config);

const Storage = getStorage(firebaseApp)

export const Promotion = () => {
    return Storage.ref(`promotion`)
}
export const PromotionGet = (name) => {
    return Storage.ref(`promotion/${name}`).getDownloadURL()
}