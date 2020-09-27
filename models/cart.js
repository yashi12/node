const fs= require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(rootDir,'data','cart.json');

class cart{
    static addToCart(id, productPrice){
        //Fetch previous cart data
        fs.readFile(p,(err,data)=>{
            let cart = { products:[], totalPrice:0};
            if(!err){
                cart = JSON.parse(data);
            }
            //Check if product already exist increase qty
            let existingProductIndex = cart.products.findIndex(product=>product.id === id);
            let existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty += 1;
                cart.products[existingProductIndex]=updatedProduct;
            }
            //otherwise add product to cart
            else{
                updatedProduct = {id:id, qty:1};
                cart.products = [...cart.products,updatedProduct];
            }
            cart.totalPrice += parseInt(productPrice);
            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err);
            });
        });
    };
};

module.exports=cart;
