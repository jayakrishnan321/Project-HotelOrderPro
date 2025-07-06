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
      overallStatus: 'Uncompleted' 
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
        overallStatus: 'Uncompleted'
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


// 🔍 Get Uncompleted Order by Table Number + Type + Admin
// GET /api/orders/uncompleted/:number/:type/:adminemail
router.get('/uncompleted/:number/:type/:adminemail', async (req, res) => {
  const { number, type, adminemail } = req.params;

  try {
    const order = await Orders.findOne({
      tableNumber: Number(number),
      tableType: type,
      adminemail,
      overallStatus: 'Uncompleted'
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


module.exports = router;
