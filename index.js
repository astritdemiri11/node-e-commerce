const app = require('./utils/app');
const sequelize = require('./utils/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

Product.belongsTo(User,  {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

Cart.belongsTo(User);
User.hasOne(Cart);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize.sync().then(() => {
    return User.findByPk(1);
}).then(user => {
    if(!user) {
        return User.create({ name: 'Astrit Demiri', email: 'astritdemiri11@gmail.com' });
    }

    return user;
}).then(user => {
    if(!user) {
        throw new Error('User not created successfully');
    }

    return user.getCart().then(cart => {
        if(!cart) {
            return user.createCart();
        }

        return cart;
    });
}).then(() => {
    const port = process.env.PORT || 3000;
    
    app.listen(port, () => {
        console.log(`Running on port ${port}`);
    });
}).catch(error => console.log(error));