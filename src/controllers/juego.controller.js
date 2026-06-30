const { Op } = require('sequelize');
const Juego = require('../models/juego.model'); 
const igdbService = require('../services/igdb.service'); //servicio de API externa

const juegoCtrl = {}; // Objeto para guardar funciones

// Obtener TODOS los juegos de nuestra base local (GET)
juegoCtrl.getJuegos = async (req, res) => {
    try {
        const juegos = await Juego.findAll(); 
        res.json(juegos);
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error al obtener los juegos.' });
    }
};

// buscar un juego (Cache / Data On-Demand) (GET)
juegoCtrl.buscarJuego = async (req, res) => {
    try {
        const { nombre } = req.params;

        // busca primero en nuestra base local
        let juego = await Juego.findOne({ where: { titulo: nombre } });

        if (!juego) {
            console.log('Buscando en IGDB para:', nombre);
            const resultados = await igdbService.buscarJuegos(nombre);
            
            if (!resultados || resultados.length === 0) {
                return res.status(404).json({ status: '0', msg: 'Juego no encontrado.' });
            }

            // primer resultado encontrado segun igdb
            const mejorCoincidencia = resultados[0];

            // 3. guardamos en nuestra basededatos usando upsert
            await Juego.upsert(mejorCoincidencia);

            juego = mejorCoincidencia;
        }

        res.json({ status: '1', data: juego });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: '0', msg: 'Error procesando la búsqueda rápida.' });
    }
};

// variables fuera del controlador para que persistan en memoria mientras el servidor corre
let cachePopulares = null;
let ultimaActualizacion = null;

juegoCtrl.getMasJugados = async (req, res) => {
    try {
        const ahora = new Date();
        
        // buscamos si en cache existe y si tiene menos de 24 horas (86400000 ms)
        if (cachePopulares && ultimaActualizacion && (ahora - ultimaActualizacion < 86400000)) {
            console.log('Sirviendo desde cache en memoria...');
            return res.json({ status: '1', data: cachePopulares });
        }

        // Si no hay cache o pasaron mas de 24 horas, consultamos a igdb
        console.log('Actualizando cache de "Más Jugados" desde IGDB...');
        const juegos = await igdbService.obtenerMasJugados();
        
        // guardamos
        cachePopulares = juegos;
        ultimaActualizacion = ahora;

        res.json({ status: '1', data: juegos });
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error al obtener los más jugados.' });
    }
};

juegoCtrl.getSugerencias = async (req, res) => {
    try {
        const { nombre } = req.params;
        // llamamos a buscarJuegos pero pedimos mas resultados
        const resultados = await igdbService.buscarJuegos(nombre); 
        res.json({ status: '1', data: resultados });
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error en sugerencias' });
    }
};

juegoCtrl.guardarJuegoSeleccionado = async (req, res) => {
    try {
        const { juego } = req.body; // El frontend te manda el objeto completo
        await Juego.upsert(juego);
        
        res.json({ status: '1', msg: 'Juego guardado correctamente por ID' });
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error al guardar' });
    }
};

module.exports = juegoCtrl;