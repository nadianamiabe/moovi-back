require('dotenv').config();

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise,
});

// Geocode an address.

let placeID = '';

const getGeoLocation = async () => {
  try {
    const response = await googleMapsClient.geocode({ address: 'Alameda Jaú, 1301 - Jardim Paulista, São Paulo - SP, 01420-001' })
      .asPromise();
    // console.log('this is response place ID:', response.json.results[0].place_id);
    placeID = response.json.results[0].place_id;
  } catch (error) {
    console.log(error);
  }
};

const placeInfo = async (id) => {
  try {
    const response = await googleMapsClient.place({ placeid: id })
      .asPromise();
    return response.json;
  } catch (error) {
    console.log(error);
  }
};

const listOfMovieTheaters = async () => {
  try {
    const response = await googleMapsClient
      .places({
        type: 'movie_theater',
        location: {
          lat: '-23.56165000482843',
          lng: '-46.66010253294923',
        },
      })
      .asPromise();
    return response.json.results;
    // console.log('this is response of LIST OF MOVIES222:', movieTheaters);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getGeoLocation,
  placeInfo,
  listOfMovieTheaters,
};
