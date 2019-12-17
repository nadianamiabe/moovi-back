const express = require('express');

const router = express.Router();

const {
  getMovies,
  getDetail,
  getMovieTrailer,
} = require('../controllers/movies.controller');

router.get('/now-playing', getMovies);
router.get('/trailer', getMovieTrailer);
router.get('/:id', getDetail);

module.exports = router;
