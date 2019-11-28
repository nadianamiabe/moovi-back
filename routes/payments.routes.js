require("dotenv").config();

const express = require('express');

const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../models/User');

router.post('/new/customer', async (req, res) => {
  const { user } = req;
  const { email, payment_method } = req.body;
  try {
    const customer = await stripe.customers.create({
      payment_method,
      email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });
    const { id } = customer;
    await User.findByIdAndUpdate(user._id, {
      paymentMethodId: payment_method,
      customerId: id,
    });
    res.status(200).json({ message: 'Customer has been created' });
  } catch (err) {
    res.status(400).json({message: 'Customer was not created', error: err.message });
  }
});

router.post('/new/subscription', async(req, res) => {
  const { user } = req;
  if (!user.isSubscribed) {
    try {
      
    } catch (error) {
      
    }
  }
})

module.exports = router;