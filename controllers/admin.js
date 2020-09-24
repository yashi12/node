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
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const cost = req.body.cost;
    const product = new Product( title,imageUrl,description,cost);
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
        });
    });
};

module.exports= {
    getAddProducts:getAddProducts,
    postAddProducts:postAddProducts,
    getProducts:getProducts
}
