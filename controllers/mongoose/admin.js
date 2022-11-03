const Product = require('../../models/mongoose/product');

exports.getAddProduct = (req, res) => {
  res.render('mongoose/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    linkIndex: 4,
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    // eslint-disable-next-line no-underscore-dangle
    userId: req.user,
  });

  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(() => {
    });
};

exports.getEditProduct = (req, res) => {
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

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      const prod = product;

      prod.title = updatedTitle;
      prod.price = updatedPrice;
      prod.description = updatedDesc;
      prod.imageUrl = updatedImageUrl;

      return prod.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(() => {

    });
};

exports.getProducts = (req, res) => {
  Product.find()
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
exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;

  Product.findByIdAndRemove(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(() => {

    });
};
