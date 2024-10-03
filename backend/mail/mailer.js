const nodemailer = require("nodemailer")
require("dotenv").config()
const MyGmail = process.env.MYGMAIL
const MyPass = process.env.MYPASS
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MyGmail,
        pass: MyPass
    }
})

const notify = (to,sub,desc) => {
    const mailDetail = {
        from: `${MyGmail}`,
        to: `${to}`,
        subject: `${sub}`,
        text: `${desc}`
    }
    transporter.sendMail(mailDetail, (error, info) => {
        if (error) {
            console.log("An error occured while sending mail",error)
        }
        else {
            console.log("Message sent:", info.response)
        }
    })
}

module.exports=notify