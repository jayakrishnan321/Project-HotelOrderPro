const express = require('express');
const router = express.Router();
const multer = require('multer');

const Food = require('../models/Foods');
const { uploadToS3, deleteFromS3 } = require('../utils/s3Upload');

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter: imageFilter });

function s3Configured() {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_S3_BUCKET_NAME &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
  );
}

// POST route to upload food (image → S3, URL saved in MongoDB)
router.post('/upload', upload.single('foodimage'), async (req, res) => {
  try {
    console.log('[FoodRoute] POST /api/foods/upload');

    if (!s3Configured()) {
      const missing = [
        !process.env.AWS_REGION && 'AWS_REGION',
        !process.env.AWS_S3_BUCKET_NAME && 'AWS_S3_BUCKET_NAME',
        !process.env.AWS_ACCESS_KEY_ID && 'AWS_ACCESS_KEY_ID',
        !process.env.AWS_SECRET_ACCESS_KEY && 'AWS_SECRET_ACCESS_KEY',
      ].filter(Boolean);

      console.error('[FoodRoute] S3 not configured. Missing:', missing);
      console.log(process.env.AWS_REGION);
console.log(process.env.AWS_S3_BUCKET_NAME);
      return res.status(503).json({
        error: 'File storage is not configured. Set AWS_REGION, AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.',
      });
    }

    if (!req.file) {
      console.error('[FoodRoute] No file received. req.body keys:', Object.keys(req.body || {}));
      return res.status(400).json({ error: 'foodimage file is required' });
    }

    const { foodname, foodtype, foodnonacprice, foodacprice, fooddescription, adminId, adminemail } = req.body;
    console.log('[FoodRoute] Body received:', {
      foodname,
      foodtype,
      foodnonacprice,
      foodacprice,
      fooddescriptionLength: (fooddescription || '').length,
      adminId,
      adminemail,
    });

    console.log('[FoodRoute] multer file received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer ? req.file.buffer.length : 0,
    });

    const imageUrl = await uploadToS3(req.file);
    console.log('[FoodRoute] S3 upload finished. URL:', imageUrl);

    const food = new Food({
      foodname,
      foodtype,
      foodnonacprice,
      foodacprice,
      fooddescription,
      foodimage: imageUrl,
      adminId,
      adminemail,
    });

    console.log('[FoodRoute] Saving food to MongoDB...');
    await food.save();
    console.log('[FoodRoute] Food saved. id:', food._id?.toString?.());

    res.status(201).json({ message: 'Food item added successfully', foodimage: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload food item' });
  }
});

router.get('/fooditems/:id', async (req, res) => {
  const foods = await Food.find({ adminId: req.params.id });
  res.json(foods);
});

router.get('/users/fooditems/:email', async (req, res) => {
  const email = req.params.email.toLowerCase();
  const foods = await Food.find({ adminemail: email });
  res.json(foods);
});

router.get('/:id', async (req, res) => {
  const foods = await Food.findById(req.params.id);
  res.json(foods);
});

router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'food not found' });

    if (s3Configured() && food.foodimage && food.foodimage.startsWith('http')) {
      try {
        await deleteFromS3(food.foodimage);
      } catch (e) {
        console.warn('S3 delete after food remove failed:', e.message);
      }
    }

    res.status(200).json({ message: 'fooditem deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

router.put('/edit/:id', upload.single('foodimage'), async (req, res) => {
  try {
    console.log('[FoodRoute] PUT /api/foods/edit/:id');
    if (!s3Configured()) {
      return res.status(503).json({
        error: 'File storage is not configured. Set AWS_REGION, AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.',
      });
    }

    const { foodname, foodtype, foodnonacprice, foodacprice, fooddescription } = req.body;

    const updateFields = {
      foodname,
      foodtype,
      foodnonacprice,
      foodacprice,
      fooddescription,
    };

    if (req.file) {
      const existing = await Food.findById(req.params.id);
      if (existing?.foodimage && existing.foodimage.startsWith('http')) {
        try {
          await deleteFromS3(existing.foodimage);
        } catch (e) {
          console.warn('S3 delete before food image replace failed:', e.message);
        }
      }
      updateFields.foodimage = await uploadToS3(req.file);
    }

    await Food.findByIdAndUpdate(req.params.id, updateFields);
    res.status(200).json({ message: 'Food updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
