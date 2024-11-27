import axios from 'axios';
import { Firestore, Database } from '../../../src/firebase'

import _ from 'lodash'
import moment from 'moment';
import { reponseDatabase } from '../../../src/utils/helpers'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query: { id: idCustomer } } = req
        if (!idCustomer) {
            return res.status(401).json({ error: 'Error query' })
        }
        const snapshot = await Database.CustomerGetByKey(idCustomer)
        const snapshotLevel = await Database.GetDataLevel()
        if (snapshot.val() && snapshotLevel.val()) {
            const data = snapshot.val()
            const dataLevel = snapshotLevel.val()
            const ref1 = `${data.uid}`
            const ref2 = `T${moment().unix()}`
            const param = {
                keyUser      : data.uid,
                firstName    : data.firstName,
                lastName     : data.lastName,
                channel      : 1,
                activity     : 1,
                refWallet    : `${ref2}${ref1}`,
                amount       : dataLevel.walletDefault,
                status       : 1,
                ref1         : ref1,
                ref2         : ref2,
                branchId     : '',
                programId    : '',
                refDefault   : `${ref1}_${ref2}`,
                phoneNumber  : data.phoneNumber,
                defaultAmount: data.amount || 0,
                defaultPoint : data.point || 0,
                adminBy      : 'System',
                adminName    : 'System',
                remarks      : 'Point to wallet',
            }
            const usePoint = data.usePoint || 0
            const point = (data.point || 0) - usePoint

            const param2 = {
               usePoint: usePoint + dataLevel.pointToWallet
            }
          
            if(point >= dataLevel.pointToWallet){
                await Database.CustomerUpdateByID(data.uid,param2)
                await Database.WalletSetByAdmin(param)
            }
            return res.status(200).json({ data: 'ok' })
        }
        return res.status(401).json({ error: 'Error id customer' })
    }
}