const Sequelize = require('sequelize');

const sequelize = require('../../utils/sequelize/db');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

module.exports = Order;
