const {
  placeInfo,
  listOfMovieTheaters,
  getShoppingFromAddress,
} = require('../helpers/googleMaps.helper');
const MovieTheater = require('../models/MovieTheater');

const getAllPlaces = async (req, res) => {
  const { lat, lng } = req.params;
  try {
    const allMovieTheaters = await listOfMovieTheaters(lat, lng);

    const movieTheatersDataFiltered = allMovieTheaters
      .map((place) => ({
        name: place.name,
        address: place.vicinity,
        place_id: place.place_id,
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
        const names = newTheater.name.split(' ');
        if (names.length < 2) {
          const shopping = await getShoppingFromAddress(newTheater.address);
          names.push(shopping);
          newTheater.name = names.join(' ');
        }
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
    name.includes('cinemark')
  ) {
    return true;
  }
  return false;
}

const getOnePlace = async (req, res) => {
  const onPlaceInfo = await MovieTheater.findById(req.params.id);
  res.status(200).json(onPlaceInfo);
};



module.exports = { 
  getAllPlaces,
  getOnePlace,
};