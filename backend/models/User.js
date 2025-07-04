const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  useremail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminemail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  otp: { type: String },
  otpExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
