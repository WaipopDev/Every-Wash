import update from "immutability-helper";
import * as types from "../types";
import { reponseFirestore, reponseDatabase } from "../../utils/helpers";
import _ from 'lodash'

const initalState = {
    data: []
};
const chat = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.CHAT_GET:
            return update(state, {
                data: { $set: reponseDatabase(action.result) }
            });
        case types.CHAT_GET_DATA:
            return update(state, {
                data: { $set: action.value },
            });
        case types.CHAT_UPDATE:
            return update(state, {
                data: { $merge: action.value },
            });
        default:
            return state;
    }
};
export default chat;
