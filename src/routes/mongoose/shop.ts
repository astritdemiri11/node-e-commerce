import express from 'express';

import * as shopController from '../../controllers/mongoose/shop';
import isAuth from '../../middleware/is-auth';

const router = express.Router();

// GET Routes
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.get('/orders', isAuth, shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);

// POST Routes
router.post('/cart', isAuth, shopController.postCart);
router.post('/delete-cart-product', isAuth, shopController.postCartDeleteProduct);
router.post('/orders', isAuth, shopController.postOrders);

export default router;
