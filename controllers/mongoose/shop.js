const Product = require('../../models/mongoose/product');
const Order = require('../../models/mongoose/order');

exports.getProducts = (req, res) => {
  Product.find()
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

exports.getProduct = (req, res) => {
  const prodId = req.params.id;
  Product.findById(prodId)
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

exports.getIndex = (req, res) => {
  Product.find()
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

exports.getCart = (req, res) => {
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

// POST Routes
exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'));
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch(() => {

    });
};

exports.postOrders = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((i) => (
        // eslint-disable-next-line no-underscore-dangle
        { quantity: i.quantity, product: { ...i.productId._doc } }
      ));

      const order = new Order({
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

exports.getOrders = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  Order.find({ 'user.userId': req.user._id })
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
