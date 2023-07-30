const router = require('express').Router()
const reviewCtrl = require('../controllers/reviewCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/review')
    .get(reviewCtrl.reviews)
    .post(auth, reviewCtrl.createReview)
    
router.route('/review/:id')
    .delete(auth, reviewCtrl.deleteReview)

module.exports = router