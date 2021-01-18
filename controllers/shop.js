const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');

const getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Index',
                path: '/',
                hasProducts: products.length > 0,
            });
        })
        .catch(err => {
            console.log("err fetching all products:", err);
        });
};

const getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            console.log("products",products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log("err fetching all products:", err);
        });
};

const getProductDetail = (req, res, next) => {
    // const productId = req.params.;
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            console.log(product);
            res.render('shop/product-detail', {
                product: product,
                path: '/products',
                pageTitle: product.title
            });
        })
        .catch(err => {
            console.log("err while getting product detail", err);
        });

    // Product.findById(productId)
    //     // returns a  single product so no use of product[0], does not return array
    //     .then(product=>{
    //         console.log(product);
    //         res.render('shop/product-detail',{
    //             product:product,
    //             path:'/products',
    //             pageTitle:product.title
    //         })
    //     })
    //     .catch(err=>{
    //         console.log("err while getting product detail",err);
    //     });
};

const getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId','title cost imageUrl')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            console.log("products",products);
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => {
            console.log("err call get cart", err);
        })

};

const postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
        console.log("product add to cart", result);
        res.redirect('/cart');
    }).catch(err => {
        console.log("err add to cart", err);
    });
};

const getOrders = (req, res, next) => {
    Order.find({userId:req.user._id})
        .then(orders=>{
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err=>{
            console.log("err fetch orderes",err);
        });
};

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

const postDeleteCartProduct =  (req, res, next) => {
    const productId = req.body.productId;
    req.user.deleteCartProduct(productId)
        .then(result => {
            console.log("product add to cart", result);
            res.redirect('/cart');
        }).catch(err => {
        console.log("err add to cart", err);
    });
};

const postOrder =  (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i =>{
                return {quantity: i.quantity, product: {...i.productId._doc }};
            });
            const order = new Order({
                userId: req.user._id,
                products:products
            });
            return order.save();
        })
        .then(()=>{
            return req.user.clearCart();
        })
        .then(result => {
            console.log("product add to cart", result);
            res.redirect('/cart');
        }).catch(err => {
        console.log("err add to cart", err);
    });
};

module.exports = {
    getProducts: getProducts,
    getIndex: getIndex,
    getCart: getCart,
    // getCheckout:getCheckout,
    getOrders:getOrders,
    getProductDetail: getProductDetail,
    postCart: postCart,
    postDeleteCartProduct:postDeleteCartProduct,
    postOrder:postOrder
}
