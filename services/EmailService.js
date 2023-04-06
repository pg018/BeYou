const nodemailer = require('nodemailer')

class EmailService {
  constructor() {
    this.email = 'beyoupvtltd@gmail.com'
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.email,
        pass: 'dlyoktpmjltunqkw',
      },
    })
  }

  sendMail(to, subject, message) {
    const mailOptions = {
      from: this.email,
      to: to,
      subject: subject,
      text: message,
    }

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('email sent')
      }
    })
  }
}

module.exports = EmailService
