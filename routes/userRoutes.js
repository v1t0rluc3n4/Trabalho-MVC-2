const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.get('/profile', UserController.showProfile);
router.post('/profile', UserController.updateProfile);

module.exports = router;