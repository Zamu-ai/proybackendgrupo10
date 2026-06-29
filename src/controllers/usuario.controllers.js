const UsuarioModel=require('../modells/usuario.models')
const Login=require('../modells/login.models')
 const funcionesUsuario={}

funcionesUsuario.getAllUsers= async(req,res)=>{
    try{
        const allUser= await Login.findAll({
            attributes:{exclude:['password']}
        })
        if(allUser.length === 0){
            return res.status(404).json({
                status:'0',
                msg:'no hay ningun usuario logueado'
            })
        }
        res.json(allUser)
    }
    catch(error){

    }
}

funcionesUsuario.deleteUser=async(req,res)=>{ //este va a ser para que al lado de cada usuario haya un boton para eliminar por eso no verifico que exista
    try{
        const findUser= await Login.findOne({
            where:{username:req.params.id}
            })
        findUser.destroy()//elimino en base al objeto encontrado
        }
    
    catch(error){
        res.status(505).json({
            status:'0',
            msg:'no se pudo eliminar ocurrió un error',error
        })
    }
}

//si ya estoy buscando al usuario y me van a salir sus boton no sirve de nada que busque solo para eliminar
// funcionesUsuario.deleteSearch =async (req,res)=>{ //este va a ser para eliminar en base a una busqueda controlo que exista
//     try{const username=req.params.username
//         if(!username){
//             return res.status(404).json({
//                 status:'0',
//                 msg:'no se ingresó username como parametro'
//             })
//         }
//         const findUserByUsername= await Login.findOne(username)
//         if(!findUserByUsername){
//             return res.status(404).json({
//                 status:'0',
//                 msg:'no se encontró el usuario a eliminar'
//             })
//                 }
//         }

//     catch(error){
//         res.status(505).json({
//             status:'0',
//             msg:'!ups hubo un error pa eliminar'
//         })
//     }
// }

funcionesUsuario.getOneUser=async (req,res) =>{ //va a haber un buscador para encontrar un usuario y poder editarlo o eliminarlo
    try{
        const findUser=await Login.findOne(
            {where:{
                username:req.params.username}
            })
        if(!findUser){
            return res.status(404).json({
                status:'0',
                msg:'no existe el usuario'
            })
        }
        res.json(findUser)
    }
    catch(error){
        res.status(505).json({
            status:'0',
            msg:'no pude encontrar el usuario pa'
        })
    }
}



funcionesUsuario.modifUser= async(req,res)=>{ //este va a ser un boton para modificar al usuario por eso no verifico si existe
    try{ const {id} = req.body
        const updateUser= await Login.update(req.body,{
            where:{id:id}
        })
    }
    catch(error){
        res.status(505).json({
            status:'0',
            msg:'algo salió mal',error
        })
    }
}

module.exports=funcionesUsuario