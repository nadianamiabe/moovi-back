const express = require('express');

const router = express.Router();

const {
  getNowPlaying,
  getMovieByName,
  getDetail,
} = require('../controllers/movies.controller');

router.get('/now-playing', getNowPlaying);
router.get('/t', getMovieByName);
router.get('/:id', getDetail);

module.exports = router;
