const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');

const router = Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCards);
router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .label('Название карточки')
      .messages({
        'string.base': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'string.min': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'string.max': 'Некорректное {#label}, должна быть строка длиной 2-30 символа.',
        'any.required': 'Требуется ввести {#label}.',
        'string.empty': 'Пустое поле, требуется ввести {#label}.',
      }),
    link: Joi.string().required()
      .pattern(/(https|http):\/\/(www.)?[a-zA-Z0-9-_]+\.[a-zA-Z]+(\/[a-zA-Z0-9-._/~:@!$&'()*+,;=]*$)?/)
      .label('Ссылка на картинку')
      .messages({
        'string.pattern.base': '{#label} не соответствует формату',
        'string.pattern': '{#label} не соответствует формату',
        'string.empty': '{#label} не может быть пустой.',
        'any.required': 'Нужно указать {#label}.',
      }),
  }),
}), createCard);
router.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .label('id карточки')
      .messages({
        'string.base': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'string.length': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'any.required': 'Не передан {#label}.',
        'string.hex': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'string.empty': 'Пустое поле, требуется передать {#label}.',
      }),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .label('id карточки')
      .messages({
        'string.base': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'string.length': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'any.required': 'Не передан {#label}.',
        'string.hex': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
        'string.empty': 'Пустое поле, требуется передать {#label}.',
      }),
  }),
}), likeCard);
router.delete(
  '/cards/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required()
        .label('id карточки')
        .messages({
          'string.base': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
          'string.length': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
          'any.required': 'Не передан {#label}.',
          'string.hex': 'Некорректный формат {#label}. Должна быть строка из 24 символов.',
          'string.empty': 'Пустое поле, требуется передать {#label}.',
        }),
    }),
  }),
  dislikeCard,
);

module.exports = router;
