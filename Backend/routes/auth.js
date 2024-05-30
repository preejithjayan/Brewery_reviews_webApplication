const router = require('express').Router();
const authController = require('../controllers/auth')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/profile', authController.middleware, authController.profile)

module.exports = router;