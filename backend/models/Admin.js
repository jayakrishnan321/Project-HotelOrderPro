const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminname: { type: String, required: true },
  adminemail: { type: String, required: true, unique: true },
  adminmobilenumber: { type: String, required: true },
  adminpassword: { type: String, required: true },
});

module.exports = mongoose.model('Admin', adminSchema);
