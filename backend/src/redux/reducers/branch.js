import update from "immutability-helper";
import * as types from "../types";
import { renderItem, reponseFirestore } from "../../utils/helpers";
const initalState = {
    data: [],
};
const branch = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.BRANCH_GET:
            return update(state, {
                data: { $set: reponseFirestore(action.result) }
            });
        default:
            return state;
    }
};
export default branch;
