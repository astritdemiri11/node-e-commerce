import express from 'express';

import * as adminController from '../../controllers/mongoose/admin';
import isAuth from '../../middleware/is-auth';

const router = express.Router();

// GET Routes
router.get('/products', adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

// POST Routes
router.post('/add-product', isAuth, adminController.postAddProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

export default router;
