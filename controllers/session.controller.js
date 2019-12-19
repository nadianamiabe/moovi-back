const Session = require('../models/Session');
const MovieTeather = require('../models/MovieTheater');

const clean = (word) => {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const splitCamelCase = (word) => {
  return word.match(/(^[a-z]|[A-Z0-9])[a-z]*/g);
};

const getMovieSessions = async (req, res) => {
  const { id, city } = req.params;

  try {
    const cinema = await MovieTeather.findById(id);
    let words = cinema.name.replace(/Cinemark\s|Shopping\s/g, '').split(' ');
    if (words.length === 1) {
      const split = splitCamelCase(words[0]);
      if (split) {
        words = split;
      }
    }
    const regex = words.reduce((acc, value) => {
      return acc + '|' + value;
    });
    console.log(regex);
    const sessions = await Session.find({ city: city.toLowerCase(), cinema: { $regex: clean(regex), $options: 'i' } });
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
