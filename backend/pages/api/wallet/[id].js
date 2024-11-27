import axios from 'axios';
import { Firestore, Database } from '../../../src/firebase'

import _ from 'lodash'
import moment from 'moment';
import { reponseDatabase } from '../../../src/utils/helpers'
let headers = {
    "Content-Type": "application/json",
    "resourceOwnerId": process.env.resourceOwnerId,
    "requestUId": process.env.requestUId,
    "accept-language": "TH",
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query: { id: idCustomer, amount } } = req
        // return res.status(401).json({ error: 'Error API' })
        if (!idCustomer || !amount) {
            return res.status(401).json({ error: 'Error query' })
        }
        const snapshot = await Database.CustomerGetByKey(idCustomer)
        if (snapshot.val()) {
            const data = snapshot.val()
            const phoneNumber = _.replace(data.phoneNumber, '+66', '')
            const dataBody = {
                "applicationKey": process.env.resourceOwnerId,
                "applicationSecret": process.env.resourceSecretId
            }
            const response = await callPost(process.env.oauth, dataBody, headers)
            if (!_.isUndefined(response.data) && response.data.status.code === 1000) {
                const { accessToken } = response.data.data
                const ref1 = `WALLET${phoneNumber}`
                const ref2 = `T${moment().unix()}`
                const dataBodyQrcode = {
                    "qrType": "PP",
                    "ppType": "BILLERID",
                    "ppId": process.env.ppId,
                    "amount": amount,
                    "ref1": ref1,
                    "ref2": ref2,
                    "ref3": "CNZ"
                }
                headers.authorization = `Bearer ${accessToken}`
                const responseQrcode = await callPost(process.env.qrcode, dataBodyQrcode, headers)
                return res.status(200).json({ data: responseQrcode.data.data })
            } else {
                return res.status(401).json({ error: 'Error oauth' })
            }
        }
        return res.status(401).json({ error: 'Error auth' })
    } else if (req.method === 'POST') {
        const { query: { id: idCustomer }, body: { rawData } } = req
        if (!idCustomer) {
            return res.status(401).json({ error: 'Error query' })
        }
        const snapshot = await Database.CustomerGetByKey(idCustomer)
        if (snapshot.val()) {
            const data = snapshot.val()
            const exData = _.split(_.replace(rawData, new RegExp("0WL", "g"), '-'), '-')
            const exDataUp = _.split(_.replace(rawData, new RegExp("0UP", "g"), '-'), '-')
         
            if (exData.length && exData.length === 4) {
                const reCheck = await Database.WashingMachineGetByChild('ref', exData[0])
                const machine = reponseDatabase(reCheck)
                // activity = 1 เติมเเงิน 2 จ่ายเงิน
                const resCheckWallet = await Database.CheckWallet(`${exData[3]}${exData[2]}WELTH`)

                if (machine.length && _.values(resCheckWallet.val()).length === 0) {// จ่ายเงิน
                    const p = _.find(_.values(machine[0].program), e =>e.id === exData[1])
                    if(Number(data.amount) >= Number(p.price)){
                        const param = {
                            keyUser: data.uid,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            channel: 1,
                            activity: 2,
                            refWallet: `${exData[3]}${exData[2]}WELTH`,
                            amount: Number(p.price),
                            status: 1,
                            phoneNumber: data.phoneNumber,
                            ref1: exData[2],
                            ref2: exData[3],
                            defaultAmount: data.amount || 0,
                            defaultPoint: data.point || 0,
                            refDefault: `${exData[2]}_${exData[3]}`,
                            programId: exData[1],
                            branchId: machine[0].branch,
                            birthDay: data.birthDay,
                            createAt: data.createAt,
                            level: data.level
                        }
                        await Database.WalletSet(param,2)
                        let body = {
                            amount:   Number(p.price),
                            programId: exData[1],
                            branchId: machine[0].branch,
                            billPaymentRef1: exData[2],
                            billPaymentRef2: exData[3],
                            payeeAccountNumber: _.replace(data.phoneNumber, '+66', '0'),
                            payerAccountNumber: data.uid,
                            payerName: `${data.firstName} ${data.lastName}`,
                            transactionDateandTime: moment().unix() * 1000,
                            transactionId: `${exData[3]}${exData[2]}WELTH`,
                            transactionType: "WALLET",
                            refDefault: `${exData[2]}_${exData[3]}`
                        }
                        await Database.WalletSetCallback(body)  
                        return res.status(200).json({
                            data: {
                                transactionId: `${exData[3]}${exData[2]}WELTH`,
                                status: 'Success'
                            }
                        })
                    }
                }else{
                    return res.status(401).json({ error: 'Error payment transaction ID' })
                }
            }else if(exDataUp.length && exDataUp.length === 7){// จ่ายเงินแบบเติมเวลา
                const reCheck = await Database.WashingMachineGetByChild('ref', exDataUp[0])
                const machine = reponseDatabase(reCheck)
                const resCheckWallet = await Database.CheckWallet(`${exDataUp[3]}${exDataUp[2]}WELTH`)
                if (machine.length && _.values(resCheckWallet.val()).length === 0) {
                    if(Number(data.amount) >= Number(exDataUp[5])){
                    const param = {
                        keyUser: data.uid,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        channel: 1,
                        activity: 2,
                        refWallet: `${exDataUp[3]}${exDataUp[2]}WELTH`,
                        amount: Number(exDataUp[5]),
                        status: 1,
                        phoneNumber: data.phoneNumber,
                        ref1: exDataUp[2],
                        ref2: exDataUp[3],
                        defaultAmount: data.amount || 0,
                        defaultPoint: data.point || 0,
                        refDefault: `${exDataUp[2]}_${exDataUp[3]}`,
                        programId: exDataUp[1],
                        branchId: machine[0].branch,
                        birthDay: data.birthDay,
                        createAt: data.createAt,
                        level: data.level
                    }
                    await Database.WalletSet(param,2)
                    let body = {
                        amount:  Number(exDataUp[5]),
                        programId: exDataUp[1],
                        branchId: machine[0].branch,
                        billPaymentRef1: exDataUp[2],
                        billPaymentRef2: exDataUp[3],
                        payeeAccountNumber: _.replace(data.phoneNumber, '+66', '0'),
                        payerAccountNumber: data.uid,
                        payerName: `${data.firstName} ${data.lastName}`,
                        transactionDateandTime: moment().unix() * 1000,
                        transactionId: `${exDataUp[3]}${exDataUp[2]}WELTH`,
                        transactionType: "WALLET",
                        refDefault: `${exDataUp[2]}_${exDataUp[3]}`
                    }
                    await Database.WalletSetCallback(body)
                    return res.status(200).json({
                        data: {
                            transactionId: `${exDataUp[3]}${exDataUp[2]}WELTH`,
                            status: 'Success'
                        }
                    })
                    }
                }else{
                    return res.status(401).json({ error: 'Error payment transaction ID' })
                }
            }
            return res.status(401).json({ error: 'Error payment amount' })
        }
        return res.status(401).json({ error: 'Error auth' })
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