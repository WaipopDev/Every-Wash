import update from "immutability-helper";
import * as types from "../types";
import { reponseFirestore, reponseDatabase } from "../../utils/helpers";
import _ from 'lodash'

const initalState = {
    reportSalesReport: [],
    reportSalesMonthReport: [],
    reportWashingReport: [],
    reportSalesMonthReportPendding: false,
    reportSalesReportPendding: false,
};
const report = (state = initalState, action = {}) => {
    switch (action.type) {
        case types.REPORT_SALES_REPORT_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    reportSalesReport: { $set: action.result },
                    reportSalesReportPendding: { $set: false }
                });
            }
            return update(state, {
                reportSalesReport: { $set: reponseFirestore(action.result) },
                reportSalesReportPendding: { $set: false }
            });
        case types.REPORT_SALES_REPORT_PENDING_DATA:
            return update(state, {
                reportSalesReportPendding: { $set: true }
            });

        case types.REPORT_SALES_MONTH_REPORT_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    reportSalesMonthReport: { $set: action.result },
                    reportSalesMonthReportPendding: { $set: false }
                });
            }
            return update(state, {
                reportSalesMonthReport: { $set: reponseFirestore(action.result) },
                reportSalesMonthReportPendding: { $set: false }
            });
        case types.REPORT_SALES_MONTH_REPORT_PENDING_DATA:
            return update(state, {
                reportSalesMonthReportPendding: { $set: true }
            });

        case types.REPORT_WASHING_REPORT_SET_DATA:
            if (_.isArray(action.result)) {
                return update(state, {
                    reportWashingReport: { $set: action.result }
                });
            }
            return update(state, {
                reportWashingReport: { $set: reponseFirestore(action.result) }
            });
        default:
            return state;
    }
};
export default report;
