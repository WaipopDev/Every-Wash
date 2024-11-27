import axios from 'axios';
import _ from "lodash";
import https from 'https';
import fs from 'fs';

export default async function OAuthKL(dataConfig) {
    try {

        const url = `${process.env.oauthKL}/v2/oauth/token`;
        const data = 'grant_type=client_credentials';
        const encode = Buffer.from(`${dataConfig.CONSUMER_ID_KL || process.env.consumerIdKL}:${dataConfig.CONSUMER_SECRET_KL || process.env.consumerSecretKL}`).toString('base64');
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
        return  response.data
        
    } catch (error) {
        return error.message
    }
}