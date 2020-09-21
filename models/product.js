// const products =[];
const fs= require('fs');
const path = require('path');

const rootDir = require('../util/path');

class Product {

    constructor(title) {
        this.title = title;
    }

    save(){
        const p = path.join(rootDir,'data','products.json');
        let products =[];
        fs.readFile(p,(err,data)=>{
            console.log(err,data);
            if (!err){
                products = JSON.parse(data);
                console.log("old products",products);
            }
            products.push(this);
            console.log("products",products);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log("err",err);
            })
        })
        // products.push(this);
    }

    static fetchAll(cb){
        const p = path.join(rootDir,'data','products.json');
        fs.readFile(p,(err,data)=>{
            if(err){
                cb([]);
            }
            cb(JSON.parse(data));
        })
        // return products;
    }
}

module.exports = Product;
