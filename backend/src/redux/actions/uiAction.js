import * as types from '../types'

export const activeModal = (param) => ({
    type: types.MODAL_ACTIVE,
    value: param
})

export const notification = (param) => ({
    type: types.NOTIFICATION,
    value: param
})

export const alertShow = (param) => ({
    type: types.ALERT_SHOW,
    value: param
})

export const setLanguage = (param) => ({
    type: types.SET_LANGUAGE,
    value: param
})

export const setLanguageList = (param) => ({
    type: types.SET_LANGUAGE_LIST,
    value: param
})