import { Firestore, Database } from "../../../../src/firebase";
import _ from "lodash";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { body } = req;
        // if (body.billPaymentRef1 && body.billPaymentRef2) {
        //     const wallet = _.split(body.billPaymentRef1, "WALLET");
        //     // const pay = _.split(body.billPaymentRef1, 'PAY')

        //     if (wallet.length === 2 && wallet[1].length === 9) { // เติมเงินเข้า wallet
        //         const phoneNumber = _.replace(body.billPaymentRef1, "WALLET", "+66");
        //         const snapshot = await Database.CustomerGetByPhone(phoneNumber);

        //         if (snapshot.val()) {
        //             const data = snapshot.val()[Object.keys(snapshot.val())];
        //             const param = {
        //                 keyUser: data.uid,
        //                 firstName: data.firstName,
        //                 lastName: data.lastName,
        //                 channel: 1,
        //                 activity: 1,
        //                 refWallet: body.transactionId,
        //                 amount: Number(body.amount),
        //                 status: 1,
        //                 phoneNumber: phoneNumber,
        //                 ref1: body.billPaymentRef1,
        //                 ref2: body.billPaymentRef2,
        //                 defaultAmount: data.amount || 0,
        //                 defaultPoint: data.point || 0,
        //                 refDefault: `${body.billPaymentRef1}_${body.billPaymentRef2}`,
        //                 birthDay: data.birthDay,
        //                 createAt: data.createAt,
        //                 level: data.level
        //             };
        //             await Database.WalletSet(param,1);
        //             // let bodys = req.body;
        //             // bodys.refDefault = `${body.billPaymentRef1}_${body.billPaymentRef2}`;
        //             // await Database.WalletSetCallback(bodys);
        //             //    return res.status(200).json({ data:param })
        //         }
        //     } else {
        //         if(body.billPaymentRef1.substr(0,2) === 'UP'){ //จ่ายผ่านพร้อมเพย์ เติมเวลา
        //             const refMachine = _.replace(body.billPaymentRef1, "UP", "");
        //             const snapshot = await Database.WashingMachineGetByChild(
        //                 "ref",
        //                 refMachine
        //             );
        //             if (snapshot.val()) {
        //                 const k = Object.keys(snapshot.val());
        //                 const data = snapshot.val()[k];
        //                 let bodys = req.body;
        //                 bodys.updateMachineTime = true;
        //                 bodys.keyBranch = data.branch;
        //                 bodys.keyMachine = k[0];
        //                 bodys.refDefault = `${body.billPaymentRef1}_${body.billPaymentRef2}`;
        //                 await Database.PaymentSetCallback(bodys);
        //                 //    return res.status(200).json({ data:param })
        //             }
        //         }else{
        //                 //จ่ายผ่านพร้อมเพย์
        //             const refMachine = _.replace(body.billPaymentRef1, "P", "");
        //             const snapshot = await Database.WashingMachineGetByChild(
        //                 "ref",
        //                 refMachine
        //             );
        //             if (snapshot.val()) {
        //                 const k = Object.keys(snapshot.val());
        //                 const data = snapshot.val()[k];
        //                 let bodys = req.body;
        //                 bodys.keyBranch = data.branch;
        //                 bodys.keyMachine = k[0];
        //                 bodys.refDefault = `${body.billPaymentRef1}_${body.billPaymentRef2}`;
        //                 await Database.PaymentSetCallback(bodys);
        //                 //    return res.status(200).json({ data:param })
        //             }
        //         }
        //     }
        // }
        let bodys = req.body;
        // bodys.refDefault = `${body.billPaymentRef1}_${body.billPaymentRef2}`;
        await Database.WalletSetCallbackTest(bodys);
        return res.status(200).json({
            resCode: "00",
            resDesc: "success",
            transactionId: '',
            confirmId: "",
        });
    } else {
        return res.status(401).json({ error: "Error method" });
    }
}