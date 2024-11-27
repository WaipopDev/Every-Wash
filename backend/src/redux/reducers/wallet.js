import update from "immutability-helper";
import * as types from "../types";
import { reponseFirestore,reponseDatabase } from "../../utils/helpers";
import _ from 'lodash'

const initalState = {
    data: []
};
const wallet = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.WALLET_SET_DATA:
            // if (_.isArray(action.result)) {
            //     return update(state, {
            //         data: { $set: action.result }
            //     });
            // }
            return update(state, {
                data: { $set: reponseDatabase(action.result) }
            });
        default:
            return state;
    }
};
export default wallet;
