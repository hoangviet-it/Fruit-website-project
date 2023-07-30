const router = require('express').Router()
const statusCtrl = require('../controllers/statusCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/status')
    .get(statusCtrl.status)
    .post(auth, authAdmin, statusCtrl.createStatus)
    
router.route('/status/:id')
    .put(auth, authAdmin, statusCtrl.updateStatus)
    .delete(auth, authAdmin, statusCtrl.deleteStatus)

module.exports = router