import axios from 'axios';
import _ from 'lodash'
import moment from 'moment';
let headers = {
    "Content-Type": "application/json",
    "resourceOwnerId": 'l71403cc14f1f14cc98bc24efff6c6e6fe',
    "requestUId": '85230887-e643-4fa4-84b2-4e56709c4ac4',
    "accept-language": "TH",
}
export default async function handler(req, res) {
    
        try {
            const dataBody = {
                "applicationKey": 'l71403cc14f1f14cc98bc24efff6c6e6fe',
                "applicationSecret": "907cf2ca14b4441bb96bc8d3b62ff7de"
            }
            const response = await callPost('https://api-uat.partners.scb/partners/v1/oauth/token', dataBody, headers)
            return res.status(200).json({ data: response })
            if (!_.isUndefined(response.data) && response.data.status.code === 1000) {
                const { accessToken } = response.data.data
                const ref1 = `WALLETTEST`
                const ref2 = `T${moment().unix()}`
                const dataBodyQrcode = {
                    "qrType": "PP",
                    "ppType": "BILLERID",
                    "ppId": '010552601807401',
                    "amount": '1',
                    "ref1": ref1,
                    "ref2": ref2,
                    "ref3": "CNZ"
                }
                headers.authorization = `Bearer ${accessToken}`
                const responseQrcode = await callPost('https://api-uat.partners.scb/partners/v1/payment/qrcode/create', dataBodyQrcode, headers)
                return res.status(200).json({ data: responseQrcode.data.data })
            } else {
                return res.status(401).json({ error: 'Error oauth' })
            }
        
        return res.status(401).json({ error: 'Error auth' })
        } catch (error) {
            res.status(401).json({ error: error })
        }
       
          
    
}

const callPost = (path, data, headers) => {
    return axios({
        method: 'POST',
        url: path,
        data: JSON.stringify(data),
        headers,
        responseType: 'json',
        withCredentials: true,
        validateStatus: (status) => {
            return true;
        },
    })
}