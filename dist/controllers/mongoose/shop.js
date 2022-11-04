"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.postOrders = exports.postCartDeleteProduct = exports.postCart = exports.getCart = exports.getIndex = exports.getProduct = exports.getProducts = void 0;
const order_1 = __importDefault(require("../../models/mongoose/order"));
const product_1 = __importDefault(require("../../models/mongoose/product"));
const getProducts = (req, res) => {
    product_1.default.find()
        .then((products) => {
        res.render('mongoose/shop/products', {
            products,
            pageTitle: 'All Products',
            path: '/products',
            linkIndex: 1,
        });
    })
        .catch(() => {
    });
};
exports.getProducts = getProducts;
const getProduct = (req, res) => {
    const prodId = req.params.id;
    product_1.default.findById(prodId)
        .then((product) => {
        res.render('mongoose/shop/product', {
            product,
            pageTitle: product.title,
            path: '/products',
            linkIndex: 1,
        });
    })
        .catch(() => {
    });
};
exports.getProduct = getProduct;
const getIndex = (req, res) => {
    product_1.default.find()
        .then((products) => {
        res.render('mongoose/shop/index', {
            products,
            pageTitle: 'Shop',
            path: '/',
            linkIndex: 0,
        });
    })
        .catch(() => {
    });
};
exports.getIndex = getIndex;
const getCart = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .then((user) => {
        const products = user.cart.items;
        res.render('mongoose/shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products,
            linkIndex: 2,
        });
    })
        .catch(() => {
    });
};
exports.getCart = getCart;
// POST Routes
const postCart = (req, res) => {
    const prodId = req.body.productId;
    product_1.default.findById(prodId)
        .then((product) => req.user.addToCart(product))
        .then(() => res.redirect('/cart'));
};
exports.postCart = postCart;
const postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(() => res.redirect('/cart'))
        .catch(() => {
    });
};
exports.postCartDeleteProduct = postCartDeleteProduct;
const postOrders = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .then((user) => {
        const products = user.cart.items.map((i) => ({ quantity: i.quantity, product: Object.assign({}, i.productId._doc) }));
        const order = new order_1.default({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            products,
        });
        return order.save();
    })
        .then(() => req.user.clearCart())
        .then(() => {
        res.redirect('/orders');
    })
        .catch(() => {
    });
};
exports.postOrders = postOrders;
const getOrders = (req, res) => {
    order_1.default.find({ 'user.userId': req.user._id })
        .then((orders) => {
        res.render('mongoose/shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders,
            linkIndex: 3,
        });
    })
        .catch(() => {
    });
};
exports.getOrders = getOrders;
