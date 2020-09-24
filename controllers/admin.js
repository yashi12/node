const Product = require('../models/product');

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

const getProducts =  (req, res, next) => {
    Product.fetchAll((products)=>{
        res.render('admin/admin-product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/admin/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

module.exports= {
    getAddProducts:getAddProducts,
    postAddProducts:postAddProducts,
    getProducts:getProducts
}
