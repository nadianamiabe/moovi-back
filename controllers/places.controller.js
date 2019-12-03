require("dotenv").config();

const MovieTheater = "../models/MovieTheater";
const axios = require("axios");

const getAllPlaces = async (req, res) => {
  let data = "";
  const movieTheater = [];
  const type = "movie_theater";
  const radius = 500;
  const lat = -23.5617714;
  const lng = -46.6601914;

  try {
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_API_KEY}`
      )
      .then(response => {
        data = response.data.results;
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllPlaces
};
