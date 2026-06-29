const LoginModel=require('../modells/login.models')
const encriptador= require ('bcrypt')
const funcionesLogin={}

funcionesLogin.createUsuario= async(req,res) =>{
    try{
        const body=req.body

        if(!body.username || !body.password){
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
        const saltRounds = 10
        const contraseñaCifrada= await encriptador.hash(body.password,saltRounds)

        const bodyDelNuevoUsuario={ //creo un nuevo body pq la contraseña ahora va a ir cifrada
            username:body.username,
            password:body.pcontraseñaCifrada,
            nombre:body.nombre,
            apellido:body.apellido,
            perfil:body.perfil
        }
        await LoginModel.create(bodyDelNuevoUsuario)
    }
    catch(error)
    {res.status(500).json({
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
       
                return res.json({
                    status:'1',
                    msg:'se pudo loguear correctamente',
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