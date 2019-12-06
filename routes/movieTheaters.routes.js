const express = require('express');

const router = express.Router();

const showAlMovieTheaters = require('../controllers/movieTheaters.controller');

router.get('/', showAlMovieTheaters);

module.exports = router;
