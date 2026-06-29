const express=require('express')
const router=express.Router()
const usuarioController=require('../controllers/usuario.controllers')

router.get('/',usuarioController.getAllUsers)
router.delete('/:id',usuarioController.deleteUser)
router.delete('/username/:username',usuarioController.deleteSearch)
router.get('/username/:username',usuarioController.getOneUser)
router.put('/',usuarioController.modifUser)
module.exports=router