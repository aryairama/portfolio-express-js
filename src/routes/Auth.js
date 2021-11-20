const express = require('express');
const AuthController = require('../controllers/AuthController');
const { Auth } = require('../middlewares/Auth');

const router = express.Router();

router.post('/login', AuthController.login).delete('/logout', Auth, AuthController.logout);

module.exports = router;
