"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDeleteProduct = exports.getProducts = exports.postEditProduct = exports.getEditProduct = exports.postAddProduct = exports.getAddProduct = void 0;
const product_1 = __importDefault(require("../../models/mongoose/product"));
const getAddProduct = (req, res) => {
    res.render('mongoose/admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        linkIndex: 4,
        editing: false,
    });
};
exports.getAddProduct = getAddProduct;
const postAddProduct = (req, res) => {
    const product = new product_1.default({
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
exports.postAddProduct = postAddProduct;
const getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.id;
    return product_1.default.findById(prodId)
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
exports.getEditProduct = getEditProduct;
const postEditProduct = (req, res) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    product_1.default.findById(prodId)
        .then((product) => {
        if (product) {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        }
    })
        .then(() => {
        res.redirect('/admin/products');
    })
        .catch(() => {
    });
};
exports.postEditProduct = postEditProduct;
const getProducts = (req, res) => {
    product_1.default.find()
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
exports.getProducts = getProducts;
// POST Routes
const postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    product_1.default.findByIdAndRemove(prodId)
        .then(() => {
        res.redirect('/admin/products');
    })
        .catch(() => {
    });
};
exports.postDeleteProduct = postDeleteProduct;
