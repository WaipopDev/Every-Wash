import axios from 'axios';
import _ from "lodash";
import https from 'https';
import fs from 'fs';
import { Firestore, Database } from "../../../../src/firebase";
import OAuthKL from '../../../../src/utils/helpers/oauthKL';
import moment from "moment";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { typeStatus, partnerTxnUid } = req.body;

    if (!partnerTxnUid || !typeStatus) {
        return res.status(400).json({ error: 'required' });
    }


    try {

        let response = await OAuthKL()

        const url = `${process.env.oauthKL}/v1/qrpayment/v4/inquiry`;
        const data = buildRequestData(req.body);

        const authHeader = `Bearer ${response.access_token}`;
        const { key, cert, agent } = createHttpsAgent();
        let envID = ''
        switch (typeStatus) {
            case 'request':
                envID = 'QR004'
                break;
            case 'cancel':
                envID = 'QR005'
                break;
            case 'paid':
                envID = 'QR006'
                break;
            case 'voided':
                envID = 'QR007'
                break;
        }
        const responseItem = await axios.post(url, data, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
                'env-id': envID,
            },
            httpsAgent: agent,
        });

        return res.status(200).json({ data: responseItem.data });

    } catch (error) {
        console.log("🚀 ~ handler ~ error:", error)
        return res.status(400).json({ error: error.message });
    }
}
const buildRequestData = (data) => {
    const { partnerTxnUid } = data

    return {
        merchantId: process.env.merchantIdKL,
        partnerId: process.env.partnerIdKL,
        partnerSecret: process.env.partnerSecretKL,
        partnerTxnUid,
        requestDt: new Date().toISOString(),
        origPartnerTxnUid: partnerTxnUid,
    };
};

const createHttpsAgent = () => {
    const keyPath = process.env.keyPath;
    const certPath = process.env.certPath;

    const key = fs.readFileSync(keyPath);
    const cert = fs.readFileSync(certPath);

    const agent = new https.Agent({
        key,
        cert,
    });

    return { key, cert, agent };
};