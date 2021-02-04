const path = require('path');

const express = require('express');
const isAuth = require('../middleware/auth-check');
const { body } = require('express-validator/check');

const rootDir = require('../util/path');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth,adminController.getAddProducts);

// /admin/edit-product => GET
router.post('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl').isURL(),
        body('cost').isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],isAuth, adminController.postEditProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

// /admin/products => GET
router.get('/products',isAuth,adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl').isURL(),
        body('cost').isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],isAuth,adminController.postAddProducts);

// /admin/delete-product ->POST
router.post('/delete-product',isAuth,adminController.postDeleteProduct);
module.exports = router;
