const { Sequelize } = require('sequelize');

// (Base de datos, Usuario, Pass)
const sequelize = new Sequelize('tpfinalbackend', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // evita que la consola se llene de mensajes SQL molestos
});

// Probar conexion
sequelize.authenticate()
    .then(() => console.log('DB conectada con PostgreSQL'))
    .catch(err => console.error('Error al conectar a PostgreSQL:', err));

module.exports = sequelize;