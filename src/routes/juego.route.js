const { Router } = require('express');
const express=require('express')
const router=express.Router()
const juegoCtrl = require('../controllers/juego.controller');

// obtener TODOS los juegos locales cache (GET)
router.get('/', juegoCtrl.getJuegos);

// buscar un juego en IGDB o en la cache (GET)
router.get('/buscar/:nombre', juegoCtrl.buscarJuego);

router.get('/mas-jugados', juegoCtrl.getMasJugados);

// autocompletado (mientras el usuario escribe)
router.get('/sugerencias/:nombre', juegoCtrl.getSugerencias);

// guardar el juego cuando el usuario hace clic
router.post('/seleccionar', juegoCtrl.guardarJuegoSeleccionado);

module.exports = router;