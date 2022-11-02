const Sequelize = require('sequelize');

const sequelize = require('../../utils/db/sequelize');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = CartItem;
