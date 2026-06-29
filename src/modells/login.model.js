const {DataTypes}=require ('sequelize')
const ConexionABd=require('../../config/database')
const Login = ConexionABd.define('Login',{
    username:{type:DataTypes.STRING,allowNull:false},
    password:{type:DataTypes.STRING,allowNull:false},
    nombre:{type:DataTypes.STRING,allowNull:false},
    apellido:{type:DataTypes.STRING,allowNull:false},
    perfil:{type:DataTypes.STRING,allowNull:false},
},{
    tableName:'logins',
    timestamps:true,
})

module.exports=Login