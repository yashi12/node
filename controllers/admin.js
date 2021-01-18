const Product = require('../models/product');


const getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

const postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const cost = parseFloat(req.body.cost);
    console.log("req.user",req.user);
    // const userId = req.user._id;

    const product = new Product({
        title:title,
        cost:cost,
        description:description,
        imageUrl:imageUrl,
        userId: req.user._id
    });
    product.save()
        .then(result => {
            // console.log(result);
            console.log('Created Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
};

const getEditProduct = (req, res, next) => {
    console.log("edit mode");
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    // Product.findAll({where:{id:productId}})
    Product.findById(productId)
        .then(product=>{
            console.log("prods are:",product);
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product/',
                editing: editMode,
                product: product
            });
        })
        .catch(err=>{
            console.log("err finding given product by admin",err);
        });
    // Product.findById(productId, product => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Edit Product',
    //         path: '/admin/edit-product/',
    //         editing: editMode,
    //         product: product
    //     });
    // });
};

const postEditProduct = (req, res, next) => {
    console.log("post edit");
    const id = req.body.productId;
    console.log("id", id);
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;
    const updatedCost = parseFloat(req.body.cost);

    Product.findById(id)
        .then(product =>{
            product.title = updatedTitle;
            product.cost = updatedCost;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result=>{
            console.log("updated product",result);
            res.redirect('/admin/products');
        })
        .catch(err=>{
            console.log("err while editing product",err);
        })
};

const getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id')
        // .populate('userId','name')
        .then(products => {
            console.log(products)
            res.render('admin/admin-product-list', {
                prods: products,
                pageTitle: 'Edit Product',
                path: '/admin/products',
                hasProducts: products.length > 0,
            });
        })
        .catch(err => {
            console.log("err in fetching admin products", err);
        });

};

const postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(result=>{
            res.redirect('/admin/products');
        })
        .catch(err=>{
            console.log(err);
        })

};

module.exports = {
    getAddProducts: getAddProducts,
    postAddProducts: postAddProducts,
    getEditProduct: getEditProduct,
    postEditProduct: postEditProduct,
    getProducts: getProducts,
    postDeleteProduct: postDeleteProduct
}
