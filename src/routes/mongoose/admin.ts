import express from 'express';

import * as adminController from '../../controllers/mongoose/admin';

const router = express.Router();

// GET Routes
router.get('/products', adminController.getProducts);
router.get('/add-product', adminController.getAddProduct);
router.get('/edit-product/:id', adminController.getEditProduct);

// POST Routes
router.post('/add-product', adminController.postAddProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

export default router;
