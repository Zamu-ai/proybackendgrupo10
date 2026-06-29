const express = require('express');
const cors = require('cors');
require('dotenv').config()
const sequelize = require('./config/database');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const loginRouter=require('./src/routers/login.route')
const usuarioRouter=require('./src/routers/usuario.route')
const app = express();

// MIDDLEWARES GENERALES
app.use(express.json()); // Para que el backend entienda formato JSON
app.use(cors()); // Temporalmente abierto para desarrollo local. dsp la URL de Netlify

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Configuración del puerto
app.set('port', process.env.PORT || 3000);


// Rutas
app.use('/api/login',loginRouter)
app.use('/api/usuarios',usuarioRouter)
// SINCRONIZAR BASE DE DATOS Y ARRANCAR
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Tablas de PostgreSQL sincronizadas');
        app.listen(app.get('port'), () => {
            console.log(`Servidor corriendo en el puerto`, app.get('port'));
        });
    })
    .catch(err => {
        console.error('Error fatal: No se pudo iniciar el servidor o conectar a la BD:', err);
    });