const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 6.048e+8,
      });
      res.send({ message: 'Токен отправлен в куки.' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = login;
