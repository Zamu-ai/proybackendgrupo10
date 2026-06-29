const LoginModel=require('../modells/login.model')
const encriptador= require ('bcrypt')
const jwt = require('jsonwebtoken')
const funcionesLogin={}

funcionesLogin.createUsuario= async(req,res) =>{
    try{
        const body=req.body

        if(!body.username || !body.password || !body.nombre || !body.apellido){
            res.status(404).json({
                status:'0',
                msg:'complete los campos correspondientes'
            })
        }
        const sameUser=await LoginModel.findOne({
            where:{username: body.username}
            })

        if(sameUser)
            {return res.status(404).json({
                msg:'este username estan usado ingrese otro'
            })
            }
        const cifrado = 10
        const contraseñaCifrada= await encriptador.hash(body.password,cifrado)

        const bodyDelNuevoUsuario={ //creo un nuevo body pq la contraseña ahora va a ir cifrada
            username:body.username,
            password:contraseñaCifrada,
            nombre:body.nombre,
            apellido:body.apellido,
            perfil:body.perfil
        }
        await LoginModel.create(bodyDelNuevoUsuario)
    }
    catch(error)
    {   console.error('Error al crear usuario:', error)
        res.status(500).json({
        status:'0',
        msg:'no se pudo crear el usuario',error
    })}
}

funcionesLogin.loginUsuario= async(req,res) =>{
    try{
        const body=req.body
        if(!body.username || !body.password){
            return res.status(404).json({
                status:'0',
                msg:'complete los campos correspondientes'
            })
        }

        const userIdentico= await LoginModel.findOne({
            where:{
                username:body.username  }
        })

        if(!userIdentico){
            return res.status(404).json({
                status:'0',
                msg:'este usuario no existe'
            })
        }

        const compararContras= await encriptador.compare(body.password,userIdentico.password)

        if(!compararContras){
            return res.status(404).json({
                status:'0',
                msg:'contraseña incorrecta pa'
            })
        }
        const JWT_SECRET = process.env.JWT_SECRET || 'token_pal_usuario'
        const token= jwt.sign(
            {
                id:userIdentico.id,
                username:userIdentico.username,
                perfil:userIdentico.perfil
            },
            'token_pal_usuario',
            {expiresIn:'2h'} //el token expira en 2 horas
        )
       
                return res.json({
                    status:'1',
                    msg:'se pudo loguear correctamente',
                    token: token,
                    username:userIdentico.username,
                    password:userIdentico.password,
                    userId:userIdentico._id
            })
        

    }
    catch(error){
        res.status(505).json({
            status:'0',
            msg:'error en el logueo',error
        })
    }
}

module.exports=funcionesLogin