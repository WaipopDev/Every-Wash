
import { Firestore, Database } from '../../../../src/firebase'
import _ from 'lodash'
import { reponseFirestore } from '../../../../src/utils/helpers'

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Change "*" to your domain if needed
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    try {
        if (req.method === 'GET') {
            const { query: { id } } = req
            if(!id){
                return res.status(401).json({ error: 'Error query' })
            }
            let resData1 = await Firestore.ProgramWashingMachineByBranchGet(id)
            let resData2 = await Firestore.ProgramClothesDryerByBranchGet(id)
            resData1 = reponseFirestore(resData1)
            resData2 = reponseFirestore(resData2)
            const formattedData = [...resData1,...resData2]
            res.status(200).json({ data: formattedData })
        } else {
            return res.status(401).json({ error: 'Error method' })
        }
    } catch (e) {
        return res.status(401).json({ error: e })
    }
}