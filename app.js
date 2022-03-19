const express = require('express');
const mongoose = require('mongoose');
const {
  celebrate, Joi, isCelebrateError,
} = require('celebrate');
const cookieParser = require('cookie-parser');
const {
  ERR_BAD_REQUEST,
  ERR_SERVER_ERROR,
} = require('./utils');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const login = require('./controllers/login');
const { createUser } = require('./controllers/users');
const auth = require('./middleware/auth');

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
    app.post('/signin', celebrate({
      body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    }), login);
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
    app.use(auth, (req, res, next) => {
      next(new NotFoundError('Маршрут не найден'));
    });
    app.use((err, req, res, next) => {
      if (isCelebrateError(err)) {
        res.status(ERR_BAD_REQUEST).send({ message: 'Введены некорректные данные.' });
      } else {
        next(err);
      }
    });
    app.use((err, req, res, next) => {
      const statusCode = err.statusCode || ERR_SERVER_ERROR;
      const message = statusCode === ERR_SERVER_ERROR ? 'На сервере произошла ошибка.' : err.message;
      res.status(statusCode).send({ message });
      next();
    });
  })
  .catch(() => {
    console.log('Ошибка. Что-то пошло не так.');
    process.exit();
  });
