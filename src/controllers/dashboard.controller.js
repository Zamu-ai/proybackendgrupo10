const {Sequelize, Op}=require('sequelize')
const LoginModel= require('../models/login.model')
const AccesoModel= require('../models/acceso.model')
const AuditoriaModel= require('../models/audit.model')
 
const funcionesDelDashboard={}

funcionesDelDashboard.getMetricasGenerales=async(req,res)=>{
    try{
        const totalUsuario=await LoginModel.count() //count() cuenta el numero de filas de la BD

        const hace7Dias=new Date() //creo el objeto con la fecha y hora actual
        hace7Dias.setDate(hace7Dias.getDate() -7)//lo modifico para que sea la fecha de hace una semana
        const usuariosNuevos= await LoginModel.count({ //creo variable que guarda la cuenta de todos los usuarios creaods hace 7 o mas dias
            where:{createdAt:{[Op.gte]: hace7Dias}}
        })

        const hoy=new Date()
        hoy.setHours(0,0,0,0)
        const loginsHoy= await AccesoModel.count({
            where:{fecha:{[Op.gte]:hoy}},
            exito:true
        })

        const totalAcciones= await AuditoriaModel.count()
        res.json({
            status:'1',
            data:{
                totalUsuarios,
                usuariosNuevos,
                loginsHoy,
                totalAcciones,
            }
        })
    }
    catch(error){
        res.status(500).json({
            status:'0',
            msg:'fallo al realizar las metricas'
        })
    }
}

funcionesDelDashboard.getLoginsPorDia=async(req,res)=>{
    try{
        const hace7Dias=new Date();
        hace7Dias.setDate(hace7Dias.getDate()-7);
        
        const results = await AccesoModel.findAll({
            attributes:[
                //las sequelize.fn le dicen a la BD que ejecuten funciones matematicas internas
                //sequelize.col(nombre_col) se refiere a la BD el nombre real de la columna
                //sequelize.literal le dic a sequelize no lo intente traducir  pq es una query directa
                [sequelize.fn('DATE',sequelize.col('fecha')),'dia'], //le digo a la BD que ejecute DATE y le quita hora y fecha, queda año,mes,dia( pa contar filas)
                [sequelize.fn('COUNT',sequelize.col('*')),'total'],
                [sequelize.fn('COUNT',sequelize.literal("CASE WHEN exito=true THEN 1 END")),'exitosos'],
                [sequelize.fn('COUNT',sequelize.literal("CASE WHEN exito=false THEN 1 END")),'fallidos'],
            ],
            where:{
                fecha:{
                    [Op.gte]: hace7Dias
                }
            },
             group: [sequelize.fn('DATE',sequelize.col('fecha'))], //agrupa en 'paquetes' lo que tira la BD , tonc si hay 40 login el lune los agrupa en una fila
            order:[[sequelize.fn('DATE',sequelize.col('fecha')),'ASC']], //ordena ese paquete de las fechas (anterior group) de forma ascendente
            raw:true //sequlize devuelve func. como .save, .update al ponerlo true, limpia eso y devuelve como array JSON noma
        })
    
        res.json({
            status:'1',
            data:results
        })
    }catch(error){
        res.status(500).json({
            status:'0',
            error:error.message
        })
    }
}

//pal grafico de torta
funcionesDelDashboard.getAccionesPorTipo=async (req,res)=>{
try{
    const Acciones=await AuditoriaModel.findAll({
        attributes:['accion',
            [sequelize.fn('COUNT',sequelize.col('id')),'cantidad']
        ],
        group:['accion'],
        order:[[sequelize.literal('cantidad'),'DESC']],
        limit:10
    })

    const data=Acciones.map(r=>({
        accion:r.accion,
        cantidad:r.dataValues.cantidad
    }))

    res.json({status:'1',
        data
    })

}catch(error){
    res.status(505).json({
        status:'0',
        msg:error.message
    })
}
}

funcionesDelDashboard.getUsuariosMasActivos=async(req,res)=>{
    try{
        const usuariosActivos= await AuditoriaModel.findAll({
            attributes:[
                'usuario',
                [sequelize.fn('COUNT',sequelize.col('id')),'cantidad']
            ],
            where:{
                usuario:{[Op.ne]:'ANONIMO'}
            },
            group:['usuario'],
            order:[[sequelize.literal('cantidad'),'DESC']],
            limit:10
        })
        res.json({
            status:'1',
            data:usuariosActivos
        })
    }catch(error){
          res.status(500).json({
             status: '0', 
             error: error.message })
    }
}

funcionesDelDashboard.getAuditoriaListado=async(req,res)=>{
    try{
        const {page = 1, limit = 10, search=''} = req.query
        const offset=(page -1 )*limit

        const where ={}
            if(search){
                where[Op.or]=[
                    {usuario:{[Op.iLike]:`%${search}%`}},
                    {accion:{[Op.iLike]:`%${search}%`}},
                    {ruta:{[Op.iLike]:`%${search}%`}}
                ]
            }
        
    
        const {count, rows}= await AuditoriaModel.findAndCountAll({
            where,
            order:[['fecha','DESC']],
            limit:parseInt(limit),
            offset:parseInt(offset)
        })
        res.json({
            status:'1',
            data:rows,
            total:count,
            page:parseInt(page),
            totalPages: Math.ceil(count / limit)
        })
    }catch(error){
        res.status(500).json({
            status:'0',
            error:error.message
        })
    }
}

funcionesDelDashboard.getJuegosMasBuscados=async(req,res)=>{
    try{
        const juegosBuscados= await AuditoriaModel.findAll({
            attributes:[
                'resultado',
                [sequelize.fn('COUNT',sequelize.col('id')),'cantidad']
            ],
            where:{
                accion:'BUSCAR_JUEGO'},
            group:['resultado'],
            order:[[sequelize.literal('cantidad'),'DESC']],
            limit:10
        })
        res.json({
            status:'1',
            data:juegosBuscados
        })

    }catch(error){
        res.status(500).json({
            status:'0',
            error:error.message
        })
    }
}

module.exports=funcionesDelDashboard