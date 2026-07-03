const { Router } = require('express');
const express=require('express')
const router=express.Router()
const juegoCtrl = require('../controllers/juego.controller');

// obtener TODOS los juegos locales cache (GET)
router.get('/', juegoCtrl.getJuegos);

router.get('/mas-jugados', juegoCtrl.getMasJugados);

// autocompletado (mientras el usuario escribe)
router.get('/sugerencias/:nombre', juegoCtrl.getSugerencias);

// Ruta para ver la página de detalle de un juego con sus DLCs y Similares
router.get('/detalle/:id', juegoCtrl.getDetalleJuego);

//ruta para testear juegos 
router.get('/test/:id', juegoCtrl.getTest);

module.exports = router;