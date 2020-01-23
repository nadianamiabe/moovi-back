const Session = require('../models/Session');
const MovieTeather = require('../models/MovieTheater');

const clean = (word) => {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};


const getMovieSessions = async (req, res) => {
  const { id, city } = req.params;
  console.log(city);

  try {
    const cinema = await MovieTeather.findById(id);
    const regex = cinema.name.replace(/Cinemark\s|Shopping\s/g, '')
    console.log(regex);
    const sessions = await Session.find({ city: city.toLowerCase(), cinema: { $regex: clean(regex), $options: 'i' } });
    console.log(sessions);
    if (sessions) {
      res.status(200).json(sessions);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMovieSessions,
};
