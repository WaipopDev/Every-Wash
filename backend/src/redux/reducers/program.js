import update from "immutability-helper";
import * as types from "../types";
import { renderItem } from "../../utils/helpers";
const initalState = {
    programWashingMachine: [],
    programClothesDryer: [],
    programStatus: {
        status: false,
        pending: false,
        error: {}
    }
};
const program = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.PROGRAM_GET_WASHING_MACHINE:
            return update(state, {
                programWashingMachine: { $set: renderItem(action.value) }
            });
        case types.PROGRAM_GET_CLOTHES_DRYER:
            return update(state, {
                programClothesDryer: { $set: renderItem(action.value) }
            });
        case types.PROGRAM_STATUS:
            return update(state, {
                programStatus: {
                    status: { $set: action.value.status },
                    pending: { $set: action.value.pending },
                    error: { $set: action.value.error }
                }
            });
        default:
            return state;
    }
};
export default program;
