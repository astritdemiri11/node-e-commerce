import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Product from '../../models/mongoose/product';
import * as fileHelper from '../../utils/file';

export const getAddProduct = (_req: Request, res: Response) => {
  res.render('mongoose/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    linkIndex: 4,
  });
};

export const postAddProduct = (req: any, res: Response, next: NextFunction) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  const image = req.file;

  if (!image) {
    return res.status(422).render('mongoose/admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      product: {
        title,
        price,
        description
      },
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not an image.',
      validationErrors: [],
      linkIndex: 4,
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('mongoose/admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      product: {
        title,
        price,
        description,
      },
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      linkIndex: 4,
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user,
  });

  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

export const getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.id;

  return Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      return res.render('mongoose/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        linkIndex: 5,
      });
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

export const postEditProduct = (req: any, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('mongoose/admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      linkIndex: 5,
    });
  }

  Product.findById(prodId)
    .then((product: any) => {
      if (product) {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect('/');
        }

        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;

        if (image) {
          fileHelper.deleteFile(product.imageUrl);
          product.imageUrl = image.path;
        }

        return product.save()
          .then(() => {
            res.redirect('/admin/products');
          });
      }
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

export const getProducts = (req: any, res: Response, next: NextFunction) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render('mongoose/admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        linkIndex: 5,
      });
    })
    .catch((error) => {
      return next(new Error(error));
    });
};

// POST Routes
export const postDeleteProduct = (req: any, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error('Product not found.'));
      }

      fileHelper.deleteFile(product.imageUrl);

      Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      return next(new Error(error));
    });
};
