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
        email: Joi.string().email().label('Email').required()
          .messages({
            'string.base': 'Поле должно быть строкой с {#label}.',
            'string.email': 'Некорректный формат {#label}.',
            'any.required': 'Необходимо ввести {#label}.',
            'string.empty': 'Пустое поле, необходимо ввести {#label}.',
          }),
        password: Joi.string().label('Пароль').required()
          .messages({
            'string.base': 'Некорректный формат поля {#label}. Должна быть строка.',
            'any.required': 'Не введен {#label}, необходимо ввести {#label}.',
            'string.empty': 'Пустое поле, необходимо ввести {#label}.',
          }),
      }),
    }), login);
    app.post('/signup', celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30).label('Имя пользователя')
          .default('Жак-Ив Кусто')
          .messages({
            'string.base': '{#label} должно быть строкой 2-30 символов.',
            'string.min': '{#label} должно быть строкой 2-30 символов.',
            'string.max': '{#label} должно быть строкой 2-30 символов.',
            'string.empty': 'Пустое поле, необходимо ввести {#label}.',
          }),
        about: Joi.string().min(2).max(30).label('Описание пользователя')
          .default('Исследователь')
          .messages({
            'string.base': '{#label} должно быть строкой 2-30 символов.',
            'string.min': '{#label} должно быть строкой 2-30 символов.',
            'string.max': '{#label} должно быть строкой 2-30 символов.',
            'string.empty': 'Пустое поле, необходимо ввести {#label}.',
          }),
        avatar: Joi.string().label('Аватар').pattern(/(https|http):\/\/(www.)?[a-zA-Z0-9-_]+\.[a-zA-Z]+(\/[a-zA-Z0-9-._/~:@!$&'()*+,;=]*$)?/)
          .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
          .messages({
            'string.base': '{#label} должно быть строкой.',
            'string.empty': 'Пустое поле, необходимо ввести {#label}.',
            'string.pattern': '{#label} не соответствует формату ссылки.',
            'string.pattern.base': '{#label} не соответствует формату ссылки.',
          }),
        email: Joi.string().required().email().label('Email')
          .messages({
            'string.base': 'Поле должно быть строкой с {#label}.',
            'string.email': 'Некорректный формат {#label}.',
            'any.required': 'Необходимо ввести {#label}.',
            'string.empty': 'Пустое поле, необходимо ввести {#label}.',
          }),
        password: Joi.string().required().label('Пароль')
          .messages({
            'string.base': 'Некорректный формат поля {#label}. Должна быть строка.',
            'any.required': 'Не введен {#label}, необходимо ввести {#label}.',
            'string.empty': 'Пустое поле, необходимо ввести {#label}.',
          }),
      }),
    }), createUser);
    app.use(userRouter);
    app.use(cardRouter);
    app.use(auth, (req, res, next) => {
      next(new NotFoundError('Маршрут не найден'));
    });
    app.use((err, req, res, next) => {
      if (isCelebrateError(err)) {
        const errorBody = err.details.get('body') || err.details.get('params');
        const { details: [errorDetails] } = errorBody;
        res.status(ERR_BAD_REQUEST).send({ message: errorDetails.message });
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
