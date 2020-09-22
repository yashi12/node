const Product = require('../models/product');

const getProducts = (req, res, next) => {
     Product.fetchAll((products)=>{
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

const getAddProducts = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

const postAddProducts =  (req, res, next) => {
    const product = new Product( req.body.title);
    product.save();
    // products.push({ title: req.body.title });
    res.redirect('/');
};

module.exports= {
    getProducts:getProducts,
    getAddProducts:getAddProducts,
    postAddProducts:postAddProducts
}
