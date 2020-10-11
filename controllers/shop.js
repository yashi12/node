const Product = require('../models/product');
const Cart = require('../models/cart');

const getIndex = (req, res, next) => {
    Product.findAll()
        .then(products=>{
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Index',
                path: '/',
                hasProducts: products.length > 0,
            });
        })
        .catch(err=>{
            console.log("err fetching all products:", err);
        });
};

const getProducts = (req, res, next) => {
    Product.findAll()
        .then(products=>{
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true
            });
        })
        .catch(err=>{
            console.log("err fetching all products:", err);
        });
};

const getProductDetail = (req,res,next)=>{
   const productId = req.params.productId;
   Product.findById(productId)
       .then(([product])=>{
           console.log(product);
           res.render('shop/product-detail',{
               product:product[0],
               path:'/products',
               pageTitle:product[0].title
           })
       })
       .catch(err=>{
           console.log("while fetching detail of item",err);
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
    Product.findById(productId,product=>{
        Cart.addToCart(productId,product.cost);
    })
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
