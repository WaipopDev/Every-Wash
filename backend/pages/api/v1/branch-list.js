
import { Firestore, Database } from '../../../src/firebase'
import _ from 'lodash'
import { reponseFirestore } from '../../../src/utils/helpers'

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            let resData = await Firestore.BranchGet()
            resData = reponseFirestore(resData)
            const formattedData = resData.map(item => ({
                id: item.docId,
                name: item.name
            }))
            res.status(200).json({ data: formattedData })
        } else {
            return res.status(401).json({ error: 'Error method' })
        }
    } catch (e) {
        return res.status(401).json({ error: e })
    }
}