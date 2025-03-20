import axios from 'axios';
import { Firestore, Database } from '../../../src/firebase'
import fs from 'fs';
import https from 'https';
import { reponseDatabase, reponseFirestore, isCheckData } from '../../../src/utils/helpers'
import OAuthKL from '../../../src/utils/helpers/oauthKL';
import _ from 'lodash'
import moment from 'moment';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // return res.status(401).json({ error: 'Error API' })
        const { body: { idMachine, transactionId } } = req
        if (!idMachine || !transactionId ) {
            return res.status(401).json({ error: 'Error query' })
        }
        console.log('Payment ==> !idMachine || !transactionId', idMachine, transactionId)
        const dateNow = moment().format("YYYY-MM-DD")
        const snapshot = await Database.PaymentZaloCheck(idMachine, transactionId)


        if (snapshot.val()) {
            const k = Object.keys(snapshot.val())
            const data = snapshot.val()[k]
            console.log("🚀 ~ handler ~ data:", data)
            return res.status(200).json({
                data: {
                    transactionId: data.app_trans_id,
                    status: 'Success'
                }
            })
            // return res.status(401).json({ error: 'Error machine' })

        } else {
            return res.status(401).json({ error: 'Error payment' })
        }
    } else {
        return res.status(401).json({ error: 'Error method' })
    }
}