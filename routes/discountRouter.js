const router = require('express').Router()
const discountCtrl = require('../controllers/discountCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/discount')
    .get(discountCtrl.discounts)
    .post(auth, authAdmin, discountCtrl.createDiscount)
    
router.route('/discount/:id')
    .put(auth, authAdmin, discountCtrl.updateDiscount)
    .delete(auth, authAdmin, discountCtrl.deleteDiscount)

module.exports = router