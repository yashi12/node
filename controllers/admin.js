const Product = require('../models/product');

const getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false,
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

const getEditProduct = (req, res, next) => {
    console.log("edit mode");
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId,product=>{
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product/',
            editing: editMode,
            product:product
        });
        console.log(product);
    });
};

const getProducts =  (req, res, next) => {
    Product.fetchAll((products)=>{
        res.render('admin/admin-product-list', {
            prods: products,
            pageTitle: 'Edit Product',
            path: '/admin/products',
            hasProducts: products.length > 0,
        });
    });
};

module.exports= {
    getAddProducts:getAddProducts,
    postAddProducts:postAddProducts,
    getEditProduct:getEditProduct,
    getProducts:getProducts
}
