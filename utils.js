const NotFoundError = require('./errors/NotFoundError');
const IncorrectDataError = require('./errors/IncorrectDataError');

const ERR_NOT_FOUND = 404;
const ERR_INCORRECT_DATA = 400;
const ERR_SERVER_ERROR = 500;
const ERR_CONFLICT_ERROR = 409;

const throwErrors = (err, res, message) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка статус ${ERR_INCORRECT_DATA}. ${message}.` });
  } else {
    res.status(ERR_SERVER_ERROR).send({ message: `Ошибка сервера.Статус ${ERR_SERVER_ERROR}.` });
  }
};

module.exports = {
  ERR_NOT_FOUND,
  ERR_INCORRECT_DATA,
  ERR_SERVER_ERROR,
  ERR_CONFLICT_ERROR,
  throwErrors,
};
