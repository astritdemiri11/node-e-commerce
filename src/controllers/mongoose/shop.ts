import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

import Order from '../../models/mongoose/order';
import Product from '../../models/mongoose/product';

export const getProducts = (_req: Request, res: any, next: NextFunction) => {
  Product.find()
    .then((products) => {
      res.render('mongoose/shop/products', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        linkIndex: 1,
      });
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

export const getProduct = (req: any, res: any, next: NextFunction) => {
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
    .catch((error) => {
      return next(new Error(error));
    });
};

export const getIndex = (_req: Request, res: any, next: NextFunction) => {
  Product.find()
    .then((products) => {
      res.render('mongoose/shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
        linkIndex: 0,
      });
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

export const getCart = (req: any, res: any, next: NextFunction) => {
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
    .catch((error: any) => {
      return next(new Error(error));
    });
};

// POST Routes
export const postCart = (req: any, res: any) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'));
};

export const postCartDeleteProduct = (req: any, res: any, next: NextFunction) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch((error: any) => {
      return next(new Error(error));
    });
};

export const postOrders = (req: any, res: any, next: NextFunction) => {
  req.user
    .populate('cart.items.productId')
    .then((user: any) => {
      const products = user.cart.items.map((i: any) => (
        { quantity: i.quantity, product: { ...i.productId._doc } }
      ));

      const order = new Order({
        user: {
          email: req.user.email,
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
    .catch((error: any) => {
      return next(new Error(error));
    });
};

export const getOrders = (req: any, res: any, next: NextFunction) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('mongoose/shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        linkIndex: 3,
      });
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

export const getInvoice = (req: any, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('No order found.'));
      }

      if (order.user && order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
            ' - ' +
            prod.quantity +
            ' x ' +
            '$' +
            prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
    })
    .catch(err => next(err));
};
