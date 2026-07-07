require('dotenv').config();
const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const Compra = require('../models/compra.model');
const autenticar = require('../middlewares/auth.middleware');

// 1. Inicializamos Mercado Pago con tu Token del .env
// Ponemos un console.log acá para verificar si lee el token en la consola
console.log("TOKEN DETECTADO:", process.env.MERCADOPAGO_ACCESS_TOKEN ? "SÍ (Existe)" : "NO (Está vacío)");
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

// 2. Definimos la ruta POST para crear la preferencia de compra
router.post('/crear-preferencia', async (req, res) => {
  try {
    const { titulo, precio, juegoId } = req.body;

    if (!titulo || !precio) {
      return res.status(400).json({ status: "0", msg: "Faltan datos del juego." });
    }

    const preference = new Preference(client);

    // Estructura oficial y limpia para el SDK v2 en Node.js
    const result = await preference.create({
      body: {
        items: [
          {
            id: juegoId,        // Pasalo directo (si es un número, que vaya como número)
            title: titulo,      // El string limpio que viene del body
            quantity: 1,
            unit_price: Number(precio),
            currency_id: 'ARS'
          }
        ],
        back_urls: {
          success: 'http://localhost:4200/pago-exitoso',
          failure: 'http://localhost:4200/home',
          pending: 'http://localhost:4200/home'
        }
      }
    });

    // Enviamos la respuesta exitosa
    return res.json({
      status: "1",
      id: result.id,
      init_point: result.init_point
    });

  } catch (error) {
    console.error("Error al crear preferencia en MP:", error);
    return res.status(500).json({ 
      status: "0", 
      msg: "Error interno al procesar el pago con Mercado Pago." 
    });
  }
});
router.post('/confirmar-compra', autenticar, async (req, res) => {
  try {
    const { juegoId, tituloJuego, precioPagado, paymentIdMercadoPago, estado } = req.body;

    // 🚀 Extraemos el ID real que descifró el middleware 'autenticar'
    const usuarioId = req.usuario?.id || req.user?.id;
    
    // Si el token no tiene un ID válido, cortamos acá por seguridad
    if (!usuarioId) {
      return res.status(401).json({ 
        status: "0", 
        msg: "No se pudo identificar al usuario. Token inválido o ausente." 
      });
    }

    console.log("-> 🐘 IMPACTANDO COMPRA REAL EN POSTGRES PARA EL USUARIO ID:", usuarioId);

    const nuevaCompra = await Compra.create({
      usuarioId: usuarioId, // El usuario logueado en Angular
      juegoId: String(juegoId),
      tituloJuego: String(tituloJuego),
      precioPagado: Number(precioPagado),
      paymentIdMercadoPago: String(paymentIdMercadoPago),
      estado: String(estado)
    });

    return res.status(201).json({
      status: "1",
      msg: "¡Compra registrada con éxito en PostgreSQL!",
      data: nuevaCompra
    });

  } catch (error) {
    console.error("Error al registrar la compra en la base de datos:", error);
    return res.status(500).json({ 
      status: "0", 
      msg: "Error interno al intentar guardar la compra." 
    });
  }
});

module.exports = router;