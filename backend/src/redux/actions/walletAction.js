import * as types from '../types'
import { Firestore,Database } from '../../firebase'

export const getWalletAll = () => ({
    types: {
        success: types.WALLET_SET_DATA
    },
    call: Database.WalletGetAll()
})

export const getWalletFilter= (startDate, activity, firstName) => ({
    types: {
        success: types.WALLET_SET_DATA
    },
    call: Database.WalletGetFilter(startDate, Number(activity), firstName)
})
