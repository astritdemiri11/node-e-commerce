const Sequelize = require('sequelize');

const sequelize = require('../../utils/db/sequelize');

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
