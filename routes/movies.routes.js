const express = require('express');

const router = express.Router();

const {
  getMoviesFromSessions,
  getDetail,
  getMovieTrailer,
} = require('../controllers/movies.controller');

router.get('/now-playing', getMoviesFromSessions);
router.get('/trailer', getMovieTrailer);
router.get('/:id', getDetail);

module.exports = router;
