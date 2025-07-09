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
    const { foodname, foodtype, foodnonacprice, foodacprice, fooddescription, adminId, adminemail } = req.body;

    console.log('BODY:', req.body);        // ✅ Add for debugging
    console.log('FILE:', req.file);        // ✅ Should exist

    const food = new Food({
      foodname,
      foodtype,
      foodnonacprice,
      foodacprice,
      fooddescription,
      foodimage: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      adminId,
      adminemail
    });

    await food.save();
    res.status(201).json({ message: 'Food item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload food item' });
  }
});
router.get('/fooditems/:id', async (req, res) => {
  const foods = await Food.find({ adminId: req.params.id })
  res.json(foods);
});
router.get('/users/fooditems/:email', async (req, res) => {
  const email = req.params.email.toLowerCase(); // Optional: normalize
  const foods = await Food.find({ adminemail: email });
  res.json(foods);
});
router.get('/:id', async (req, res) => {
  const foods = await Food.findById(req.params.id)
  res.json(foods)
})

router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'food not found' });

    res.status(200).json({ message: 'fooditem deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});
router.put('/edit/:id', upload.single('foodimage'), async (req, res) => {
  try {
    const { foodname, foodtype, foodnonacprice, foodacprice, fooddescription } = req.body;

    const updateFields = {
      foodname,
      foodtype,
      foodnonacprice,
      foodacprice,
      fooddescription
    };

    if (req.file) {
      updateFields.foodimage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await Food.findByIdAndUpdate(req.params.id, updateFields);
    res.status(200).json({ message: 'Food updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});
module.exports = router;
