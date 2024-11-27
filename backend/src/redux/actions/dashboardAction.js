import * as types from '../types'
import { Firestore,Database } from '../../firebase'

export const getAdminAll = () => ({
    types: {
        success: types.ADMIN_SET_DATA
    },
    call: Firestore.AdminGetAll()
})

export const getDashboardItem1 = () => ({
    types: {
        success: types.DASHBOARD_ITEM_1_SET_DATA
    },
    call: Database.DashboardGetItem1()
})

export const getDashboardItem2 = () => ({
    types: {
        success: types.DASHBOARD_ITEM_2_SET_DATA
    },
    call: Database.DashboardGetItem2()
})

export const getDashboardItem3 = () => ({
    types: {
        success: types.DASHBOARD_ITEM_3_SET_DATA
    },
    call: Database.DashboardGetItem3()
})

export const getDashboardItem4 = () => ({
    types: {
        success: types.DASHBOARD_ITEM_4_SET_DATA
    },
    call: Database.DashboardGetItem4()
})

export const getDashboardItem5 = () => ({
    types: {
        success: types.DASHBOARD_ITEM_5_SET_DATA
    },
    call: Database.DashboardGetItem5()
})