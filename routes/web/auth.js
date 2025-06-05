const express = require('express');
const router = express.Router();
const authController = require('../../controllers/AuthController');
const auth = require('../../middlewares/auth');

router.get('/register', authController.getRegisterPage);
router.get('/login', authController.getLoginPage);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;