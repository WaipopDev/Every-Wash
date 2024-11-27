import axios from 'axios';
import { Firestore, Database } from '../../../src/firebase'
import fs from 'fs';
import https from 'https';
import { reponseDatabase, reponseFirestore, isCheckData } from '../../../src/utils/helpers'
import OAuthKL from '../../../src/utils/helpers/oauthKL';
import _ from 'lodash'
import moment from 'moment';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query: { id: idMachine, amount, type, time } } = req
        // return res.status(401).json({ error: 'Error API' })
        // console.log('!idMachine || !amount', !idMachine || !amount)
            // return res.status(401).json({ error: 'Error query' })
        if (!idMachine || !amount) {
            return res.status(401).json({ error: 'Error query' })
        }
        const snapshot = await Database.WashingMachineGetByChild('id', idMachine)
        // console.log('reponseDatabase(snapshot).length', reponseDatabase(snapshot).length)
        if (reponseDatabase(snapshot).length) {
            const data = reponseDatabase(snapshot)[0]
            let resourceOwnerId = process.env.resourceOwnerId
            let requestUId = process.env.requestUId
            let resourceSecretId = process.env.resourceSecretId
            let ppId = process.env.ppId

            if (data.statusClosePay == false && data.closePayDate) {
                if (moment.unix(data.closePayDate).format('YYYYMMDD') <= moment().format('YYYYMMDD') && data.statusClosePay == false) {
                    return res.status(401).json({ error: 'ไม่สามารถใช้งานได้ เนื่องจากไม่มีการเปิดใช้ออนไลน์' })
                }
            }

            if (data.bankType == 'KBANK' && data.bankType != null) {
                return callKbank(data, amount, type, time, idMachine, res)
            }

            if (isCheckData(data.resourceOwnerId)) {
                resourceOwnerId = data.resourceOwnerId
            }
            if (isCheckData(data.requestUId)) {
                requestUId = data.requestUId
            }
            if (isCheckData(data.resourceSecretId)) {
                resourceSecretId = data.resourceSecretId
            }
            if (isCheckData(data.ppId)) {
                ppId = data.ppId
            }
            let headers = {
                "Content-Type": "application/json",
                "resourceOwnerId": resourceOwnerId,
                "requestUId": requestUId,
                "accept-language": "TH",
            }
            const dataBody = {
                "applicationKey": resourceOwnerId,
                "applicationSecret": resourceSecretId
            }
            const response = await callPost(process.env.oauth, dataBody, headers)
            if (!_.isUndefined(response.data) && response.data.status.code === 1000) {
                const { accessToken } = response.data.data
                let ref1 = `P${data.ref}`
                if (type && amount && time) {
                    ref1 = `UP${data.ref}`
                }

                const ref2 = `T${moment().unix()}`
                const dataBodyQrcode = {
                    "qrType": "PP",
                    "ppType": "BILLERID",
                    "ppId": ppId,
                    "amount": amount,
                    "ref1": ref1,
                    "ref2": ref2,
                    "ref3": "CNZ"
                }
                headers.authorization = `Bearer ${accessToken}`
                const responseQrcode = await callPost(process.env.qrcode, dataBodyQrcode, headers)
                let item = {}
                item.qrRawData = responseQrcode.data.data.qrRawData
                item.ref1 = ref1
                item.ref2 = ref2
                const pData = {
                    ...dataBodyQrcode,
                    ...{
                        qrRawData: responseQrcode.data.data.qrRawData,
                        idMachine,
                        type: type || '',
                        time: moment().unix(),
                        branch: data.branch,
                        branchName: data.branchName,
                        idIOT: data.idIOT,
                        nameMachine: data.name,
                    }
                }
                await Database.AddLogGetPaymentQRCode(pData)
                // console.log('first', resMachine.data());
                return res.status(200).json({ data: item })
            } else {
                return res.status(401).json({ error: 'Error oauth' })
            }
        }
        return res.status(401).json({ error: 'Error auth' })
    } else if (req.method === 'POST') {
        // return res.status(401).json({ error: 'Error API' })
        const { query: { id: idMachine, }, body: { ref1, ref2 } } = req
        if (!idMachine || !ref1 || !ref2) {
            return res.status(401).json({ error: 'Error query' })
        }
        console.log('Payment ==> !idMachine || !ref1, ref2', idMachine, ref1, ref2)
        const dateNow = moment().format("YYYY-MM-DD")
        const snapshot = await Database.PaymentCallbackCheck(ref1, ref2, dateNow)


        if (snapshot.val()) {
            const k = Object.keys(snapshot.val())
            const data = snapshot.val()[k]

            const snapshotMachine = await Database.WashingMachineCheck(data.keyMachine, idMachine)
            if (snapshotMachine.val()) {
                const data2 = snapshotMachine.val()
                if (data2.idIOT === idMachine) {
                    return res.status(200).json({
                        data: {
                            transactionId: data.transactionId,
                            status: 'Success'
                        }
                    })
                }
            }
            return res.status(401).json({ error: 'Error machine' })

        } else {
            return res.status(401).json({ error: 'Error payment' })
        }
    } else {
        return res.status(401).json({ error: 'Error method' })
    }
}

const callPost = (path, data, headers) => {
    return axios({
        method: 'POST',
        url: path,
        data: JSON.stringify(data),
        headers,
        responseType: 'json',
        withCredentials: true,
        validateStatus: (status) => {
            return true;
        },
    })
}

const callKbank = async (data, amount, type, time, idMachine, res) => {
    try {
        let ref1 = `P${data.ref}`
        if (type && amount && time) {
            ref1 = `UP${data.ref}`
        }
        const ref2 = `T${moment().unix()}`

        const token = await Database.GetTokenKL();

        let response = null;
        if (token.val()) {
            response = token.val();
        } else {
            response = await OAuthKL(data);
            await Database.AddTokenKL(response);
        }
        if(!response){
            return res.status(401).json({ error: 'Error oauth' })
        }
        const url = `${process.env.oauthKL}/v1/qrpayment/request`;
        const partnerTxnUid = `KPROD${moment().unix()}`;
        const reference1 = ref1;
        const reference2 = ref2;
        const dataBodyQrcode = {
            merchantId   : data.MERCHANT_ID_KL || process.env.merchantIdKL,
            partnerId    : data.PARTNER_ID_KL || process.env.partnerIdKL,
            partnerSecret: data.PARTNER_SECRET_KL || process.env.partnerSecretKL,
            partnerTxnUid,
            qrType: '3',
            reference1,
            reference2,
            reference3: '',
            reference4: '',
            requestDt: new Date().toISOString(),
            txnAmount: Number(amount),
            txnCurrencyCode: 'THB',
        };
      
        const authHeader = `Bearer ${response.access_token}`;
        const { key, cert, agent } = createHttpsAgent();
        const responseItem = await axios.post(url, dataBodyQrcode, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
                'env-id': 'QR002',
            },
            httpsAgent: agent,
        });
        console.log('dataBodyQrcode', responseItem.data)
        let item = {}
    // console.log('responseItem.data', responseItem.data)
        item.qrRawData = responseItem.data.qrCode
        item.ref1 = ref1
        item.ref2 = ref2

        const pData = {
            ...dataBodyQrcode,
            ...{
                qrRawData : responseItem.data.qrCode,
                idMachine,
                type       : type || '',
                time       : moment().unix(),
                branch     : data.branch,
                branchName : data.branchName,
                idIOT      : data.idIOT,
                nameMachine: data.name,
            }
        }
        await Database.AddLogGetPaymentQRCode(pData)
        return res.status(200).json({ data: item })
    } catch (error) {
        console.log("🚀 ~ callKbank ~ error:", error)
        return callPost2(res, amount, data, type, time, idMachine)
        // return res.status(401).json({ error: 'Error oauth' })
    }

}

const callPost2 = async (res, amount, data, type, time, idMachine) => {
    try {
        let ref1 = `P${data.ref}`
        if (type && amount && time) {
            ref1 = `UP${data.ref}`
        }
        const ref2 = `T${moment().unix()}`

        // const token = await Database.GetTokenKL();

        let response;
            response = await OAuthKL(data);
            await Database.AddTokenKL(response);
        
        const url = `${process.env.oauthKL}/v1/qrpayment/request`;
        const partnerTxnUid = `KPROD${moment().unix()}`;
        const reference1 = ref1;
        const reference2 = ref2;
        const dataBodyQrcode = {
            merchantId   : data.MERCHANT_ID_KL || process.env.merchantIdKL,
            partnerId    : data.PARTNER_ID_KL || process.env.partnerIdKL,
            partnerSecret: data.PARTNER_SECRET_KL || process.env.partnerSecretKL,
            partnerTxnUid,
            qrType: '3',
            reference1,
            reference2,
            reference3: '',
            reference4: '',
            requestDt: new Date().toISOString(),
            txnAmount: Number(amount),
            txnCurrencyCode: 'THB',
        };
        const authHeader = `Bearer ${response.access_token}`;
        const { key, cert, agent } = createHttpsAgent();
        const responseItem = await axios.post(url, dataBodyQrcode, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
                'env-id': 'QR002',
            },
            httpsAgent: agent,
        });
        let item = {}
    // console.log('responseItem.data', responseItem.data)
        item.qrRawData = responseItem.data.qrCode
        item.ref1 = ref1
        item.ref2 = ref2

        const pData = {
            ...dataBodyQrcode,
            ...{
                qrRawData : responseItem.data.qrCode,
                idMachine,
                type       : type || '',
                time       : moment().unix(),
                branch     : data.branch,
                branchName : data.branchName,
                idIOT      : data.idIOT,
                nameMachine: data.name,
            }
        }
        await Database.AddLogGetPaymentQRCode(pData)
        return res.status(200).json({ data: item })
    } catch (error) {
        console.log("🚀 ~ callKbank ~ error:", error)
        return res.status(401).json({ error: 'Error oauth' })
    }
};

const createHttpsAgent = () => {
    const keyPath = process.env.keyPath;
    const certPath = process.env.certPath;

    const key = fs.readFileSync(keyPath);
    const cert = fs.readFileSync(certPath);

    const agent = new https.Agent({
        key,
        cert,
    });

    return { key, cert, agent };
};