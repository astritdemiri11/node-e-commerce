const express = require('express');

const shopController = require('../../controllers/mongoose/shop');

const router = express.Router();

// GET Routes
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.get('/orders', shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);

// POST Routes
router.post('/cart', shopController.postCart);
router.post('/delete-cart-product', shopController.postCartDeleteProduct);
router.post('/orders', shopController.postOrders);

module.exports = router;
