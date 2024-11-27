import update from "immutability-helper";
import * as types from "../types";
import { reponseFirestore,reponseDatabase } from "../../utils/helpers";
const initalState = {
    data: [],
    customer: []
};
const admin = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.ADMIN_SET_DATA:
            return update(state, {
                data: { $set: reponseFirestore(action.result) }
            });
        case types.CUSTOMER_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    customer: { $set: action.result }
                });
            }
            return update(state, {
                customer: { $set: reponseDatabase(action.result) }
            });
        default:
            return state;
    }
};
export default admin;
