import * as types from '../types'
import { Firestore,Database } from '../../firebase'

export const getSetPointAll = () => ({
    types: {
        success: types.SETPOINT_SET_DATA
    },
    call: Database.SetPointGetAll()
})
