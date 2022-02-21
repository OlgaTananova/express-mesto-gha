const ERR_NOT_FOUND = 404;
const ERR_INCORRECT_DATA = 400;
const ERR_SERVER_ERROR = 500;

const throwErrors = (err, res, message) => {
  if (err.name === 'ValidationError') {
    res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. Переданы некорректные данные.` });
  } else if (err.name === 'CastError') {
    res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. ${message}.` });
  } else {
    res.status(ERR_SERVER_ERROR)
      .send({ message: `Ошибка ${ERR_SERVER_ERROR}. Ошибка сервера.` });
  }
};

module.exports = {
  ERR_NOT_FOUND,
  ERR_INCORRECT_DATA,
  ERR_SERVER_ERROR,
  throwErrors,
};
