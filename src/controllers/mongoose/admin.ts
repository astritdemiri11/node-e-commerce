import { Request, Response } from 'express';

import Product from '../../models/mongoose/product';

export const getAddProduct = (_req: Request, res: Response) => {
  res.render('mongoose/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    linkIndex: 4,
  });
};

export const postAddProduct = (req: any, res: Response) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.user,
  });

  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(() => {
    });
};

export const getEditProduct = (req: Request, res: Response) => {
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
        linkIndex: 5,
      });
    })
    .catch(() => {

    });
};

export const postEditProduct = (req: any, res: Response) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product: any) => {
      if (product) {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect('/');
        }

        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;

        return product.save()
          .then(() => {
            res.redirect('/admin/products');
          });
      }
    })
    .catch(() => {

    });
};

export const getProducts = (req: any, res: Response) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render('mongoose/admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        linkIndex: 5,
      });
    })
    .catch(() => {

    });
};

// POST Routes
export const postDeleteProduct = (req: any, res: Response) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(() => {

    });
};
