
const router = require('express').Router()
const useCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register', useCtrl.register)

router.post('/login', useCtrl.login)

router.get('/logout', useCtrl.logout)

router.get('/refresh_token', useCtrl.refreshToken)

router.get('/infor', auth, useCtrl.getUser)

router.patch('/addcart', auth, useCtrl.addCart)

router.patch('/updatepassword', auth, useCtrl.updatePassword)

router.get('/readuser', useCtrl.readUser)

router.patch('/dissableuser/:id', auth, authAdmin, useCtrl.updateDissable)

router.delete('/deleteuser/:id', auth, authAdmin, useCtrl.deleteUser)

module.exports = router