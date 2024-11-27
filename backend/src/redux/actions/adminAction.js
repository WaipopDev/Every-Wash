import * as types from '../types'
import { Firestore,Database } from '../../firebase'

export const getAdminAll = () => ({
    types: {
        success: types.ADMIN_SET_DATA
    },
    call: Firestore.AdminGetAll()
})

export const getCustomerAll = () => ({
    types: {
        success: types.CUSTOMER_SET_DATA
    },
    call: Database.CustomerGetAll()
})

export const getCustomerFilter= (type, gender, firstName) => ({
    types: {
        success: types.CUSTOMER_SET_DATA
    },
    call: Database.CustomerGetFilter(Number(type), Number(gender), firstName)
})
