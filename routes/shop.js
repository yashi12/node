const path = require('path');

const isAuth = require('../middleware/auth-check');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/',shopController.getIndex );

router.get('/products',shopController.getProducts);

router.get('/products/:productId',shopController.getProductDetail);

router.get('/cart',isAuth,shopController.getCart);

router.post('/cart',isAuth,shopController.postCart);

router.post('/cart-delete-item',isAuth,shopController.postDeleteCartProduct);

router.post('/create-order',isAuth,shopController.postOrder);

router.get('/orders',isAuth,shopController.getOrders);

// router.get('/checkout',shopController.getCheckout);

module.exports = router;
