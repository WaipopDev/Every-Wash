import * as types from "../types";
import { Firestore, Database } from "../../firebase";

export const getReportSalesReport = (branch, startDate, endDate) => ({
  types: {
    pending: types.REPORT_SALES_REPORT_PENDING_DATA,
    success: types.REPORT_SALES_REPORT_SET_DATA
  },
  call: Firestore.ReportGetSalesReport(branch, startDate, endDate)
});

export const getReportSalesMonthReport = (branch, month, year) => ({
  types: {
    pending: types.REPORT_SALES_MONTH_REPORT_PENDING_DATA,
    success: types.REPORT_SALES_MONTH_REPORT_SET_DATA
  },
  call: Firestore.ReportGetSalesMonthReport(branch, month, year)
});

export const getReportWashingReport = (branch, startDate,endDate) => ({
  types: {
    success: types.REPORT_WASHING_REPORT_SET_DATA
  },
  call: Firestore.ReportGetWashingReport(branch, startDate,endDate)
});
