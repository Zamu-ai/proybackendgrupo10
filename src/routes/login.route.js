const funcionLogin=require('../controllers/login.controller')
const auditoriaMiddleware=require('../middlewares/audit.middleware')
const express=require('express')
const router=express.Router()

router.post('/',auditoriaMiddleware('CREAR_USUARIO'),funcionLogin.createUsuario)
router.post('/loginUser',auditoriaMiddleware('LOGUEAR_USUARIO'),funcionLogin.loginUsuario)

module.exports=router
