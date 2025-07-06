const mongoose = require('mongoose');

const TableSettingsSchema = new mongoose.Schema({
  acTables: { type: Number, required: true },
  nonAcTables: { type: Number, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  adminemail: {
  type: String,
  required: true,
  lowercase: true 
}
});

module.exports = mongoose.model('TableSettings', TableSettingsSchema);
