const Sequelize = require('sequelize');

const sequelize = require('../../utils/sequelize/db');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

module.exports = Cart;
