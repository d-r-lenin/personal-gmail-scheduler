const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   title:{
      type:"string"
   },
   name:{
      type:"string"
   },
   time:{
      type:"string",
      required:true
   },
   secs:{
      type:"number",
      required:true
   },
   message:{
      type:"string",
   },
   email:{
      type:"string",
      required:true
   },
   html:{
      type:"string"
   }
});

const Notion = mongoose.model('notion',schema);

module.exports = Notion;
