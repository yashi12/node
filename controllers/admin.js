const Product = require('../models/product');
const { validationResult } = require('express-validator');

const getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

const postAddProducts = (req, res, next) => {
    if(req.session.user) {
        const title = req.body.title;
        const description = req.body.description;
        const imageUrl = req.body.imageUrl;
        const cost = parseFloat(req.body.cost);
        const errors = validationResult(req);
        // console.log("req.user", req.user);
        // const userId = req.user._id;
        if(!errors.isEmpty()){
            return res.status(500).render('admin/edit-product',{
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                hasError: true,
                product: {
                    title: title,
                    imageUrl: imageUrl,
                    cost: cost,
                    description: description
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
        }
        const product = new Product({
            title: title,
            cost: cost,
            description: description,
            imageUrl: imageUrl,
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
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }
    else{
        res.redirect('/login');
    }
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
                product: product,
                isAuthenticated: req.session.isLoggedIn,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err=>{
            console.log("err finding given product by admin",err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
    const updatedCost = parseFloat(req.body.cost.trim());

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                cost: parseFloat(updatedCost),
                description: updatedDescription,
                _id: id
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(id)
        .then(product =>{
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.cost = parseFloat(updatedCost);
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save()
                .then(result=>{
                    console.log("updated product",result);
                    res.redirect('/admin/products');
                })
        })
        .catch(err=>{
            console.log("err while editing product",err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

const getProducts = (req, res, next) => {
    Product.find({userId:req.user._id})
        // .select('title price -_id')
        // .populate('userId','name')
        .then(products => {
            console.log(products)
            res.render('admin/admin-product-list', {
                prods: products,
                pageTitle: 'Edit Product',
                path: '/admin/products',
                hasProducts: products.length > 0,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log("err in fetching admin products", err);
        });

};

const postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteOne({_id:productId,userId: req.user._id})
        .then(result=>{
            res.redirect('/admin/products');
        })
        .catch(err=>{
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
