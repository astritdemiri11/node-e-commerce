const Product = require('../models/sequelize/product');

// GET Routes
module.exports.getIndex = (_req, res) => {
  Product.findAll().then((products) => {
    res.render('shop/products', { products, pageTitle: 'Products', linkIndex: 0 });
  }).catch(() => {
    res.status(500).render('shop/products', { pageTitle: 'Products', linkIndex: 0, products: [] });
  });
};

module.exports.getProductDetail = (req, res) => {
  Product.findByPk(req.params.id).then((product) => {
    if (!product) {
      throw new Error('Product not found!');
    }

    res.render('shop/product-detail', { product, pageTitle: 'Product detail', linkIndex: 1 });
  }).catch(() => {
    res.status(500).render('shop/product-detail', { pageTitle: 'Product detail', linkIndex: 1, product: null });
  });
};

module.exports.getProducts = (_req, res) => {
  Product.findAll().then((products) => {
    res.render('shop/products', { products, pageTitle: 'Products', linkIndex: 1 });
  }).catch(() => {
    res.status(500).render('shop/products', { pageTitle: 'Products', linkIndex: 1, products: [] });
  });
};

module.exports.getCart = (req, res) => {
  req.user.getCart().then((cart) => cart.getProducts()).then((products) => {
    res.render('shop/cart', { pageTitle: 'Cart', linkIndex: 2, products });
  }).catch(() => {
    res.render('shop/cart', { pageTitle: 'Cart', linkIndex: 2, products: [] });
  });
};

module.exports.getOrders = (req, res) => {
  req.user.getOrders({ include: ['products'] }).then((orders) => {
    res.render('shop/orders', { pageTitle: 'Orders', linkIndex: 3, orders });
  }).catch(() => {
    res.status(500).render('shop/orders', { pageTitle: 'Orders', linkIndex: 3, orders: [] });
  });
};

module.exports.getCheckout = (_req, res) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', linkIndex: -1 });
};

// POST Routes
module.exports.postCart = (req, res) => {
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

      return Product.findByPk(req.body.productId);
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

module.exports.postOrders = (req, res) => {
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

module.exports.postDeleteCartProduct = (req, res) => {
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
