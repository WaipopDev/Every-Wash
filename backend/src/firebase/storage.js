import firebase from 'firebase/app'
import 'firebase/storage'
import config from './config'
if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

const Storage = firebase.storage()

export const Promotion = () => {
    return Storage.ref(`promotion`)
}
export const PromotionGet = (name) => {
    return Storage.ref(`promotion/${name}`).getDownloadURL()
}