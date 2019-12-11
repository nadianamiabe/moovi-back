const {
  placeInfo,
  listOfMovieTheaters,
} = require('../helpers/googleMaps.helper');
const MovieTheater = require('../models/MovieTheater');

const getAllPlaces = async (req, res) => {
  try {
    // await getGeoLocation();
    // await placeInfo();
    const allMovieTheaters = await listOfMovieTheaters();

    const movieTheatersDataFiltered = allMovieTheaters
      .map((place, idx) => ({
        name: place.name,
        address: place.formatted_address,
        place_id: place.place_id
      }))
      .filter(filterByName);

    // Filtrar o nome dos cinemas e tirar os que não são cinemas de verdade e então colocar no banco
    // const  = await movieTheatersData

    movieTheatersDataFiltered.forEach(async (theater) => {
      const newTheater = { ...theater };
      const oneMovieTheater = await MovieTheater.findOne({
        place_id: theater.place_id,
      });

      const { result } = await placeInfo(theater.place_id);
      newTheater.phone_number = result.international_phone_number;
      newTheater.website = result.website;
      newTheater.location = result.geometry.location;

      if (!oneMovieTheater) {
        const newMovieTheater = new MovieTheater(newTheater);
        await newMovieTheater.save();
      }
    });

    const MovieTheaterDB = await MovieTheater.find();
    res.json(MovieTheaterDB);
  } catch (err) {
    console.log(err);
  }
};

function filterByName(movieTheaterData) {
  const name = movieTheaterData.name.toLowerCase();
  if (
    name.includes('cinemark') ||
    name.includes('playarte') ||
    name.includes('itau')
  ) {
    return true;
  }
  return false;
}

const getOnePlace = async (req, res) => {
  const onPlaceInfo = await MovieTheater.findById(req.params.id);
  res.status(200).json(onPlaceInfo);
}

module.exports = { 
  getAllPlaces,
  getOnePlace,
};