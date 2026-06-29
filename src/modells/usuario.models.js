const {DataTypes}= require ('sequelize')
const ConexionABd=require ('../../config/database')
const Usuarios=ConexionABd.define('Usuario',{
      id: {  //neceista llevar al menos un campo para que sequlize lo cree
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

Usuarios.belongsTo(Login,{
    foreignKey:{
    name:'loginId',
    allownull:false},
    as: 'login'
})
module.exports=Usuarios