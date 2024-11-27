
import { Firestore, Database } from '../../../../src/firebase'
import _ from 'lodash'
import moment from 'moment'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { query: { id: idMachine },
            body: {
                deviceID,
                timeStamp,
                serviceID,
                eventID
            } } = req

        if (!idMachine || !deviceID || !timeStamp || !serviceID || !eventID) {
            return res.status(401).json({ error: 'Error parameter' })
        }
        const log = {
            createAt: moment().unix(),
            idMachine,
            deviceID: deviceID,
            timeStamp: timeStamp,
            serviceID: serviceID,
            eventID: eventID
        }

        await Firestore.WashingMachineAddLogIOT(log)

        res.status(200).json({ data: 'Success', timeUpdate: moment().format("YYYY-MM-DD HH:mm:ss") })

    } else {
        return res.status(401).json({ error: 'Error method' })
    }
}