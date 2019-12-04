const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = require('./user.routes');
const index = require('./index.routes');

const router = express.Router();

const verifyLoggedAreaToken = () => (req, res, next) => {
  const authHeader = req.header('Authorization');

  const token = authHeader.split(' ')[1];

  try {
    const tokenInfo = jwt.verify(token, process.env.token);
    const { username, id, isSubscribed, customerId, subscriptionId } = tokenInfo;
    req.user = {
      username,
      id,
      isSubscribed,
      customerId,
      subscriptionId,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token expirado', status: 401 });
  }
};

router.use('/users', userRoutes);

router.use(verifyLoggedAreaToken());

const payments = require('../routes/payments.routes');

router.use('/payments', payments);

router.use('/', index);

module.exports = router;
