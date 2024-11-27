import axios from 'axios';
import { Firestore, Database } from '../../../../src/firebase'
import { reponseDatabase } from '../../../../src/utils/helpers'
import fs from 'fs';
import https from 'https';
import OAuthKL from '../../../../src/utils/helpers/oauthKL';
import _ from 'lodash'
import moment from 'moment';
// import jwt from 'jsonwebtoken'
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query: { id: idMachine, idProgram,type,amount,time } } = req
        // return res.status(401).json({ error: 'Error API' })
        if (!idMachine || !idProgram) {
            return res.status(401).json({ error: 'Error query' })
        }
        const snapshot = await Database.WashingMachineGetByChild('id', idMachine)
        if (reponseDatabase(snapshot).length) {
            const data = reponseDatabase(snapshot)[0]
            const ref1 = `PAYWALLET${data.ref}`
            const ref2 = `T${moment().unix()}`

            if(data.statusClosePay == false && data.closePayDate){
                if(moment.unix(data.closePayDate).format('YYYYMMDD') <= moment().format('YYYYMMDD') && data.statusClosePay == false){
                    return res.status(401).json({ error: 'ไม่สามารถใช้งานได้ เนื่องจากไม่มีการเปิดใช้ออนไลน์' })
                }
            }
            // if (data.bankType == 'KBANK' && data.bankType != null) {
            //     return callKbank(data, amount, type, time, idMachine)
            // }
            
            const p = _.find(_.values(data.program), e => e.id === idProgram)
            if(p){
                let token = `${data.ref}0WL${idProgram}0WL${ref1}0WL${ref2}`
                if(type && amount && time){
                    token = `${data.ref}0UP${idProgram}0UP${ref1}0UP${ref2}0UP${type}0UP${amount}0UP${time}`
                }
                let item = {
                    qrRawData: token,
                    ref1,
                    ref2
                }
                return res.status(200).json({ data: item })
            }else{
                return res.status(401).json({ error: 'Error ไม่มีเครื่องซักนี้' })
            }
            
        }
        return res.status(401).json({ error: 'Error auth' })
    } else if (req.method === 'POST') {
        const { query: { id: idMachine }, body: { ref1, ref2 } } = req
        // return res.status(401).json({ error: 'Error API' })
        if (!idMachine || !ref1 || !ref2) {
            return res.status(401).json({ error: 'Error query' })
        }
        const dateNow = moment().format("YYYY-MM")
        const snapshot = await Database.PaymentWalletCallbackCheck(ref1, ref2, dateNow)
        if (snapshot.val()) {
            const k = Object.keys(snapshot.val())
            const data = snapshot.val()[k]
            return res.status(200).json({
                data: {
                    transactionId: data.transactionId,
                    status: 'Success'
                }
            })
        } else {
            return res.status(401).json({ error: 'Error payment' })
        }
    } else {
        return res.status(401).json({ error: 'Error method' })
    }
}