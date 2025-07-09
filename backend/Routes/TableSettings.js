const express = require('express');
const router = express.Router();
const TableSettings = require('../models/Tables');

// POST or UPDATE table settings
router.post('/', async (req, res) => {
  const { acTables, nonAcTables, adminId, adminemail } = req.body;

  try {
    const existing = await TableSettings.findOne({ adminId });
    if (existing) {
      existing.acTables = acTables;
      existing.nonAcTables = nonAcTables;
      await existing.save();
      return res.json({ message: 'Updated successfully' });
    }

    const newSetting = new TableSettings({ acTables, nonAcTables, adminId, adminemail });
    await newSetting.save();
    res.status(201).json({ message: 'Created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// GET settings for admin
router.get('/:adminId', async (req, res) => {
  try {
    const settings = await TableSettings.findOne({ adminId: req.params.adminId });
    res.status(200).json(settings || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});
router.get('/users/:adminemail', async (req, res) => {
  try {
    const settings = await TableSettings.findOne({ adminemail: req.params.adminemail });
    res.status(200).json(settings || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});
module.exports = router;
