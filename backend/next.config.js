
const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  reactStrictMode: true,
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  },
  images: {
    domains: ['https://firebasestorage.googleapis.com/','firebasestorage.googleapis.com','localhost'],
  },
  api: {
    externalResolver: true,
  },
  env:{
    oauth           : process.env.PROD_OAUTH,
    resourceOwnerId : process.env.PROD_RESOURCE_OWNER_ID,
    resourceSecretId: process.env.PROD_RESOURCE_SECRET_ID,
    requestUId      : process.env.PROD_REQUEST_UID,
    qrcode          : process.env.PROD_QRCODE,
    ppId            : process.env.PROD_PPID,

    apiKey           : process.env.PROD_APIKEY,
    authDomain       : process.env.PROD_AUTHDOMAIN,
    projectId        : process.env.PROD_PROJECT_ID,
    storageBucket    : process.env.PROD_STORAGE_BUCKET,
    messagingSenderId: process.env.PROD_MESSAGING_SENDER_ID,
    appId            : process.env.PROD_APP_ID,
    databaseURL      : process.env.PROD_DATABASE_URL,
    measurementId    : process.env.PROD_MEASUREMENT_ID,

    sendMail: process.env.PROD_SEND_MAIL,

    oauthKL         : process.env.PROD_OAUTH_KL,
    consumerIdKL    : process.env.PROD_CONSUMER_ID_KL,
    consumerSecretKL: process.env.PROD_CONSUMER_SECRET_KL,
    partnerIdKL     : process.env.PROD_PARTNER_ID_KL,
    partnerSecretKL : process.env.PROD_PARTNER_SECRET_KL,
    merchantIdKL    : process.env.PROD_MERCHANT_ID_KL,

    keyPath : process.env.PROD_KEY_PATH,
    certPath: process.env.PROD_CERT_PATH,
  }
}
