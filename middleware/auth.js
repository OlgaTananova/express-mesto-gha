const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/ForbiddenError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ForbiddenError('Необходима авторизация.');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    if (!payload) {
      return new ForbiddenError('Необходима авторизация');
    }
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};

module.exports = auth;
