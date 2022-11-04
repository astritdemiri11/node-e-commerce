"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCartDeleteProduct = exports.postOrders = exports.postCart = exports.getCheckout = exports.getOrders = exports.getCart = exports.getProducts = exports.getProduct = exports.getIndex = void 0;
const product_1 = __importDefault(require("../../models/sequelize/product"));
// GET Routes
const getIndex = (req, res) => {
    product_1.default.findAll().then((products) => {
        res.render('sequelize/shop/products', { products, pageTitle: 'Products', linkIndex: 0 });
    }).catch(() => {
        res.status(500).render('sequelize/shop/products', { pageTitle: 'Products', linkIndex: 0, products: [] });
    });
};
exports.getIndex = getIndex;
const getProduct = (req, res) => {
    product_1.default.findByPk(req.params.id).then((product) => {
        if (!product) {
            throw new Error('Product not found!');
        }
        res.render('sequelize/shop/product', { product, pageTitle: 'Product detail', linkIndex: 1 });
    }).catch(() => {
        res.status(500).render('sequelize/shop/product', { pageTitle: 'Product detail', linkIndex: 1, product: null });
    });
};
exports.getProduct = getProduct;
const getProducts = (req, res) => {
    product_1.default.findAll().then((products) => {
        res.render('sequelize/shop/products', { products, pageTitle: 'Products', linkIndex: 1 });
    }).catch(() => {
        res.status(500).render('sequelize/shop/products', { pageTitle: 'Products', linkIndex: 1, products: [] });
    });
};
exports.getProducts = getProducts;
const getCart = (req, res) => {
    req.user.getCart().then((cart) => cart.getProducts()).then((products) => {
        res.render('sequelize/shop/cart', { pageTitle: 'Cart', linkIndex: 2, products });
    }).catch(() => {
        res.render('sequelize/shop/cart', { pageTitle: 'Cart', linkIndex: 2, products: [] });
    });
};
exports.getCart = getCart;
const getOrders = (req, res) => {
    req.user.getOrders({ include: ['products'] }).then((orders) => {
        res.render('sequelize/shop/orders', { pageTitle: 'Orders', linkIndex: 3, orders });
    }).catch(() => {
        res.status(500).render('sequelize/shop/orders', { pageTitle: 'Orders', linkIndex: 3, orders: [] });
    });
};
exports.getOrders = getOrders;
const getCheckout = (req, res) => {
    res.render('sequelize/shop/checkout', { pageTitle: 'Checkout', linkIndex: -1 });
};
exports.getCheckout = getCheckout;
// POST Routes
const postCart = (req, res) => {
    let userCart;
    let quantity = 1;
    req.user.getCart().then((cart) => {
        if (!cart) {
            throw new Error('Cart not found!');
        }
        userCart = cart;
        return userCart.getProducts({ where: { id: req.body.productId } });
    })
        .then((products) => {
        if (products.length > 0) {
            const product = products[0];
            quantity = product.cartItem.quantity + 1;
            return product;
        }
        return product_1.default.findByPk(req.body.productId);
    })
        .then((product) => {
        if (!product) {
            throw new Error('Product not found!');
        }
        return userCart.addProduct(product, { through: { quantity } });
    })
        .then((rows) => {
        if (rows.length === 0) {
            throw new Error('Product not added!');
        }
        return res.status(201).redirect('/cart');
    })
        .catch(() => res.status(500).redirect('/cart'));
};
exports.postCart = postCart;
const postOrders = (req, res) => {
    let userCart = null;
    let cartProducts = [];
    req.user.getCart().then((cart) => {
        if (!cart) {
            throw new Error('Cart not found!');
        }
        userCart = cart;
        return cart.getProducts();
    }).then((products) => {
        if (products.length === 0) {
            throw new Error('Cart products not found!');
        }
        cartProducts = products;
        return req.user.createOrder();
    })
        .then((order) => {
        if (!order) {
            throw new Error('Order not found!');
        }
        return order.addProducts(cartProducts.map((product) => {
            const prod = product;
            prod.orderItem = { quantity: product.cartItem.quantity };
            return prod;
        }));
    })
        .then((rows) => {
        if (rows.length === 0) {
            throw new Error('Products not added!');
        }
        return userCart.setProducts(null);
    })
        .then((rows) => {
        if (rows.length === 0) {
            throw new Error('Products not added!');
        }
        res.status(201).redirect('/orders');
    })
        .catch(() => {
        res.status(500).redirect('/cart');
    });
};
exports.postOrders = postOrders;
const postCartDeleteProduct = (req, res) => {
    req.user.getCart().then((cart) => {
        if (!cart) {
            throw new Error('Cart not found!');
        }
        const id = req.body.productId;
        return cart.getProducts({ where: { id } });
    })
        .then((products) => {
        if (products.length === 0) {
            throw new Error('Cart product not found!');
        }
        const product = products[0];
        return product.cartItem.destroy();
    })
        .then((item) => {
        if (!item) {
            throw new Error('Product not deleted from cart!');
        }
        return res.status(201).redirect('/cart');
    })
        .catch(() => res.status(500).redirect('/cart'));
};
exports.postCartDeleteProduct = postCartDeleteProduct;
