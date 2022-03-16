const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {
  celebrate, Joi, isCelebrateError,
} = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const {
  ERR_CONFLICT_ERROR,
  ERR_INCORRECT_DATA,
  ERR_SERVER_ERROR,
} = require('./utils');

const app = express();
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const login = require('./controllers/login');
const { createUser } = require('./controllers/users');

async function start() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    // Приложение не запускается, если оставить эти опции активными
    // useCreateIndex: true,
    // useFindAndModify: false,
  });
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
}

start()
  .then(() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.get('/', (req, res) => {
      throw new NotFoundError('Страница не найдена.');
    });
    app.post('/signin', login);
    app.post('/signup', celebrate({
      body: Joi.object().keys({
        name: Joi.string()
          .min(2)
          .max(30),
        about: Joi.string()
          .min(2)
          .max(30),
        avatar: Joi.string(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    }), createUser);
    app.use(userRouter);
    app.use(cardRouter);
    app.use((err, req, res, next) => {
      if (isCelebrateError(err)) {
        return res.status(ERR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные.' });
      }
      next(err);
    });
    app.use((err, req, res, next) => {
      let { statusCode, message } = err;
      if (statusCode && message) {
        return res.status(statusCode).send({ message });
      } if (err.code === 11000) {
        statusCode = ERR_CONFLICT_ERROR;
        message = 'Такой пользователь уже существует!';
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        statusCode = ERR_INCORRECT_DATA;
        message = 'Переданы некорректные данные';
      } else {
        statusCode = ERR_SERVER_ERROR;
        message = 'На сервере произошла ошибка';
      }
      res.status(statusCode).send({ message });
    });
  })
  .catch(() => {
    console.log('Ошибка. Что-то пошло не так.');
    process.exit();
  });
