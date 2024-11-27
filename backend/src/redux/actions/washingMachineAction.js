import * as types from '../types'
import { Database } from '../../firebase'

export const getWashingMachine = () => ({
    types: {
        success: types.WASHING_MACHINE_GET_ALL
    },
    call: Database.WashingMachineGetAll()
})

export const getWashingMachineFilter= (branchFilter) => ({
    types: {
        success: types.WASHING_MACHINE_GET_ALL
    },
    call: Database.WashingMachineGetFilter(branchFilter)
})

