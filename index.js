require('dotenv').config();
const passport = require('passport');
const express = require('express');
const cors = require('cors');
const session=require('express-session')
  const sequelize = require('./config/database');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const loginRouter=require('./src/routes/login.route')
const usuarioRouter=require('./src/routes/usuario.route')
const authRouter=require('./src/routes/auth.route')
const juegosRouter= require('./src/routes/juego.route')
const sanitizeInput=require('./src/middlewares/sanitize.middleware');
const app = express();
const pagoRoutes = require('./src/routes/pago.route.js');

//Middlewares de sesión 
app.use(session({
    secret:process.env.SESSION_SECRET || 'session_user',
    resave:false,
    saveUninitialized: false,
    cookie:{
        secure:process.env.NODE_ENV === 'production',
        maxAge: 24*60*60*1000 //24 horas
    }
}))
//inicializo el passport
app.use(passport.initialize())
app.use(passport.session())


// MIDDLEWARES GENERALES
app.use(express.json()); // Para que el backend entienda formato JSON
app.use(cors()); // por ahora abierto para desarrollo local. dsp la URL de Netlify
app.use(sanitizeInput)//<---aplica a todas las rutas
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

//puerto
app.set('port', process.env.PORT || 3000);

// Rutas
app.use('/juego',require('./src/routes/juego.route'));
app.use('/api/login', loginRouter);
app.use('/api/pagos', pagoRoutes);
// LÍNEA PARA LOS ver USUARIOS:
app.use('/api/usuarios', usuarioRouter);
app.use('/juego',juegosRouter);
app.use('/api/auth',authRouter)
app.use('/api/usuarios',usuarioRouter)
app.use('/api/login',loginRouter)

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