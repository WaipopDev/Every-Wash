import * as types from '../types'
import { Firestore } from '../../firebase'



export const getProgramWashingMachine = () => ({
    type: types.PROGRAM_GET_WASHING_MACHINE,
    value: Firestore.ProgramWashingMachineGet()
})
export const getProgramClothesDryer = () => ({
    type: types.PROGRAM_GET_CLOTHES_DRYER,
    value: Firestore.ProgramClothesDryerGet()
})

export const updateProgramWashingMachine = (id, param) => ({
    types: {
        success: types.PROGRAM_UPDATE_WASHING_MACHINE_SUCCESS,
        pending: types.PROGRAM_UPDATE_WASHING_MACHINE_PENDING,
        error: types.PROGRAM_UPDATE_WASHING_MACHINE_ERROR
    },
    call: Firestore.ProgramWashingMachineUpdate(id, param)
})

export const updateProgramClothesDryer = (id, param) => ({
    types: {
        success: types.PROGRAM_UPDATE_CLOTHES_DRYER_SUCCESS,
        pending: types.PROGRAM_UPDATE_CLOTHES_DRYER_PENDING,
        error: types.PROGRAM_UPDATE_CLOTHES_DRYER_ERROR
    },
    call: Firestore.ProgramClothesDryerUpdate(id, param)
})

export const setStatus = (param) => ({
    type: types.PROGRAM_STATUS,
    value: {
        status: param.status || false,
        pending: param.pending || false,
        error: param.error || {}
    }
})