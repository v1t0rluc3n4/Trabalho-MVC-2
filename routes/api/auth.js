const express = require('express');
const router = express.Router();
const authController = require('../../controllers/AuthController');
const validate = require('../../middlewares/validation'); // Verifique esta linha
const { registerSchema, loginSchema } = require('../../utils/validationSchemas');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;