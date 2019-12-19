require('dotenv').config();

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise,
});

// Geocode an address.

// let placeID = '';

const getGeoLocation = async (lat, lng) => {
  try {
    const response = await googleMapsClient.reverseGeocode({ latlng: [lat, lng] })
      .asPromise();
    const city = response.json.results[0].address_components.filter((component) => {
      console.log(component);
      return (component.types[0] === 'administrative_area_level_2');
    });
    console.log('this is response place ID:', city[0].long_name);
    // placeID = response.json.results[0].place_id;
    return city[0].long_name;
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

const getShoppingFromAddress = async (address) => {
  try {
    const response = await googleMapsClient
      .findPlace({
        input: `shopping ${address}`,
        inputtype: ['textquery'],
        fields: ['name'],
      })
      .asPromise();
    console.log(response.json.candidates);
    return response.json.candidates[0].name;
  } catch (error) {
    console.log(error);
  }
};


const listOfMovieTheaters = async (lat, lng) => {
  try {
    const response = await googleMapsClient
      .placesNearby({
        keyword: 'Cinemark',
        type: 'movie_theater',
        location: {
          lat,
          lng,
        },
        radius: 5000,
      })
      .asPromise();
    // console.log('this is response of LIST OF MOVIES222:', response.json.results);
    return response.json.results;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getGeoLocation,
  placeInfo,
  listOfMovieTheaters,
  getShoppingFromAddress,
};
