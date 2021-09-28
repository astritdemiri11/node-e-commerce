// 3rd Party Libs.
const expressLib = require('express');

// Local
const adminController = require('../controllers/admin');

const router = expressLib.Router();

// GET Routes
router.get('/products', adminController.getProducts);
router.get('/add-product', adminController.getAddProduct);
router.get('/edit-product/:id', adminController.getEditProduct);

// POST Routes
router.post('/add-product', adminController.postAddProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;