const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUserAvatar,
  updateUserProfile,
  getCurrentUser,
} = require('../controllers/users');
const auth = require('../middleware/auth');

const router = Router();

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required()
      .label('id пользователя')
      .messages({
        'string.base': 'Некорретный формат {#label}. Должна быть строка из 24 символов.',
        'string.length': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'any.required': 'Не передан {#label}.',
        'string.hex': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'string.empty': 'Пустое поле, требуется передать {#label}.',
      }),
  }),
}), getUserById);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .label('Имя пользователя')
      .messages({
        'string.base': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'string.min': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'string.max': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'any.required': 'Требуется ввести {#label}.',
        'string.empty': 'Пустое поле, требуется {#label}.',
      }),
    about: Joi.string().required().min(2).max(30)
      .label('Описание пользователя')
      .messages({
        'string.base': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'string.min': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'string.max': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'any.required': 'Требуется ввести {#label}.',
        'string.empty': 'Пустое поле, требуется ввести {#label}.',
      }),
  }),
}), updateUserProfile);
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(https|http):\/\/(www.)?[a-zA-Z0-9-_]+\.[a-zA-Z]+(\/[a-zA-Z0-9-._/~:@!$&'()*+,;=]*$)?/)
      .label('Аватар')
      .messages({
        'string.pattern.base': 'Ссылка на {#label} не соответствует формату',
        'string.pattern': 'Ссылка на {#label} не соответствует формату',
        'string.empty': 'Ссылка на {#label} не может быть пустой.',
        'any.required': 'Нужно указать {#label}.',
      }),
  }),
}), updateUserAvatar);

module.exports = router;
