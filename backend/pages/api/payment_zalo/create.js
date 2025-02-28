import { Firestore, Database } from '../../../src/firebase'
import _ from "lodash";
import moment from "moment";
import axios from "axios";
import crypto from "crypto";

const config = {
    app_id: process.env.ZALO_APP_ID,
    key1: process.env.ZALO_KEY1,
    key2: process.env.ZALO_KEY2,
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
function digestDataWithKey(data, key) {
    return crypto.createHmac("sha256", key).update(data).digest("hex");
}

export default async function handler(req, res) {
    try {
        if (req.method === "POST") {
            const { idMachine, idProgram, type, time } = req.body;

            if(!idMachine || !idProgram){
                return res.status(401).json({ error: "Error query idMachine, idProgram" });
            }
            const snapshot = await Database.WashingMachineGetByIDMachine(idMachine)
            if (!snapshot.val()) {
                return res.status(401).json({ error: "Error idMachine" });
            }
            const dataMachine = snapshot.val()
            const dataFind = _.find(dataMachine, (e) => e.status != 99)
            if(_.isUndefined(dataFind) || !dataFind){
                return res.status(401).json({ error: "Error idMachine Remove" });
            }
            let amount = 0;
            const program = dataFind.program;
            let programFind = _.find(program, (e) => e.id == idProgram);
            programFind.idMachine = idMachine;
            if (!_.isUndefined(programFind) && programFind && programFind.status !== 99) {
                amount = programFind.price;
            } else {
                return res.status(401).json({ error: "Error idProgram" });
            }

            const embed_data = {};
    
            const items = [programFind];
            const transID = Math.floor(Math.random() * 1000000);
            const app_trans_id = `${moment().format('YYMMDD')}_${moment().unix()}`;
            const order = {
                app_id: config.app_id,
                app_trans_id: app_trans_id, // translation missing: en.docs.shared.sample_code.comments.app_trans_id
                app_user: "user123",
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: (amount * 746),
                description: `Test Payment Zalo - Payment for the order #${transID}`,
                bank_code: "zalopayapp",
                callback_url: "http://34.1.198.64/api/payment/callback_zalo",
            };
    
            // console.log("🚀 ~ handler ~ body:", crypto.HmacSHA256('a', 'a').toString())
            const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;

            const digestedData = await digestDataWithKey(data, config.key1);
            order.mac = digestedData;

            const response = await axios.post(config.endpoint, null, { params: order });

            return res.status(200).json({
                resDesc: "success",
                transactionId: app_trans_id,
                confirmId: idMachine,
                programFind: programFind,
                zaloRespone: response.data
            });
        }else {
            return res.status(401).json({ error: "Error method" });
        }
        
    } catch (error) {
        console.log('error', error)
        return res.status(401).json({ error: error });
    }
}