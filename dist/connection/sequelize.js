"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_1 = __importDefault(require("../models/sequelize/cart"));
const cart_item_1 = __importDefault(require("../models/sequelize/cart-item"));
const order_1 = __importDefault(require("../models/sequelize/order"));
const order_item_1 = __importDefault(require("../models/sequelize/order-item"));
const product_1 = __importDefault(require("../models/sequelize/product"));
const user_1 = __importDefault(require("../models/sequelize/user"));
const db_1 = __importDefault(require("../utils/sequelize/db"));
product_1.default.belongsTo(user_1.default, { constraints: true, onDelete: 'CASCADE' });
user_1.default.hasMany(product_1.default);
user_1.default.hasOne(cart_1.default);
cart_1.default.belongsTo(user_1.default);
cart_1.default.belongsToMany(product_1.default, { through: cart_item_1.default });
product_1.default.belongsToMany(cart_1.default, { through: cart_item_1.default });
order_1.default.belongsTo(user_1.default);
user_1.default.hasMany(order_1.default);
order_1.default.belongsToMany(product_1.default, { through: order_item_1.default });
exports.default = (callback) => {
    db_1.default
        // .sync({ force: true })
        .sync()
        .then(() => user_1.default.findByPk(1))
        .then((user) => {
        if (!user) {
            return user_1.default.create({
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
