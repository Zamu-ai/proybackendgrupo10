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

    // Mandamos el objeto exacto según la especificación del SDK v2
    const result = await preference.create({
      body: {
        items: [
          {
            id: String(juegoId),
            title: String(titulo),
            quantity: 1,
            unit_price: Number(precio),
            currency_id: 'ARS'
          }
        ],
        back_urls: {
          success: 'http://localhost:4200/pago-exitoso',
          failure: 'http://localhost:4200/home',
          pending: 'http://localhost:4200/home'
        },
        //auto_return: 'approved'
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

module.exports = router;