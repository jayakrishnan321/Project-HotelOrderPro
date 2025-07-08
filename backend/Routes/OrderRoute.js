const express = require('express');
const router = express.Router();
const Orders = require('../models/Order');

// 🟢 Add or Update Uncompleted Order
router.post('/add', async (req, res) => {
  try {
    const { tableNumber, tableType, adminemail, items } = req.body;

    if (!tableNumber || !tableType || !adminemail || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.foodprice * item.foodquantity, 0);

    const existingOrder = await Orders.findOne({
      tableNumber,
      tableType,
      adminemail,
      overallStatus: 'Uncompleted',
      paymentStatus: "Pending"
    });

    if (existingOrder) {
      existingOrder.items = items;
      existingOrder.totalPrice = totalPrice;
      await existingOrder.save();
      return res.status(200).json({ message: 'Order updated successfully' });
    } else {
      const newOrder = new Orders({
        tableNumber,
        tableType,
        adminemail,
        items,
        totalPrice,
        overallStatus: 'Uncompleted',
        paymentStatus: "Pending"
      });

      await newOrder.save();
      return res.status(201).json({ message: 'Order created successfully' });
    }
  } catch (err) {
    console.error('Error saving order:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 🟡 Toggle Status of Individual Item (Pending <-> Delivered)
router.patch('/itemstatus/:orderId/:index', async (req, res) => {
  try {
    const { orderId, index } = req.params;
    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const item = order.items[index];
    item.status = item.status === 'Pending' ? 'Delivered' : 'Pending';

    await order.save();
    res.status(200).json({ message: 'Item status updated', order });
  } catch (err) {
    console.error('Error toggling item status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔁 Toggle Overall Order Status (Completed <-> Uncompleted)
router.put('/complete', async (req, res) => {
  const { tableNumber, tableType, adminemail } = req.body;

  try {
    const result = await Orders.updateMany(
      {
        tableNumber,
        tableType,
        adminemail,
        overallStatus: { $ne: 'Completed' } // only uncompleted
      },
      {
        $set: { overallStatus: 'Completed' }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No uncompleted orders found' });
    }

    res.status(200).json({ message: 'Orders marked as completed', updatedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/allorders/:adminemail', async (req, res) => {
  const order = await Orders.find({ adminemail: req.params.adminemail })
  res.json(order)
})
router.get('/vieworders/:adminemail', async (req, res) => {
  const orders = await Orders.find({
    adminemail: req.params.adminemail,
    'items.status': 'Pending',
  });

  res.json(orders)
})

// 🔍 Get Uncompleted Order by Table Number + Type + Admin
// GET /api/orders/uncompleted/:number/:type/:adminemail
router.get('/uncompleted/:number/:type/:adminemail', async (req, res) => {
  const { number, type, adminemail } = req.params;

  try {
    const order = await Orders.findOne({
      tableNumber: Number(number),
      tableType: type,
      adminemail,
      overallStatus: 'Uncompleted',
      paymentStatus: "Pending"
    });

    if (!order) {
      return res.status(404).json({ message: 'No uncompleted order found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching uncompleted order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/update/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body;

  try {
    const totalPrice = items.reduce((sum, item) => sum + item.foodprice * item.foodquantity, 0);

    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.items = items;
    order.totalPrice = totalPrice;

    await order.save();

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});
// GET /api/orders/table-status/:adminemail/:type/:number
router.get('/table-status/:adminemail/:type/:number', async (req, res) => {
  const { adminemail, type, number } = req.params;
 
  try {
    const order = await Orders.findOne({
      adminemail: adminemail,
      tableType: type,
      tableNumber: parseInt(number),
      paymentStatus: "Pending"
    });

    res.json(order);
  } catch (err) {
    console.error("Error fetching table order:", err);
    res.status(500).send("Server error");
  }
});
// PUT /api/orders/update-payment-status/:orderId
router.put('/update-payment-status/:orderId', async (req, res) => {
  const { paymentStatus } = req.body;

  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      req.params.orderId,
      { paymentStatus },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).send("Failed to update payment status");
  }
});
// routes/order.js or similar
router.put('/update-status/:orderId/:itemId', async (req, res) => {
  const { orderId, itemId } = req.params;

  try {
    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = "Delivered";
    await order.save();

    res.json({ message: "Item status updated to Delivered", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});





module.exports = router;
