const Session = require('../models/Session');
const MovieTeather = require('../models/MovieTheater');

const clean = (word) => {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};


const getMovieSessions = async (req, res) => {
  const { id, city } = req.params
  

  try {
    const cinema = await MovieTeather.findById(id);
    const words = cinema.name.split(' ').filter((word) => (word !== 'Cinemark' && word !== 'Shopping'));
    const sessions = await Session.find({ city, cinema: { $regex: clean(words.join(' ')), $options: 'i' } });
    if (sessions) {
      res.status(200).json(sessions);
    }
    res.status(400).json({ message: 'Cannot find sessions' });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = {
  getMovieSessions,
};
