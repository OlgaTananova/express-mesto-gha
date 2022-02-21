const Card = require('../models/card');
const { ERR_NOT_FOUND, throwErrors } = require('../utils');

const message = 'Карточка с указанным id не найдена';

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      throwErrors(err, res, message);
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
      throwErrors(err, res, message);
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERR_NOT_FOUND).send({ message: `Ошибка статус ${ERR_NOT_FOUND}. ${message}.` });
      }
      res.send({ message: 'Пост удален.' });
    })
    .catch((err) => {
      throwErrors(err, res, message);
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
        return res.status(ERR_NOT_FOUND).send({ message: `Ошибка, статус ${ERR_NOT_FOUND}. ${message}.` });
      }
      res.send(card);
    })
    .catch((err) => {
      throwErrors(err, res, message);
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(ERR_NOT_FOUND).send({ message: `Ошибка, статус ${ERR_NOT_FOUND}. ${message}.` });
      }
      res.send(card);
    })
    .catch((err) => {
      throwErrors(err, res, message);
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
