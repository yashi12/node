const fs= require('fs');
const path = require('path');
const uniqid = require('uniqid');

const rootDir = require('../util/path');

const p = path.join(rootDir,'data','products.json');
const getProductsFromFile = cb =>{
    fs.readFile(p,(err,data)=>{
        if(err){
            return cb([]);
        }
        else {
            return cb(JSON.parse(data));
        }
    })
}

class Product {

    constructor(id,title,imageUrl,description,cost) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.cost = cost;
    }

    save(){
        getProductsFromFile((products)=>{
            if(this.id){
                const productIndex= products.findIndex(prod=> prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[productIndex] = this;
                fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
                    console.log("err",err);
                })
            }
            else {
                this.id = uniqid();
                // this.id = Math.random();
                products.push(this);
                console.log("products",products);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    console.log("err",err);
                })
            }
        });
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
    }

    static findById(id, cb){
        getProductsFromFile(products=>{
            const product = products.find(p=> p.id === id);
            cb(product);
        })
    }
}

module.exports = Product;
