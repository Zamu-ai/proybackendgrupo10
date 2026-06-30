const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); 

const Juego = sequelize.define('Juego', {
    id: { // id de IGDB
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT, // TEXT por que las descripciones son largas
        allowNull: true
    },
    imagen_portada: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    plataformas: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'juegos',
    timestamps: true // saber cuando guardamos el juego en local
});

module.exports = Juego;