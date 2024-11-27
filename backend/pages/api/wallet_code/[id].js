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
    if (req.method === 'POST') {
        const { query: { id: idCustomer }, body: { rawData,dataCode,dataDefault } } = req
        if (!idCustomer && !rawData && !dataCode && !dataDefault) {
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
                // activity = 1 จ่ายเงิน 2 เติมเเงิน
                if (machine.length) {
                    const p = _.find(_.values(machine[0].program), e =>e.id === exData[1])
                    if(data.codePromotion[dataCode.id].endDate >= moment().unix()){
                        if(Number(data.codePromotion[dataCode.id].baht) >= Number(dataDefault.price)){
                            const param = {
                                keyUser: data.uid,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                channel: 1,
                                activity: 2,
                                refWallet: `${exData[3]}WELTH`,
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
                                dataCode,
                                dataDefault
                            }
                            await Database.WalletCodeSet(param)
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
                                transactionId: `${exData[3]}WELTH`,
                                transactionType: "WALLET",
                                refDefault: `${exData[2]}_${exData[3]}`,
                                dataCode,
                                dataDefault
                            }
                            await Database.WalletSetCallback(body)  
                            return res.status(200).json({
                                data: {
                                    transactionId: `${exData[3]}WELTH`,
                                    status: 'Success'
                                }
                            })
                        }else{
                            return res.status(401).json({ error: 'Error payment amount' }) 
                        }
                    }else{
                        return res.status(401).json({ error: 'Error payment expired' }) 
                    }
                }
            }else if(exDataUp.length && exDataUp.length === 7){
                const reCheck = await Database.WashingMachineGetByChild('ref', exDataUp[0])
                const machine = reponseDatabase(reCheck)
                if (machine.length) {
                    if(data.codePromotion[dataCode.id].endDate >= moment().unix()){
                    if(Number(data.codePromotion[dataCode.id].baht) >= Number(dataDefault.price)){
                        const param = {
                            keyUser: data.uid,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            channel: 2, // 1 promtpay 2 code 
                            activity: 2,
                            refWallet: `${exDataUp[3]}WELTH`,
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
                            dataCode,
                            dataDefault
                        }
                        await Database.WalletCodeSet(param)
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
                            transactionId: `${exDataUp[3]}WELTH`,
                            transactionType: "WALLET",
                            refDefault: `${exDataUp[2]}_${exDataUp[3]}`,
                            dataCode,
                            dataDefault
                        }
                        await Database.WalletSetCallback(body)
                        return res.status(200).json({
                            data: {
                                transactionId: `${exDataUp[3]}WELTH`,
                                status: 'Success'
                            }
                        })
                        }else{
                            return res.status(401).json({ error: 'Error payment amount' }) 
                        }
                    }else{
                        return res.status(401).json({ error: 'Error payment expired' }) 
                    }
                }else{
                    return res.status(401).json({ error: 'Error payment amount' }) 
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