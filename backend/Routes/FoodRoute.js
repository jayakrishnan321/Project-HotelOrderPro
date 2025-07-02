const express = require('express');
const router = express.Router();
const multer = require('multer');
require('dotenv').config();
const Food = require('../models/Foods');

// ✅ Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// ✅ Only allow images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter: imageFilter });

// ✅ POST route to upload food
router.post('/upload', upload.single('foodimage'), async (req, res) => {
  try {
    const { foodname, foodtype, foodprice, fooddescription, adminId } = req.body;

    console.log('BODY:', req.body);        // ✅ Add for debugging
    console.log('FILE:', req.file);        // ✅ Should exist

    const food = new Food({
      foodname,
      foodtype,
      foodprice,
      fooddescription,
      foodimage: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      adminId
    });

    await food.save();
    res.status(201).json({ message: 'Food item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload food item' });
  }
});

module.exports = router;
