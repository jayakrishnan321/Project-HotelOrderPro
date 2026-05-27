const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin')
const User = require('../models/User')

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

router.post('/send-otp', async (req, res) => {
  const { name, email, password, mobilenumber, secretKey } = req.body;
  if (secretKey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Invalid Admin Secret' });
  }
  const existingAdmin = await Admin.findOne({ username: email });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = {
    otp,
    password,
    mobilenumber,
    name,
    createdAt: Date.now()
  };
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Admin OTP Verification',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Email sending error:', err);
      return res.status(500).json({ message: 'Failed to send email', error: err.message });
    }
    console.log('✅ OTP email sent:', info.response);
    res.status(200).json({ message: 'OTP sent to email' });
  });
});

router.post('/verify-otp', async (req, res) => {
  const { name, email, otp, mobilenumber, } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  const hashedPassword = await bcrypt.hash(record.password, 10);
  const newAdmin = new Admin({
    adminname: name,
    adminemail: email,
    adminpassword: hashedPassword,
    adminmobilenumber: mobilenumber,

  });

  await newAdmin.save();
  delete otpStore[email];

  res.status(201).json({ message: 'Admin registered successfully' });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ adminemail: email });
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, admin.adminpassword);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id, email: admin.adminemail, name: admin.adminname }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
  res.status(200).json({
    message: 'Login successful',
    token,

  });
});
router.put('/change-password/:id', async (req, res) => {
  try {
    const id = req.params.id
    const admin = await Admin.findById(id);
    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, admin.adminpassword);
    if (!isMatch) return res.status(400).json({ msg: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    admin.adminpassword = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating password" });
  }
})
router.get('/userlist/:adminemail', async (req, res) => {
  const email = req.params.adminemail
  try {
    const users = await User.find({ adminemail: email })
    res.json(users)
  } catch (err) {
    res.send(err)
  }
})

module.exports = router;

