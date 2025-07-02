const mongoose = require('mongoose');

const  FoodSchema= new mongoose.Schema({
  foodname: { type: String, required: true },
  foodtype: { type: String, required: true, unique: true },
  foodprice: { type: String, required: true }, 
  foodimage: { type: String, required: true },
  fooddescription:{type:String,required:true},

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',  
    required: true
  }

});

module.exports = mongoose.model('Foods',FoodSchema);
