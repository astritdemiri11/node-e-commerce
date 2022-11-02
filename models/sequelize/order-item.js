const Sequelize = require('sequelize');

const sequelize = require('../../utils/db/sequelize');

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