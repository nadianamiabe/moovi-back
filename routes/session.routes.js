const express = require('express');

const router = express.Router();

const { getMovieSessions } = require('../controllers/session.controller.js');

router.get('/:id/:city', getMovieSessions);

module.exports = router;

