const Card = require('../models/card');
const { ERR_INCORRECT_DATA, ERR_SERVER_ERROR, ERR_NOT_FOUND } = require('../utils');

const throwErrors = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. Переданы некорректные данные.` });
  } else if (err.name === 'CastError') {
    res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. Карточка с указанным id не найдена.` });
  } else {
    res.status(ERR_SERVER_ERROR)
      .send({ message: `Ошибка ${ERR_SERVER_ERROR}. Ошибка сервера.` });
  }
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERR_NOT_FOUND).send({ message: `Ошибка статус ${ERR_NOT_FOUND}. Карточка с указанным id не найдена.` });
      }
      res.send({ message: 'Пост удален.' });
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERR_NOT_FOUND).send({ message: `Ошибка, статус ${ERR_NOT_FOUND}. Карточка с указанным id не найдена.` });
      }
      res.send(card);
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(ERR_NOT_FOUND).send({ message: `Ошибка, статус ${ERR_NOT_FOUND}. Карточка с указанным id не найдена.` });
      }
      res.send(card);
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
