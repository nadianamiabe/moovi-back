const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = require('./user.routes');
const movieTheatersRoutes = require('./movieTheaters.routes');
const movies = require('./movies.routes');

const router = express.Router();

const verifyLoggedAreaToken = () => (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    res.status(401).json({ message: 'Token não enviado' });
    return;
  }
  const token = authHeader.split(' ')[1];

  try {
    const tokenInfo = jwt.verify(token, process.env.token);
    const {
      username,
      id,
      isSubscribed,
      customerId,
      subscriptionId,
    } = tokenInfo;
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
    console.log(error);
  }
};

router.use('/users', userRoutes);

router.use(verifyLoggedAreaToken());

const payments = require('../routes/payments.routes');
const sessions = require('../routes/session.routes');

router.use('/movie-theater', movieTheatersRoutes);
router.use('/payments', payments);
router.use('/movies', movies);
router.use('/sessions', sessions);

module.exports = router;
