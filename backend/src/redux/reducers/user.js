import update from "immutability-helper";
import * as types from "../types";

const initalState = {
    data: {},
    permission: []
};
const user = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.USER_SET_DATA:
            return update(state, {
                data: { $set: action.value }
            });
        case types.USER_SET_PERMISSION:
            return update(state, {
                permission: { $set: action.value }
            });
        default:
            return state;
    }
};
export default user;
