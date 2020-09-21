const fs= require('fs');
const path = require('path');

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

    constructor(title) {
        this.title = title;
    }

    save(){
        let products =[];
        getProductsFromFile((products)=>{
            products.push(this);
            console.log("products",products);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log("err",err);
            })
        });
        // fs.readFile(p,(err,data)=>{
        //     console.log(err,data);
        //     if (!err){
        //         products = JSON.parse(data);
        //         console.log("old products",products);
        //     }
        //     products.push(this);
        //     console.log("products",products);
        //     fs.writeFile(p,JSON.stringify(products),(err)=>{
        //         console.log("err",err);
        //     })
        // })
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
    }
}

module.exports = Product;
