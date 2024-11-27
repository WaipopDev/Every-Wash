
import { Firestore, Database } from '../../../src/firebase'
import _ from 'lodash'
import moment from 'moment'
import { weekOfMonth, reponseFirestore,reponseDatabase, startDate, endDate } from '../../../src/utils/helpers'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            body: {
                phoneNumber,
                price,
                priceType,
                transactionId,
                idMachine,
                idProgram
            } } = req

        if (!phoneNumber || !priceType || !transactionId || !price || !idMachine || !idProgram) {
            return res.status(401).json({ error: 'ไม่สามารถบันทึกข้อมูลได้' })
        }
       try {
           const newPhoneNumber = _.replace(phoneNumber, '0', '+66');
           const resUser =  await Database.getUserByPhone(newPhoneNumber)
           if(resUser.val()){
            let resPoint =  await Database.GetDataLevel()
            let resMachine = await Database.WashingMachineGetByChild('id',idMachine)
            resPoint = resPoint.val()
            resMachine = resMachine.val()
            if(resMachine){
                const user = _.values(resUser.val())[0]
                resMachine = _.values(resMachine)[0]
                if(resMachine.status == 2){
                    const param = {
                        date        : moment().unix(),
                        keyUser     : user.uid,
                        firstName   : user.firstName,
                        lastName    : user.lastName,
                        activity    : 2, //activity = 1 เติมเเงิน 2 จ่ายเงิน
                        phoneNumber : user.phoneNumber,
                        point       : (Number(price)/ resPoint.pointDefault).toFixed(0),
                        status      : 1,
                        activityType: 1,   // 1 ได้ 2 ตัด
                        defaultPoint: user.point || 0,
                        level       : user.level,
                        idMachine,
                        idProgram,
                        transactionId,
                        priceType,
                        price
                    }
                    await Database.addPointByMachine(param)
                    return res.status(200).json({ data: 'บันทึกข้อมูลสำเร็จ' })
                }
               
            }
            return res.status(401).json({ error: `ไม่มี Machine นี้` })
        }
        return res.status(401).json({ error: `ไม่มี User นี้ ${phoneNumber}` })

       } catch (error) {
            return res.status(401).json({ error: 'ไม่สามารถบันทึกข้อมูลได้' })
       }
        
    } else {
        return res.status(401).json({ error: 'ไม่สามารถบันทึกข้อมูลได้ การส่งข้อมูลไม่ถูกต้อง' })
    }
}