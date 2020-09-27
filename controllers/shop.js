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

const getProductDetail = (req,res,next)=>{
   const productId = req.params.productId;
   Product.findById(productId, product=>{
       // console.log(product);
       res.render('shop/product-detail',{
           product:product,
           path:'/products',
           pageTitle:product.title
       });
   });
};

const getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
    });
};

const postCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    res.redirect('/cart');
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
    getOrders:getOrders,
    getProductDetail:getProductDetail,
    postCart:postCart
}
