import * as types from '../types'
import { Firestore,Database } from '../../firebase'

export const getChat = () => ({
    types: {
        success: types.CHAT_GET
    },
    call: Database.getChat()
})
export const getChatData = (param) => ({
    type: types.CHAT_GET_DATA,
    value: param
})
export const updateChat = (param) => ({
    type: types.CHAT_UPDATE,
    value: param
})
