const express = require('express')
const Cors = require('cors')
const dotenv = require('./dotenvConfig')()
const admin = require("firebase-admin")
const serviceAccount = require('./accountKey')
const {getAuth} = require("firebase-admin/auth")
const ejs = require('ejs')
const {sendVerificationEmail,sendWelcomeEmail} = require('./sendEmails')

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const corsOption = {
  origin: '*',
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
}

const PORT = process.env.PORT || 8000

const app = express()

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(Cors(corsOption))
app.use(express.json())
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://staging.image-wash.com','https://production.image-wash.com'],
//   methods: ['GET', 'POST'],
//   credentials: true
// }))
// app.use(express.static('public')); 
app.use('/images', express.static('images'));
// routes
app.get('/', async (req, res) => {
  res.status(200).send('Welcome to my API')
})
app.get('/verify', async (req, res) => {
  
  const template = await ejs.renderFile('views/verify-email.ejs', {
    actionLink:'as',
    randomNumber: Math.random(),
    host:'http://localhost:2525',
    userEmail:'as@as.co'
  })
  // res.render(template)
  res.send(template)
})
app.get('/welcome', async (req, res) => {
  
  const template = await ejs.renderFile('views/welcome.ejs', {
    randomNumber: Math.random(),
    host:'http://localhost:2525',
    actionLink:'as',
  })
  // res.render(template)
  res.send(template)
})
app.post('/send-welcome-email', async (req, res) => {
  const {userEmail, redirectUrl} = req.body
  const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if(!userEmail?.match(emailValidate)){
    return res.status(401).json({message: 'Invalid email'})
  }else if(!redirectUrl || typeof redirectUrl !== 'string'){
    return res.status(401).json({message: 'Invalid redirectUrl'})
  }
  try {
    const template = await ejs.renderFile('views/welcome.ejs', {
      actionLink:`${process.env.HOST_WEB}/singin`,
      randomNumber: Math.random(),
      host:process.env.HOST_IMAGE
    })
    await sendWelcomeEmail(userEmail,template)
    res.status(200).json({message:'Email successfully sent'})
  } catch (error) {
    const message = error.message
    res.status(500).json({message})
  }
})

app.post('/send-verification-email', async (req, res) => {
  const {userEmail, redirectUrl} = req.body
  const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  if(!userEmail?.match(emailValidate)){
    return res.status(401).json({message: 'Invalid email'})
  }else if(!redirectUrl || typeof redirectUrl !== 'string'){
    return res.status(401).json({message: 'Invalid redirectUrl'})
  }
  const actionCodeSettings = {
    url: redirectUrl
  }
  
  try{
    const fullUrl = `${req.protocol}://${req.hostname}`;
    const actionLink =  await getAuth()
    .generateEmailVerificationLink(userEmail, actionCodeSettings)
   
    const template = await ejs.renderFile('views/verify-email.ejs', {
      actionLink,
      randomNumber: Math.random(),
      host:process.env.HOST_IMAGE,
      userEmail
    })
    await sendVerificationEmail(userEmail, template, actionLink)
    res.status(200).json({message:'Email successfully sent'})
  }catch(error){
    const message = error.message
    if(error.code === 'auth/user-not-found'){
      return res.status(404).json({message})
    }
    if(error.code === 'auth/invalid-continue-uri'){
      return res.status(401).json({message})
    }
    res.status(500).json({message})
  }
})

// listener
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`)
})