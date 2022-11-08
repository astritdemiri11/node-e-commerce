import express from 'express';
import { body } from 'express-validator';

import * as adminController from '../../controllers/mongoose/admin';
import isAuth from '../../middleware/is-auth';

const router = express.Router();

// GET Routes
router.get('/products', adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

// POST Routes
router.post('/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct);
router.post('/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

export default router;
