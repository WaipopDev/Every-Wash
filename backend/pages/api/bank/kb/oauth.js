import { Firestore, Database } from "../../../../src/firebase";
import axios from 'axios';
import _ from "lodash";
import https from 'https';
import fs from 'fs';

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {

            const url = `${process.env.oauthKL}/v2/oauth/token`;
            const data = 'grant_type=client_credentials';
            const encode = Buffer.from(`${process.env.consumerIdKL}:${process.env.consumerSecretKL}`).toString('base64');
            const authHeader = `Basic ${encode}`;
            const keyPath = process.env.keyPath;
            const certPath = process.env.certPath;

            const key = fs.readFileSync(keyPath);
            const cert = fs.readFileSync(certPath);
            const agent = new https.Agent({
                key: key,
                cert: cert
              });
              
            const response = await axios.post(url, data, {
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                httpsAgent: agent
              })
            return res.status(200).json({
                data: response.data
            });
            
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Error method" });
    }
}