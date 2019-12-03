const express = require("express");
const router = express.Router();

const {
  getAllPlaces,
  getOnePlace
} = require("../controllers/places.controller");

router.get("/all-places", getAllPlaces);
router.get("/one-place", getOnePlace);

module.exports = router;
