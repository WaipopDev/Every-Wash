
import { Firestore, Database } from '../../../../src/firebase'
import _ from 'lodash'
import moment from 'moment'
import { weekOfMonth, reponseFirestore, reponseDatabase, startDate, endDate } from '../../../../src/utils/helpers'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query: { transactionId } } = req
        if (!transactionId) {
            return res.status(401).json({ error: 'Error query' })
        }
        try {
            const resPoint = await Database.PointRedemtionGetCheckTransaction(transactionId)
            if (resPoint.val()) {
                return res.status(200).json({ data: `ทำรายการสำเร็จ` })
            }
            return res.status(401).json({ error: `ไม่มีข้อมูล transactionId ${transactionId}` })

        } catch (error) {
            return res.status(401).json({ error: 'ไม่สามารถตรวจสอบข้อมูลได้' })
        }

    } else {
        return res.status(401).json({ error: 'ไม่สามารถตรวจสอบข้อมูลได้ การส่งข้อมูลไม่ถูกต้อง' })
    }
}