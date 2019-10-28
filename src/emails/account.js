const sgMail = require('@sendgrid/mail')

// spoofy message, buy domain, and verify email
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'test@example.com',
    subject: 'Welcome to Task Manager',
    text: `Welcome to the app, name: ${name}. Let me know how you get along.`
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'test@example.com',
    subject: 'Sorry to see you go',
    text: `Goodbye ${name}. I hope to see you back`
  })
}

module.exports = { sendCancellationEmail, sendWelcomeEmail }