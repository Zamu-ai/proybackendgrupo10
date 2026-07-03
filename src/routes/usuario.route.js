const express=require('express')
const router=express.Router()
const usuarioController=require('../controllers/usuario.controller')
const loginController=require('../controllers/login.controller')
const autenticar=require('../middlewares/auth.middleware')
const soloAdmin= require('../middlewares/role.middlewares')

//para cada uno de estos endpoints el admin va a ser el unico que pueda usarlos
router.get('/',autenticar,soloAdmin,usuarioController.getAllUsers)
router.delete('/:id',autenticar,soloAdmin,usuarioController.deleteUser)
 router.get('/username/:username',autenticar,soloAdmin,usuarioController.getOneUser)
router.put('/',autenticar,soloAdmin,usuarioController.modifUser)

 module.exports=router