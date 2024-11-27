import * as types from '../types'
import { Firestore,Database } from '../../firebase'

export const getPointRedemtionAll = () => ({
    types: {
        success: types.POINT_REDEMTION_SET_DATA
    },
    call: Database.PointRedemtionGetAll()
})

export const getPointRedemtionFilter= (startDate, activity, firstName) => ({
    types: {
        success: types.POINT_REDEMTION_SET_DATA
    },
    call: Database.PointRedemtionGetFilter(startDate, Number(activity), firstName)
})
