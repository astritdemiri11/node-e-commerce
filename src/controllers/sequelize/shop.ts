import { Request, Response } from 'express';

import Product from '../../models/sequelize/product';

// GET Routes
export const getIndex = (_req: Request, res: Response) => {
  Product.findAll().then((products) => {
    res.render('sequelize/shop/products', { products, pageTitle: 'Products', linkIndex: 0 });
  }).catch(() => {
    res.status(500).render('sequelize/shop/products', { pageTitle: 'Products', linkIndex: 0, products: [] });
  });
};

export const getProduct = (req: Request, res: Response) => {
  Product.findByPk(req.params.id).then((product) => {
    if (!product) {
      throw new Error('Product not found!');
    }

    res.render('sequelize/shop/product', { product, pageTitle: 'Product detail', linkIndex: 1 });
  }).catch(() => {
    res.status(500).render('sequelize/shop/product', { pageTitle: 'Product detail', linkIndex: 1, product: null });
  });
};

export const getProducts = (_req: Request, res: Response) => {
  Product.findAll().then((products) => {
    res.render('sequelize/shop/products', { products, pageTitle: 'Products', linkIndex: 1 });
  }).catch(() => {
    res.status(500).render('sequelize/shop/products', { pageTitle: 'Products', linkIndex: 1, products: [] });
  });
};

export const getCart = (req: any, res: Response) => {
  req.user.getCart().then((cart: any) => cart.getProducts()).then((products: any) => {
    res.render('sequelize/shop/cart', { pageTitle: 'Cart', linkIndex: 2, products });
  }).catch(() => {
    res.render('sequelize/shop/cart', { pageTitle: 'Cart', linkIndex: 2, products: [] });
  });
};

export const getOrders = (req: any, res: Response) => {
  req.user.getOrders({ include: ['products'] }).then((orders: any) => {
    res.render('sequelize/shop/orders', { pageTitle: 'Orders', linkIndex: 3, orders });
  }).catch(() => {
    res.status(500).render('sequelize/shop/orders', { pageTitle: 'Orders', linkIndex: 3, orders: [] });
  });
};

export const getCheckout = (_req: Request, res: Response) => {
  res.render('sequelize/shop/checkout', { pageTitle: 'Checkout', linkIndex: -1 });
};

// POST Routes
export const postCart = (req: any, res: Response) => {
  let userCart: any;
  let quantity = 1;

  req.user.getCart().then((cart: any) => {
    if (!cart) {
      throw new Error('Cart not found!');
    }

    userCart = cart;
    return userCart.getProducts({ where: { id: req.body.productId } });
  })
    .then((products: any) => {
      if (products.length > 0) {
        const product = products[0];
        quantity = product.cartItem.quantity + 1;

        return product;
      }

      return Product.findByPk(req.body.productId);
    })
    .then((product: any) => {
      if (!product) {
        throw new Error('Product not found!');
      }

      return userCart.addProduct(product, { through: { quantity } });
    })
    .then((rows: any) => {
      if (rows.length === 0) {
        throw new Error('Product not added!');
      }

      return res.status(201).redirect('/cart');
    })
    .catch(() => res.status(500).redirect('/cart'));
};

export const postOrders = (req: any, res: Response) => {
  let userCart: any = null;
  let cartProducts: any = [];

  req.user.getCart().then((cart: any) => {
    if (!cart) {
      throw new Error('Cart not found!');
    }

    userCart = cart;
    return cart.getProducts();
  }).then((products: any) => {
    if (products.length === 0) {
      throw new Error('Cart products not found!');
    }

    cartProducts = products;
    return req.user.createOrder();
  })
    .then((order: any) => {
      if (!order) {
        throw new Error('Order not found!');
      }

      return order.addProducts(cartProducts.map((product: any) => {
        const prod = product;
        prod.orderItem = { quantity: product.cartItem.quantity };
        return prod;
      }));
    })
    .then((rows: any) => {
      if (rows.length === 0) {
        throw new Error('Products not added!');
      }

      return userCart.setProducts(null);
    })
    .then((rows: any) => {
      if (rows.length === 0) {
        throw new Error('Products not added!');
      }

      res.status(201).redirect('/orders');
    })
    .catch(() => {
      res.status(500).redirect('/cart');
    });
};

export const postCartDeleteProduct = (req: any, res: Response) => {
  req.user.getCart().then((cart: any) => {
    if (!cart) {
      throw new Error('Cart not found!');
    }

    const id = req.body.productId;
    return cart.getProducts({ where: { id } });
  })
    .then((products: any) => {
      if (products.length === 0) {
        throw new Error('Cart product not found!');
      }

      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((item: any) => {
      if (!item) {
        throw new Error('Product not deleted from cart!');
      }

      return res.status(201).redirect('/cart');
    })
    .catch(() => res.status(500).redirect('/cart'));
};
