const express = require('express');

const router = express.Router();

const {
  getAllPlaces,
  getOnePlace,
} = require('../controllers/movieTheaters.controller');

router.get('/all-places/lat/:lat/lng/:lng', getAllPlaces);

router.get('/one-place/:id', getOnePlace);

module.exports = router;
