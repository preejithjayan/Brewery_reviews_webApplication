const router = require('express').Router();
const authController = require('../controllers/auth')
const reviewController = require('../controllers/review')

router.post('/', authController.middleware, reviewController.add)
router.get('/by-brew/:id', authController.middleware, reviewController.byBrew)
router.get('/', authController.middleware, reviewController.list)


module.exports = router;