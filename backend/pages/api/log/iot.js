
import { Firestore, Database } from '../../../src/firebase'
import _ from 'lodash'
import moment from 'moment'
import { weekOfMonth, reponseFirestore,reponseDatabase, startDate, endDate } from '../../../src/utils/helpers'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { query: { id: idMachine },
            body: {
                idProgram,
                priceType,
                transactionId,
                timestamp,
            } } = req

        if (!idProgram || !timestamp || !transactionId || !priceType) {
            return res.status(401).json({ error: 'ไม่สามารถบันทึกข้อมูลได้' })
        }
       
        await Database.AddLogIOTTimeOut(req.body)
        res.status(200).json({ data: 'บันทึกข้อมูลสำเร็จ' })
    } else {
        return res.status(401).json({ error: 'Error method' })
    }
}