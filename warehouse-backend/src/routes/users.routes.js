const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, usersController.listUsers);
router.get('/:id', auth, usersController.getUser);
router.post('/', auth, usersController.createUser); // optionally allow ADMIN only in middleware
router.put('/:id', auth, usersController.updateUser);
router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;
