import Order from '../../models/mongoose/order';
import Product from '../../models/mongoose/product';

export const getProducts = (req: Request, res: any) => {
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

export const getProduct = (req: any, res: any) => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then((product: any) => {
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

export const getIndex = (req: Request, res: any) => {
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

export const getCart = (req: any, res: any) => {
  req.user
    .populate('cart.items.productId')
    .then((user: any) => {
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
export const postCart = (req: any, res: any) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'));
};

export const postCartDeleteProduct = (req: any, res: any) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch(() => {

    });
};

export const postOrders = (req: any, res: any) => {
  req.user
    .populate('cart.items.productId')
    .then((user: any) => {
      const products = user.cart.items.map((i: any) => (
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

export const getOrders = (req: any, res: any) => {
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
