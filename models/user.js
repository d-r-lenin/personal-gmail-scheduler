const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   password:{
      type:"string",
      required:true
   },
   email:{
      type:"string",
      required:true
   }
});

const  User = mongoose.model('user',schema);

module.exports = User;
