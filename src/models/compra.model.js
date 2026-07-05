const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // 👈 Ajustá la ruta a tu configuración de base de datos

const Compra = sequelize.define('Compra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del usuario que compra (extraído del Token)'
  },
  juegoId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'ID del juego adquirido'
  },
  tituloJuego: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precioPagado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentIdMercadoPago: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'El payment_id que nos dio Mercado Pago'
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'approved'
  }
}, {
  tableName: 'compras',
  timestamps: true // Nos crea automáticamente las columnas createdAt y updatedAt
});

module.exports = Compra;