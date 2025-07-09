const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  foodname: { type: String, required: true },
  foodprice: { type: Number, required: true },
  foodquantity: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, 
});

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  tableType: { type: String, required: true },
  adminemail: { type: String, required: true },
  items: [itemSchema],
  totalPrice: { type: Number, required: true },
  overallStatus: { type: String, default: 'Uncompleted' }, 
   paymentStatus: {
    type: String,
    enum: ["Pending", "Cash", "Online","Mixed"],
    default: "Pending"
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
