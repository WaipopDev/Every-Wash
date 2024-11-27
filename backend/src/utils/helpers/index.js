import _ from 'lodash';
import moment from 'moment'
import Router from "next/router";
import { Database } from '../..//firebase';

const DEFAULT_AMOUNT_SEPARATOR = ',';

export function isCheckData(data) {
    if(data && !_.isUndefined(data) && !_.isNull(data) && !_.isNaN(data) && data != 'null' && data != 'undefined'){
        return true
    }
    return false
}


export function isClientSide() {
    return typeof window !== 'undefined';
}

export function numberWithSeparators(value, sep = DEFAULT_AMOUNT_SEPARATOR) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export function formatAmount(amount, toFixed = 2) {
    if (amount === '' || Number.isNaN(amount)) {
        return '';
    }

    return numberWithSeparators(parseFloat(amount).toFixed(toFixed));
}

export function excelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    return moment(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)).format('YYYY/MM/DD');
}

export function redirectUser(location, ctx = {}) {
    if (ctx.req) {
        ctx.res.writeHead(302, { Location: location });
        ctx.res.end();
    } else {
        Router.push(location);
    }
}

export async function renderItem(data) {
    try {
        let item = []
        const snapshot = await data
        snapshot.forEach(doc => {
            item.push({ ...doc.data(), ...{ docId: doc.id } })

        })
        return item
    } catch (error) {
        console.log(`error`, error)
    }
}
export function reponseFirestore(data) {
    let item = []
    data.forEach(element => {
        item.push({ ...element.data(), ...{ docId: element.id } })
    });
    return item
}
export function reponseDatabase(data) {
    let item = []
    data.forEach(element => {
        item.push({ ...element.val(), ...{ docId: element.key } })
    });
    return item
}
export function reponseFirestoreJson(data) {
    let item = {}
    data.forEach(element => {
        item[element.id] = element.data()
    });
    return item
}
export function reponseDatabaseJson(data) {
    let item = {}
    data.forEach(element => {
        item[element.key] = element.val()
    });
    return item
}

export function AddLogAdmin(userData, menu, activity) {
    const log = {
        menu,
        activity
    }
    Database.AdminLog(userData.id, log)
}

export function reverseObject(data) {
    return _.reverse(_.map(data, (res, key) => ({ ...res, docId: key })))
}
export function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
export const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const startDate = (today = new Date()) => {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
}

export const endDate = (today = new Date()) => {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
}

export const weekOfMonth = (m) => {
    return moment(m).week() - moment(m).startOf('month').week() + 1;
}