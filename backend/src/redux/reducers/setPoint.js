import update from "immutability-helper";
import * as types from "../types";
import { reponseFirestore,reponseDatabase } from "../../utils/helpers";
import _ from 'lodash'

const initalState = {
    point: []
};
const setPoint = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.SETPOINT_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    point: { $set: action.result }
                });
            }
            return update(state, {
                point: { $set: reponseDatabase(action.result) }
            });
        default:
            return state;
    }
};
export default setPoint;
