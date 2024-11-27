import update from "immutability-helper";
import * as types from "../types";
import { renderItem, reponseFirestore,reponseDatabase } from "../../utils/helpers";
const initalState = {
    data: [],
};
const promotion = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.PROMOTION_GET_SUCCESS:
            return update(state, {
                data: { $set: reponseDatabase(action.result) }
            });
        default:
            return state;
    }
};
export default promotion;
