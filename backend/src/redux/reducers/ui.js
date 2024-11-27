import update from 'immutability-helper';
import * as types from '../types'

const initalState = {
    modal: {
        isOpen: false,
        title: "",
        htmlBody: null,
        bodyText: '',
        buttonClose: true,
        buttonAction: false,
        buttonActionText: ''
    },
    notification: {
        type: '',
        text: '',
        count: 0
    },
    alert: {
        message: ''
    },
    language: {},
    languageList: {}
}
const ui = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.MODAL_ACTIVE:
            const {
                isOpen = false,
                title = "",
                htmlBody = null,
                bodyText = '',
                buttonClose = true,
                buttonAction = false,
                buttonActionText = '' } = action.value
            return update(state, {
                modal: {
                    $set: {
                        isOpen,
                        title,
                        htmlBody,
                        bodyText,
                        buttonClose,
                        buttonAction,
                        buttonActionText
                    }
                }
            })
        case types.NOTIFICATION:
            const { type, text } = action.value
            return update(state, {
                notification: {
                    type: { $set: type },
                    text: { $set: text },
                    count: { $set: state.notification.count + 1 }
                }
            })
        case types.ALERT_SHOW:
            const { value: message } = action
            return update(state, {
                alert: {
                    message: { $set: message }
                }
            })
        case types.SET_LANGUAGE:
            const { value:valueLang } = action
            return update(state, {
                    language: { $set: valueLang }
            })
        case types.SET_LANGUAGE_LIST:
            const { value:valueLangList } = action
            return update(state, {
                languageList: { $set: valueLangList }
            })
        default:
            return state
    }

}
export default ui