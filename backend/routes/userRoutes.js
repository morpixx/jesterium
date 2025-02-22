// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/:login', userController.getUser);
router.post('/users', userController.createUser);

module.exports = router;