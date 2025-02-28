import { Firestore, Database } from '../../../src/firebase'
import _ from "lodash";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { body } = req;
        console.log("🚀 ~ handler ~ body:", body.data)
        if(!body.data){
            return res.status(401).json({ error: "Error query" });
        }
        await Database.PaymentZaloCreate(JSON.parse(body.data));
        return res.status(200).json({
            resCode: "00",
            resDesc: "success",
            // transactionId: body.transactionId,
            confirmId: "",
        });
    }else {
        return res.status(401).json({ error: "Error method" });
    }
}