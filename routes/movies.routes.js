const express = require('express');

const router = express.Router();

const {
  getMoviesFromSessions,
  getDetail,
} = require('../controllers/movies.controller');

router.get('/now-playing', getMoviesFromSessions);
router.get('/:id', getDetail);

module.exports = router;
