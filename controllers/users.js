const User = require('../models/user');
const { ERR_NOT_FOUND, ERR_SERVER_ERROR, ERR_INCORRECT_DATA } = require('../utils');

const throwErrors = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. Переданы некорректные данные.` });
  } else if (err.name === 'CastError') {
    res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. Пользователь с указанным id не найдет.` });
  } else {
    res.status(ERR_SERVER_ERROR)
      .send({ message: `Ошибка ${ERR_SERVER_ERROR}. Ошибка сервера.` });
  }
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(ERR_SERVER_ERROR)
        .send({ message: `Ошибка ${ERR_SERVER_ERROR}. Ошибка сервера.` });
    });
};
const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(ERR_NOT_FOUND)
          .send({ message: `Ошибка ${ERR_NOT_FOUND}. Пользователь по указанному _id не найден.` });
      }
      res.send(user);
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};
const updateUserProfile = (req, res) => {
  const {
    name,
    about,
  } = req.body;
  const id = req.user._id;
  if (!name || !about) {
    return res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. Переданы некорректные данные.` });
  }
  User.findOneAndUpdate(id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      throwErrors(err, res);
    });
};
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  if (!avatar) {
    return res.status(ERR_INCORRECT_DATA).send({ message: `Ошибка, статус ${ERR_INCORRECT_DATA}. Переданы некорректные данные.` });
  }
  User.findOneAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      throwErrors(err, res);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
