const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const User = require('../models/user.js');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendEmail(data){
   const access_token = OAuth2Client.getAccessToken();
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.gmail,
         type: 'OAuth2',
         clientId: CLIENT_ID,
         clientSecret: CLIENT_SECRET,
         refreshToken: REFRESH_TOKEN,
         accessToken: access_token
      }
   });

   const mailOptions = {
      from: `D.R.Lenin 📧<${process.env.gmail}>`,
      to: data.email,
      subject: data.title,
      text: 'Hi'
   };

   if(data.message !== '')
      mailOptions.text = data.message;
   if(data.html !=='')
      mailOptions.html = data.html;

   transporter.sendMail(mailOptions, function(error, info){
      if (error) {
         console.log(error);
      } else {
         console.log('Email sent: ' + info.response);
      }
   });

   console.log(mailOptions);
};

async function auth(req,res,next){
   let data = await User.find();
   if(req.session.user !== data[0].email ){
      console.log('succccc');
      return res.redirect('/signin');
   }
   next();
}

async function getTime(){
   const d = new Date();
   const ltime = d.getTime();
   const loffset = d.getTimezoneOffset()*60000;
   const utc = ltime + loffset;
   const localTimeSec =  utc + (3600000 * 5.5);
   const date = new Date(localTimeSec);
   return date;
}

module.exports = {
   auth,
   sendEmail,
   getTime
}
