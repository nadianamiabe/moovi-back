const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../models/User');

const createCustomer = async (req, res) => {
  const { user } = req;
  const { name, email, payment_method } = req.body;
  try {
    const customer = await stripe.customers.create({
      payment_method,
      email,
      name,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });
    console.log(customer);
    const { id } = customer;
    await User.findByIdAndUpdate(user.id, {
      paymentMethodId: payment_method,
      customerId: id,
    });
    res.status(200).json({ message: 'Customer has been created', customerId: id });
  } catch (err) {
    res.status(400).json({ message: 'Customer was not created', error: err.message });
  }
};

const createSubscription = async (req, res) => {
  const { id } = req.user;
  const { planId } = req.body;

  try {
    const loggedUser = await User.findById(id);
    const subscription = await stripe.subscriptions.create({
      customer: loggedUser.customerId,
      items: [{ plan: planId }],
      expand: ['latest_invoice.payment_intent'],
    });
    console.log(subscription);
    await User.findByIdAndUpdate(id, { isSubscribed: true, subscriptionId: subscription.id });

    res.status(200).json({ message: 'Subscription has been created', subscriptionId: subscription.id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Subscription was not created', error: err.message });
  }
};

const getUserStatus = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    console.log(user);
    res.status(200).json({ status: user.isSubscribed });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getStripeData = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user.isSubscribed) {
      const { customerId, subscriptionId } = user;
      const customer = await stripe.custome.retrieve(customerId);
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      res.status(200).json({ customer, subscription });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Unable to find user data', error: error.message });
  }
};

module.exports = {
  createCustomer,
  createSubscription,
  getStripeData,
  getUserStatus,
};