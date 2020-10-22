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
    
    Product.create({
        title: title,
        cost: cost,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id
    }).then(result => {
        console.log("added proct is:", result);
        res.redirect('/');
    }).catch(err => {
        console.log("err while adding product:", err);
    });
};

const getEditProduct = (req, res, next) => {
    console.log("edit mode");
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findAll({where:{id:productId}})
        .then(products=>{
            console.log("prods are:",products[0]);
            if (!products[0]) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product/',
                editing: editMode,
                product: products[0]
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
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const cost = parseFloat(req.body.cost);
    Product.findAll({where:{id:id}})
        .then(product=>{
            console.log("product post req:",product);
            product[0].title = title;
            product[0].cost = cost;
            product[0].description =description;
            product[0].imageUrl =imageUrl;
            return product[0].save();
        })
        .then(result=>{
            console.log("updated product",result);
            res.redirect('/admin/products');
        })
        .catch(err=>{
            console.log("err while editing product",err);
        })
    // const product = new Product(id, title, imageUrl, description, cost);
    // product.save();


};

const getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
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
    // Product.fetchAll((products)=>{
    //     res.render('admin/admin-product-list', {
    //         prods: products,
    //         pageTitle: 'Edit Product',
    //         path: '/admin/products',
    //         hasProducts: products.length > 0,
    //     });
    // });
};

const postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findAll({where:{id:productId}})
        .then(product=>{
            return product[0].destroy();
        })
        .then(result=>{
            res.redirect('/admin/products');
        })
        .catch(err=>{
            console.log(err);
        })
    // Product.deleteProduct(productId);
    // res.redirect('/admin/products');
};

module.exports = {
    getAddProducts: getAddProducts,
    postAddProducts: postAddProducts,
    getEditProduct: getEditProduct,
    postEditProduct: postEditProduct,
    getProducts: getProducts,
    postDeleteProduct: postDeleteProduct
}
