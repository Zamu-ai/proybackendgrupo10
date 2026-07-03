require('dotenv').config();
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
app.use(cors()); // por ahora abierto para desarrollo local. dsp la URL de Netlify

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

//puerto
app.set('port', process.env.PORT || 3000);


// Rutas
app.use('/juego',require('./src/routes/juego.route'));
app.use('/api/login', loginRouter);
// LÍNEA PARA LOS ver USUARIOS:
app.use('/api/usuarios', usuarioRouter);
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