
const router = require('express').Router()
const orderCtrl = require('../controllers/orderCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/order')
    .get(orderCtrl.getOrder)
    .post(auth, orderCtrl.createOrder)
    .patch(auth, orderCtrl.addDataProductOrder)

router.route('/order/:id')
    .delete(auth, authAdmin, orderCtrl.deleteProduct)
    .patch(auth, orderCtrl.updateOrder)

router.route('/myorder')
    .get(auth, orderCtrl.getMyOrder)


module.exports = router