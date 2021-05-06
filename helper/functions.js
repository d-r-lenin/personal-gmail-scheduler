const nodemailer = require('nodemailer');

const User = require('../models/user.js');

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.gmail,
      pass: process.env.pass
   }
});

async function sendEmail(data){
   const mailOptions = {
      from: process.env.gmail,
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
