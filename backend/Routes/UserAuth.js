const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User')
const Admin = require('../models/Admin')
const { isGuestLogin, GUEST_EMAIL, GUEST_PASSWORD } = require('../utils/guestLogin')

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
router.post('/send-otp', async (req, res) => {
  const { name, useremail, adminemail, password } = req.body;
  console.log(req.body)


  if (!name || !useremail || !adminemail || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ useremail });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp)
  otpStore[useremail] = {
    otp,
    password,
    name,
    adminemail, // ADD THIS if needed later
    createdAt: Date.now()
  };

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: useremail,
    subject: 'User OTP Verification',
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
  const { name, useremail, adminemail, otp } = req.body;
  const record = otpStore[useremail];

  if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  const hashedPassword = await bcrypt.hash(record.password, 10);
  const newUser = new User({
    name,
    useremail,
    adminemail,
    password: hashedPassword,
    status: 'pending',
  });

  await newUser.save();
  delete otpStore[useremail];

  // ✅ Send approval email to admin
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: adminemail,
    subject: 'User Approval Request',
    html: `
      <h3>User Registration Approval</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${useremail}</p>
      <p>Please review and approve or reject this user in the admin panel.</p>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Failed to send approval email to admin:', err);
    } else {
      console.log('✅ Approval request email sent to admin:', info.response);
    }
  });

  res.status(201).json({ message: 'User registered and approval request sent to admin' });
});
// GET pending users for a specific admin
router.get('/pending/:adminemail', async (req, res) => {
  try {
    const adminEmail = req.params.adminemail;

    const pendingUsers = await User.find({
      status: 'pending',
      adminemail: adminEmail
    });

    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending users' });
  }
});
router.patch('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await User.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});
router.post('/login', async (req, res) => {
  const { useremail, password } = req.body;
  console.log(req.body)

  try {
    let user;

    if (isGuestLogin(useremail, password)) {
      user = await User.findOne({ useremail: GUEST_EMAIL });
      if (!user) {
        user = await User.findOne({ status: 'approved' }).sort({ _id: 1 });
      }
      if (!user) {
        const admin = await Admin.findOne().sort({ _id: 1 });
        user = await User.create({
          name: 'Guest Staff',
          useremail: GUEST_EMAIL,
          adminemail: admin?.adminemail || GUEST_EMAIL,
          password: await bcrypt.hash(GUEST_PASSWORD, 10),
          status: 'approved',
        });
      }
    } else {
      user = await User.findOne({ useremail });
      if (!user) return res.status(400).json({ message: 'User not found' });

      if (user.status !== 'approved') {
        return res.status(403).json({ message: `Access denied. Status: ${user.status}` });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.useremail, name: user.name, role: 'user', adminemail: user.adminemail },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});
router.put('/change-password/:id', async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id);
    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating password" });
  }
})

module.exports = router;