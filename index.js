const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieSession = require('cookie-session');

const Notion = require('./models/notion.js');
const User = require('./models/user.js');


const {
   auth,
   sendEmail,
   getTime
} = require('./helper/functions.js');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'))
app.use(cookieSession({keys:['qqqpwoeirutylaksjdhfgzmxncbvewasscjggjcjgcmnncjhduxhgfddd']}));
app.set('view engine','ejs')


mongoose.connect('<your database connection string>',{
   useNewUrlParser: true,
   useUnifiedTopology: true
},()=>console.log('connected to db'));


setInterval(async()=>{
   const data = await Notion.find();
   const now = await getTime();
   const list = data.find(obj =>{
      if(obj.secs < now.valueOf()){
         return true;
      }
   });
   if(list){
      try{
         sendEmail(list);
         await Notion.deleteOne({ _id : list._id});
      }catch(err){
         console.error(err);
      }
   }
},5000);

console.log(new Date());

app.get('/signin',(req,res)=>{
   res.sendFile(path.join(__dirname,'public/signin.html'));
})

app.post('/signin',async(req,res)=>{
   let data = await User.find();
   if(req.body.email === data[0].email && req.body.auth === data[0].password){
      req.session.user = data[0].email;
   }
   res.redirect('/');
})


app.get('/',auth,async(req,res,err)=>{
   let data = await Notion.find();
   res.render('index.ejs',{data});
})

app.post('/set',auth,async(req,res)=>{
   const date = new Date((req.body.time));
   req.body.secs = date.valueOf();
   const notion = new Notion(req.body);
   await notion.save().then(e => {
      console.log("success    ::",e);
   }).catch(e=>{
      res.send(e)
   })
   res.redirect('/');
})

app.post('/delete',auth,async(req,res,err)=>{
   id = req.body.id;
   await Notion.deleteOne({_id:id});
   res.redirect('/');
})


app.listen(process.env.PORT||4000,()=>{
   console.log(`listing on port ${process.env.PORT||4000}`);
});
