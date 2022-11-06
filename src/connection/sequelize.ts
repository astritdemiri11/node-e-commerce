import Cart from '../models/sequelize/cart';
import CartItem from '../models/sequelize/cart-item';
import Order from '../models/sequelize/order';
import OrderItem from '../models/sequelize/order-item';
import Product from '../models/sequelize/product';
import User from '../models/sequelize/user';
import sequelize from '../utils/sequelize/db';

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

export default (callback: any) => {
  sequelize
    // .sync({ force: true })
    .sync()
    .then(() => User.findByPk(1))
    .then((user) => {
      if (!user) {
        return User.create({
          name: 'Astrit Demiri',
          email: 'astritdemiri06@gmail.com',
        });
      }

      return user;
    })
    .then((user: any) => user.createCart())
    .then(() => {
      callback();
    })
    .catch((error) => {
      console.log(error);
    });
};
