const express = require('express');

const router = express.Router();
const {
  createCustomer,
  createSubscription,
} = require('../controllers/payments.controller.js');


router.get('/public-key', (req, res) => {
  res.status(200).json({ key: process.env.STRIPE_KEY });
});

router.post('/customer', createCustomer);

router.post('/subscription', createSubscription);

module.exports = router;
