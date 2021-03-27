const express = require('express');
const nm = require('node-mailer);

const app = express();

app.use(express.json());


app.get('/',(req,res,err)=>{
   res.send('index.js');
});
