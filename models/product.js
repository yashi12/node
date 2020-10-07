
const Cart = require('./cart');
const db = require('../util/database');

class Product {

    constructor(id,title,imageUrl,description,cost) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.cost = cost;
    }

    save(){
      return db.execute('INSERT INTO products (title,imageUrl,description,cost) VALUES (?,?,?,?)',
          [this.title,this.imageUrl,this.description,this.cost]);
    }

    static fetchAll(){

        return db.execute('SELECT * FROM products');
    }

    static findById(id){
        // getProductsFromFile(products=>{
        //     const product = products.find(p=> p.id === id);
        //     cb(product);
        // })
    }

    static deleteProduct(id){
        // getProductsFromFile(products=>{
        //     const product = products.find(p=> p.id === id);
        //     const productsList = products.filter(p=> p.id !== id);
        //     console.log("list",productsList);
        //     fs.writeFile(p,JSON.stringify(productsList),(err)=>{
        //         console.log("error",err);
        //         if(!err){
        //             Cart.deleteById(id,product.cost);
        //         }
        //     });
        //     console.log(product.cost);
        //
        // })
    }
}

module.exports = Product;
