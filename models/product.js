const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product',productSchema);

// const mongoDb = require('mongodb');
//
// const getDb = require('../util/database').getDb;
//
// const Product = class {
//     constructor(title, cost, description, imageUrl, _id,userId) {
//         this.title = title;
//         this.cost = cost;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = _id ?mongoDb.ObjectID(_id):null;
//         this.userId = userId;
//     }
//
//     save() {
//         const db = getDb();
//         let dbop;
//         if (this._id) {
//             dbop = db.collection('products').updateOne({_id: this._id}, {$set: this});
//         } else {
//             dbop = db.collection('products').insertOne(this);
//         }
//         return dbop
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
//
//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()  /*use toArray() to convert cursor returned by find() to promise()
//                                                              only when num of documents<=100*/
//             .then(result => {
//                 console.log("fetched all");
//                 return result;
//             })
//             .catch(err => {
//                 console.log("err while ftech all")
//             });
//     }
//
//     static fetchProduct(productId) {
//         const db = getDb();
//         return db.collection('products').find({_id: new mongoDb.ObjectID(productId)})
//             .next()
//             .then(product => {
//                 console.log("fetch product");
//                 return product;
//             })
//             .catch(err => {
//                 console.log("err fetch product");
//             });
//     }
//
//     static deleteProduct(productId){
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongoDb.ObjectID(productId)})
//             .then(()=>{
//                 console.log("deletd");
//             })
//             .catch(err=>{
//                 console.log("err in deleteing");
//             });
//     }
// }

// module.exports = Product;
