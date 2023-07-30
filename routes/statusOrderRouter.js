const router = require('express').Router()
const statusOrderCtrl = require('../controllers/statusOrderCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/statusorder')
    .get(statusOrderCtrl.statusOrder)
    .post(auth, authAdmin, statusOrderCtrl.createStatusOrder)

router.route('/statusorder/:id')
    .put(auth, authAdmin, statusOrderCtrl.updateStatusOrder)
    .delete(auth, authAdmin, statusOrderCtrl.deleteStatusOrder)

module.exports = router