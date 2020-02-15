const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const bender = require('./quotes.json');


admin.initializeApp();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().benderquotemail.email,
        pass: functions.config().benderquotemail.pass
    }
});


exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const dest = req.query.dest;

        const mailOptions = {
            from: 'Bender Quote <benderquote@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'BENDER IS AWESOME!!!', // email subject
            html: `<p style="font-size: 16px;">
            ${bender[Math.floor(Math.random() * bender.length)]} <br>
            - Bender Bending Rodríguez!!
            </p>
                <br />
                <img src="http://pngimg.com/uploads/futurama/futurama_PNG94.png" style="width: 200px; height: auto;"/>
                <div>
                </div>
            ` // email content in HTML
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sent');
        });
    });
});
