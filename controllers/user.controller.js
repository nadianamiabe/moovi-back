const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Preencha todos os campos' });
    return;
  }
  try {
    const user = await User.findOne({ username });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: 'Credenciais incorretas' });
      return;
    }

    const token = await jwt.sign({
      username: user.username,
      id: user._id,
      email: user.email,
      isSubscribed: user.isSubscribed,
      customerId: user.customerId,
      subscriptionId: user.subscriptionId,
    }, process.env.token, { algorithm: 'HS256', expiresIn: '500h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Algo deu errado' });
  }
};

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ message: 'Preencha todos os campos.' });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: 'Algo deu errado' });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'Escolha outro username' });
    }
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  const aNewUser = new User({
    username,
    password: hashPass,
    email,
  });

  aNewUser.save((err) => {
    if (err) {
      res.status(400).json({ message: 'Algo deu errado' });
      return;
    }
    res.status(200).json({ message: 'Usuário cadastrado' });
  });
};

module.exports = {
  loginUser,
  signupUser,
};
