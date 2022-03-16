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
router.get('/users/:id', auth, getUserById);
router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = router;
