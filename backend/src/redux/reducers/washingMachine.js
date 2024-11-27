import update from "immutability-helper";
import * as types from "../types";
import { reponseDatabase } from "../../utils/helpers";
const initalState = {
    data: [],
};
const washingMachine = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.WASHING_MACHINE_GET_ALL:
            if (_.isArray(action.result)) {
                return update(state, {
                    data: { $set: action.result }
                });
            }
            return update(state, {
                data: { $set: reponseDatabase(action.result) }
            });
        default:
            return state;
    }
};
export default washingMachine;
