const express=require('express')
const router=express.Router()
const usuarioController=require('../controllers/usuario.controller')
const loginController=require('../controllers/login.controller')
const autenticar=require('../middlewares/auth.middleware')

router.get('/',autenticar,usuarioController.getAllUsers)
router.delete('/:id',autenticar,usuarioController.deleteUser)
 router.get('/username/:username',autenticar,usuarioController.getOneUser)
router.put('/',autenticar,usuarioController.modifUser)

 module.exports=router