const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProducts);

// /admin/edit-product => GET
router.post('/edit-product', adminController.postEditProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', adminController.getEditProduct);

// /admin/products => GET
router.get('/products',adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',adminController.postAddProducts);

// /admin/delete-product ->POST
router.post('/delete-product',adminController.postDeleteProduct);
module.exports = router;
