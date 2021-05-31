const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'leahzeisner@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the Task Manager App, ${name}! Let me know how you get along with the app.`
    })
}


const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'leahzeisner@gmail.com',
        subject: "We're sorry to see you go :(",
        text: `Goodbye, ${name}! Is there anything we could've done to have kept you on board? Hope to see you back soon!`
    })
}


module.exports = { sendWelcomeEmail, sendCancelationEmail }