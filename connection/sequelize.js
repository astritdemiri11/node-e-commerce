const Cart = require('../models/sequelize/cart');
const CartItem = require('../models/sequelize/cart-item');
const Order = require('../models/sequelize/order');
const OrderItem = require('../models/sequelize/order-item');
const Product = require('../models/sequelize/product');
const User = require('../models/sequelize/user');

const sequelize = require('../utils/sequelize/db');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

const connect = (callback) => {
  sequelize
    // .sync({ force: true })
    .sync()
    .then(() => User.findByPk(1))
    .then((user) => {
      if (!user) {
        return User.create({
          name: 'Astrit Demiri',
          email: 'contact@astritdemiri.com',
        });
      }

      return user;
    })
    .then((user) => user.createCart())
    .then(() => {
      callback();
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connect;
