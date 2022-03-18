const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');

const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены.');
      }
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};
const getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден.');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Невозможно отобразить информацию о пользователе, возможно, нужна авторизация.');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};
const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateUserProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  const id = req.user._id;
  if (!name || !about) {
    throw new IncorrectDataError('Переданы некорректные данные для обновления данных пользователя.');
  }
  User.findByIdAndUpdate(id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  if (!avatar) {
    throw new IncorrectDataError('Переданы некорректные данные для обновления аватара.');
  }
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
};
