const { Router } = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

const router = Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
