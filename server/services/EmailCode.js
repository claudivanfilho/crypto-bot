import nodemailer from 'nodemailer'

const EXPIRATION_DATE_SECONDS = 60

export const generateVerificationCode = () => Math.ceil(Math.random(10) * 1000000)

export const generateExpirationDate = () => {
  const date = new Date()
  date.setTime(date.getTime() + 1000 * EXPIRATION_DATE_SECONDS)
  return date
}

export const isCodeValid = (code, user) => (
  user.verificationCode === code &&
  new Date() <= user.expirationDate
)

export const sendVerificationCode = (code, email) => {
  const transporter = nodemailer.createTransport({
    service: process.env.PROVIDER_NODEMAILER,
    auth: {
      user: process.env.EMAIL_TO_AUTH_NODEMAILER,
      pass: process.env.PASS_TO_AUTH_NODEMAILER,
    },
    port: 587,
    secure: false,
  })

  const mailOptions = {
    from: process.env.EMAIL_TO_AUTH_NODEMAILER,
    to: email,
    subject: 'CryptoBot Verification Code',
    text: `Your verification code is ${code}`,
  }

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent')
    }
  })
}
