const router = require('express').Router()
const notifyCtrl = require('../controllers/notifyCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/notify')
    .get(notifyCtrl.getNotify)
    .post(notifyCtrl.createNotify)

router.route('/update_neworder/:id')
    .put(auth, notifyCtrl.updateNewOrder)

router.route('/update_newreview/:id')
    .put(auth, notifyCtrl.updateNewReview)

router.route('/update_slide/:id')
    .put(notifyCtrl.updateSlide)

router.route('/update_discount/:id')
    .put(notifyCtrl.updateDiscount)

router.route('/update_cancelorder/:id')
    .put(auth, notifyCtrl.updateCancelOrder)

module.exports = router