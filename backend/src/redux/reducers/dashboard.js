import update from "immutability-helper";
import * as types from "../types";
import { reponseFirestore, reponseDatabase } from "../../utils/helpers";
import _ from 'lodash'

const initalState = {
    item1: [],
    item2: [],
    item3: [],
    item4: [],
    item5: []
};
const dashboard = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.DASHBOARD_ITEM_1_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    item1: { $set: action.result }
                });
            }
            return update(state, {
                item1: { $set: reponseDatabase(action.result) }
            });
        case types.DASHBOARD_ITEM_2_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    item2: { $set: action.result }
                });
            }
            return update(state, {
                item2: { $set: reponseFirestore(action.result) }
            });
        case types.DASHBOARD_ITEM_3_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    item3: { $set: action.result }
                });
            }
            return update(state, {
                item3: { $set: reponseDatabase(action.result) }
            });
        case types.DASHBOARD_ITEM_4_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    item4: { $set: action.result }
                });
            }
            return update(state, {
                item4: { $set: reponseDatabase(action.result) }
            });
        case types.DASHBOARD_ITEM_5_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    item5: { $set: action.result }
                });
            }
            return update(state, {
                item5: { $set: reponseDatabase(action.result) }
            });
        default:
            return state;
    }
};
export default dashboard;
