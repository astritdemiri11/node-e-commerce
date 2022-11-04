"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDeleteProduct = exports.postEditProduct = exports.postAddProduct = exports.getEditProduct = exports.getAddProduct = exports.getProducts = void 0;
// GET Routes
const getProducts = (req, res) => {
    req.user.getProducts().then((products) => {
        res.render('sequelize/admin/products', { products, pageTitle: 'Products', linkIndex: 5 });
    }).catch(() => {
        res.status(500).render('sequelize/admin/products', { pageTitle: 'Products', linkIndex: 5, products: [] });
    });
};
exports.getProducts = getProducts;
const getAddProduct = (req, res) => {
    res.render('sequelize/admin/edit-product', { pageTitle: 'Add Product', linkIndex: 4, editing: false });
};
exports.getAddProduct = getAddProduct;
const getEditProduct = (req, res) => {
    const editing = JSON.parse(req.query.edit || false);
    if (!editing) {
        return res.status(400).redirect('/admin/products');
    }
    return req.user.getProducts({ where: { id: req.params.id } }).then((products) => {
        if (products.length === 0) {
            return res.status(500).redirect('/admin/products');
        }
        const product = products[0];
        return res.render('sequelize/admin/edit-product', {
            pageTitle: 'Edit Product', linkIndex: 5, editing, product,
        });
    });
};
exports.getEditProduct = getEditProduct;
// POST Routes
const postAddProduct = (req, res) => {
    let { title, price, imageUrl, description, } = req.body;
    title = title.trim();
    price = parseFloat(price);
    imageUrl = imageUrl.trim();
    description = description.trim();
    req.user.createProduct({
        title, price, imageUrl, description,
    }).then(() => res.redirect('/admin/products'));
};
exports.postAddProduct = postAddProduct;
const postEditProduct = (req, res) => {
    const { productId: id } = req.body;
    let { title, imageUrl, price, description, } = req.body;
    title = title.trim();
    price = parseFloat(price);
    imageUrl = imageUrl.trim();
    description = description.trim();
    req.user.getProducts({ where: { id } }).then((products) => {
        if (products.length === 0) {
            return res.status(500).redirect('/admin/products');
        }
        const product = products[0];
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save();
    }).then(() => res.redirect('/admin/products'));
};
exports.postEditProduct = postEditProduct;
const postDeleteProduct = (req, res) => {
    req.user.getProducts({ where: { id: req.body.productId } }).then((products) => {
        if (products.length === 0) {
            return res.status(500).redirect('/admin/products');
        }
        return products[0].destroy();
    }).then(() => res.redirect('/admin/products'));
};
exports.postDeleteProduct = postDeleteProduct;
