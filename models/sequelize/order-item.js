const Sequelize = require('sequelize');

const sequelize = require('../../utils/sequelize/db');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = OrderItem;
