const Product = require('../models/product');

const getIndex = (req, res, next) => {
    Product.fetchAll((products)=>{
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Index',
            path: '/',
            hasProducts: products.length > 0,
        });
    });
};

const getProducts = (req, res, next) => {
     Product.fetchAll((products)=>{
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

const getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
    });
};

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
    });
};

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

module.exports= {
    getProducts:getProducts,
    getIndex:getIndex,
    getCart:getCart,
    getCheckout:getCheckout,
    getOrders:getOrders
}
