const products =[];

const getProducts = (req, res, next) => {
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};

const getAddProducts = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

const postAddProducts =  (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/');
};

module.exports= {
    getProducts:getProducts,
    getAddProducts:getAddProducts,
    postAddProducts:postAddProducts
}
