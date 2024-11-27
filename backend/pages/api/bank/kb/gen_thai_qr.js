import { Firestore, Database } from "../../../../src/firebase";
import axios from 'axios';
import _ from "lodash";
import https from 'https';
import fs from 'fs';
import OAuthKL from '../../../../src/utils/helpers/oauthKL';
import moment from "moment";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }
    try {
        
        const token = await Database.GetTokenKL();

        let response;
        if (token.val()) {
            response = token.val();
        } else {
            response = await OAuthKL();
            await Database.AddTokenKL(response);
        }
        
 
        const url = `${process.env.oauthKL}/v1/qrpayment/request`;
        const data = buildRequestData(amount);

        const authHeader = `Bearer ${response.access_token}`;
        const { key, cert, agent } = createHttpsAgent();

        const responseItem = await axios.post(url, data, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
                'env-id': 'QR002',
            },
            httpsAgent: agent,
        });

        return res.status(200).json({ data: responseItem.data });
    } catch (error) {
        console.log('🚀 ~ handler ~ error:', error);
        return callPost(req, res, amount);
    }
}

const buildRequestData = (amount) => {
    const partnerTxnUid = `UAT${moment().unix()}`;
    const reference1 = `INV${moment().format('YYYYMMDD')}`;
    const reference2 = `INV${moment().unix()}`;

    return {
        merchantId: process.env.merchantIdKL,
        partnerId: process.env.partnerIdKL,
        partnerSecret: process.env.partnerSecretKL,
        partnerTxnUid,
        qrType: '3',
        reference1,
        reference2,
        reference3: '',
        reference4: '',
        requestDt: new Date().toISOString(),
        txnAmount: amount,
        txnCurrencyCode: 'THB',
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

const callPost = async (req, res, amount) => {
    try {
        const response = await OAuthKL();
        await Database.AddTokenKL(response);

        const url = `${process.env.oauthKL}/v1/qrpayment/request`;
        const data = buildRequestData(amount);
        const authHeader = `Bearer ${response.access_token}`;
        const { key, cert, agent } = createHttpsAgent();

        const responseItem = await axios.post(url, data, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
                'env-id': 'QR002',
            },
            httpsAgent: agent,
        });

        return res.status(200).json({ data: responseItem.data });
    } catch (error) {
        console.log('🚀 ~ callPost ~ error:', error);
        return res.status(401).json({ error: error.message });
    }
};
