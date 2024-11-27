const dotenv = require('./dotenvConfig')()
// const sgMail = require('@sendgrid/mail')
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  // host: 'ns3.accuratethai.com',
  // secureConnection: true,
  // tls: {
  //   rejectUnauthorized: true
  // },
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  // dkim: {
  //   domainName: "image-wash.com",
  //   keySelector: "2023",
  //   privateKey:"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDD1BpwBtB6kn6b\n6NRogl1bFR7x71w3eDybQ0BSoLYojwPEHXoRBB5gmszgFTkIbH7tXSYEvinGujVC\nz/wuQY8dxsl5FWH14I1XfMThLLFLDM/umSptnkb5kf81sHx5xdIf5QOYFFgfMQWa\nYgb6lq70gmMHgHsLGtn/PK7gZDS8CXU/zTj+sp+MfFiNLVn5f7WgYxzvXiinzbAU\nfFoZfmUn1OFhzyywz0VVG7Rw0i5RRCzNUAQ/uGh6Z1bBRNpu0+1/PcgXHWJvZQ+2\nTymXzDJNQD1dcaBdzD+Z0KrQyXbRvnknvHEWiAT5DYeFyl16PWmgnLWGh52K30Ld\n4vM4cdG9AgMBAAECggEAApfiUO0QuKuMSosK/w83zzrFq2Mf+UGfwR2dQ7843fbc\nhJC8ALTpgZ46dKd/qI7JQz9Os73JOBIGhttpS6P5wLzDWH59hQuSNFSNgBYnreaj\n69UVeQFhYOtNA5xjmIPfStQ+xke79o9rBOsSRorycAvPt1Mxok8gkD2IJT2JYptA\nsxiCUHCWyJUDEuON1lBZyefBvWhIa7aq5uXk61A97wc88XIgm/KS3HTliQ/tDSfK\nQJUxvnG+tNU3YGC75hYZyewSWNwJn7cy0d0GSZEORqDjtt+iwUKFW5wW+9gfCQbR\n0TeXyHzZWVT9IaN+4XzWVXxGnLG3AWbk81rkAAbLuQKBgQDtN49urWSuawwhUlff\nHYIy1z58Z0AhI+jPrfKosnpZRyq3a7m3DGiQQ/MGw/NUmAt5nHMFZMwV2gPVoP9h\nN1x3jw7fcCB0xzEQTDj/Cdz86s6TAjc+fAYSI/S4Va+Myike9C88BtWPmuyC+CjV\npCtgQUhpEZk21P2w7XUKp6CNeQKBgQDTVZbWWkoTMHmdkQjYXr9DHhFFPLZdYRMz\nG1IH+1MUNhMichWT0HH4+Y1mQgQLIIOn+P0vVjXThnzZqbHQNImGMewSicQy05Gv\n4ANWautmeC0Qep6WT14nF+nWOTYsRhDetKCTGWs+pPZ6rzhT+TOMVK9JwCOhmJ8e\nOWMjS7bJZQKBgDcEi9+/l3pcmZOg5YB595iTE4sG53jIO1bvoTg/LOFIAEBKW+h4\nmEfdeqA3ElisavzprEOz/SGUTw9dJ94EWQ3hwDFScDSlflupUg7U2sxOKVsvSGDV\noxLSBBA8z1p4CNGFEO97Jk0IQZKeu9nRGb5ZZdH4ovB0teIzMNInzrUBAoGABYOg\nMeudLy7+nVvhbTPbrbalILda0sjrpVO7KjYmjspyaV2srnSr5KEuTVK/pEKu7L0U\nbh3DvccujsdcumAEjpnS3RD3K5RVos8nhyO3DK9qDZoFdUqQ3FhFY6+OeE1Dt2vj\nHLN3FuVbAQx9XcOM0saK5FO9GkRPMoywx4T8OfkCgYBCgVtf/gbobZiLZ0Vxqwdc\ndbvfpyjnSGjPx+NAkVxapoa7RHnXv8JeWtcLwYqm/7wjbyxy1wou1FSTuFc3/Efm\ntA3FmLwzKoFhY2bfQHKi1aDLvmzH9oq5gruD9oimagqvrjK5AebfwH0keYkpXBpd\nuIZ58bA8832SL0fPAebV6A==\n-----END PRIVATE KEY-----\n"
  //   // privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDC06aPeRu0jgVY\n/HMBorahMVYDOoOZE6Y3sA3maMAtc5PJnL5DM7IAZJ2sj/9W7TSRbfn5OaGiuAZX\nt/8vVmM/BIw/fi51Ly2j+95sktqm5GdsIP9XAxKYNqTP+asvkCkuydYB4aM1J7Gi\nRr6m0DWAmnUclb3nru5IbG+qPFy8OMGRylAwcuVqdy2YzVptSSYVIDnaDSPpA1C4\n0cKZbK4o4PqiE7N5wr5PSEa3c2kx689cC8nzgHAIOrqpbPLrMI+iovbLldAuDaz3\nxkCx5RfibkKIw1pyoqrLDQnDDFDHPekJlIYvA9E9kfysU6YYvFMYYqK8mVBX3c5R\nF9hcY+SfAgMBAAECggEAXuKRpiKHmcHpXNNmd491fr/2chAXc4AcXdbCjkrJ/dji\nSzipeTU+Je7a0+Y1p3JTPdjf+79Tt1oEzMfx4m4iW9itLWcY3T2i7tCGHT7QeqOW\nsxTHBuuaLMPANQIVm06MoBrwvW3U/NheLPhjdf7Fb+LJ0qgjGykZJ/CX2cMYLxpj\neMfOFGntaoxA+7vRYlCdJmLRyRJIQOcraEL6JaqYbiaFUMwj6CbcQjgOgIgGWwXk\n3wcEP/QfenvgIY3O00ne+d2zHgMkoeEyAN8z5Jbio3iSVHnWhh7rbUl3QpDXfEHe\nB5NwJWqMSfpCzuXKa0k8VHnJ8wl9HWP7TinWocAxoQKBgQDpwExIT1FKKgUouH/m\nTttN2mzM38EitdPQj+ShjsEuDKCaI4yhYfkSWmRoBlWHlOBGyxktgzceN5KVfd9t\nScLV3EOlUz/VRbultkesVoQA5UhRL9wMjPClWienJvig+F7I8uqjmUkqJlZIuLqo\n84ZOGnJupF78QhtNxljNAkO/JwKBgQDVXuaEAPTu7zMoYBBDi5rYIAI7+RfgYumX\nS7NIFKAgYxjvponbLo9b5x/TZOrQutTVikJr39lr4IK3Y65fAsbIpai7Ab3r2k1H\n9xHxab7vu8FFN8LiCYUHkqOtKyFzGYg2W6kiJiAlqroNa2dhEqNf8oQdeFWpSc3q\n9R8oATgZyQKBgQC5tD5mTC2GwC9tFHb4H7n29gruEO29h7sJvOekumcbEIkfLBLz\nu4RHYmzWgAG/PzWWyI/uKorFhNz9ywyQJMOXZ/CODb9uzoGvu0rhzbH9jCqR5XXq\nuqYMl71c/IcWS3vyJZrn8kXAKMjv6WLSCvauYjB7WjbkLhjHB0dRR/VOjQKBgQDT\nx1XVP33cid6k/HQoFrCiQ2L0U9C3DnX7jU9tA8vLWZCujQXXXuc7uLOGBmxqsIX/\nTTOQDqamxDf5/h5cf0z+ai6HLrtrFUoPW9ObYfH50MmMAkSURg6b7Zg3kM+qhnUE\nPwYott7BhCsWlrwNRYqS+QrYlU+wr2iLBLDf7BXawQKBgQDfNOXXaa/sb4R9krfH\nC835+6pbU5rQuGY+4cYlb/O6z/u97v53MLeRrk/JaonieovctUJTq4Z7qu+KfJii\ni6w++6PlZ9OQ6jqxVC/FMjmVgbzprL8AJICOEqMRJ5nKmQ+mcxolDHnJfQayX7Mz\nDGo+rmABiYFR4aiuifZ/oCSVLw==\n-----END PRIVATE KEY-----\n"
  // }
});

 async function sendVerificationEmail(userEmail, template, actionLink){
  try {
   
   
    let info = await transporter.sendMail({
      from: "ImageWash <info@image-wash.com>", // sender address
      to: userEmail, // list of receivers
      subject: "ยืนยันการสมัครสมาชิกกับทาง อิมเมจ วอช", // Subject line
      text: `ขอบคุณที่สมัครกับเรา ไปที่ลิงก์ด้านล่างเพื่อยืนยันที่อยู่อีเมลของคุณ
       \n\n${actionLink} \n\nหากอีเมลนี้ไม่ได้ตั้งใจให้คุณลบทิ้งได้`, // plain text body
      html: template, // html body
    });
    return info
  } catch (error) {
    throw error
  }
}

 async function sendWelcomeEmail(userEmail,template){
  try {
   

    let info = await transporter.sendMail({
      from: "ImageWash <info@image-wash.com>", // sender address
      to: userEmail, // list of receivers
      subject: "ยินดีต้อนรับเข้าสู่ระบบออนไลน์ดูแลร้าน (Image Wash)", // Subject line
      text: `ขอบคุณที่สมัครกับเรา ไปที่ลิงก์ด้านล่างเพื่อยืนยันที่อยู่อีเมลของคุณ
        \n\nหากอีเมลนี้ไม่ได้ตั้งใจให้คุณลบทิ้งได้`, // plain text body
      html: template, // html body
    });
   
    return info
  } catch (error) {
    throw error
  }
}

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail
}