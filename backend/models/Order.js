const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  tableNumber: Number,
  items: [
    {
      foodId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  adminEmail: String,
  userId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);
