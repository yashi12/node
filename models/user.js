const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
    resetToken: String,
    resetTokenExpiry: Date
});

userSchema.methods.addToCart = function (product) {
    if (this.cart) {
        console.log("cart exists");
        cartProductId = this.cart.items.findIndex(prod => {
            return product._id.toString() === prod.productId.toString();
        });
        console.log("prod id", cartProductId);
    }

    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
    if (cartProductId >= 0) {
        newQuantity = this.cart.items[cartProductId].quantity + 1;
        // const cartProducts = this.cart.items[cartProductId].quantity;
        updatedCartItems[cartProductId].quantity = newQuantity;
    } else {
        updatedCartItems.push({productId: product._id, quantity: newQuantity});
        console.log("updated cart", updatedCartItems);
    }

    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteCartProduct = function (productId){
    const updatedCartItems = this.cart.items.filter(item =>{
            return item.productId.toString() !== productId.toString();
        });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function (){
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);


//
// const mongoDb = require('mongodb');
//
// const getDb = require('../util/database').getDb;
// const objectId = mongoDb.ObjectID;
//
//
// class User{
//     constructor(name,email,cart,_id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id =_id;
//     }
//
//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//             .then(result=>{
//                 console.log("user added",result);
//             })
//             .catch(err=>{
//                 console.log("err adding user");
//             })
//     }
//
//     addToCart(product){
//         const db = getDb();
//
//         let cartProductId=-1;
//         // console.log("this add toCart:",this);
//         if(this.cart){
//             console.log("cart exists");
//             cartProductId = this.cart.items.findIndex(prod=>{
//                 return product._id.toString() === prod.productId.toString();
//             });
//             console.log("prod id",cartProductId);
//         }
//
//         let newQuantity =1;
//         let updatedCart;
//         if(cartProductId >= 0){
//             newQuantity = this.cart.items[cartProductId].quantity + 1;
//             // const cartProducts = this.cart.items[cartProductId].quantity;
//             updatedCart =  this.cart;
//             updatedCart.items[cartProductId].quantity = newQuantity;
//         }else {
//             if(this.cart){
//                 updatedCart =this.cart;
//                 updatedCart.items.push({productId:new objectId(product._id),quantity:newQuantity});
//                 console.log("updated cart",updatedCart);
//             }
//             else{
//                 updatedCart ={items:[{productId:new objectId(product._id),quantity:newQuantity}]};
//             }
//         }
//         return db.collection('users').updateOne({_id:new objectId(this._id)},{$set: {cart: updatedCart}});
//     }
//
//     getCart(){
//         const db = getDb();
//         let productIds =[];
//         if(this.cart){
//             productIds = this.cart.items.map(i =>{
//                 return i.productId;
//             })
//         }
//
//         return db.collection('products').find({_id:{$in : productIds}})
//             .toArray()
//             .then(products=>{
//                 return products.map(p =>{
//                     return{
//                         ...p,
//                         quantity: this.cart.items.find(i=>{
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             })
//             .catch(err=>{
//                 console.log("err get cart",err);
//             });
//     }
//
//     deleteCartProduct(productId){
//         const updatedCart = this.cart.items.filter(item =>{
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         return db.collection('users').updateOne({_id:new objectId(this._id)},{$set: {cart:{items:updatedCart} }})
//             .catch(err=>{
//                 console.log("err adding user");
//             });
//     }
//
//     static findUser(userId){
//         const db = getDb();
//         return db.collection('users').findOne({_id:new objectId(userId)})
//             .then(user=>{
//                 console.log("found user",user);
//                 return user;
//             })
//             .catch(err=>{
//                 console.log(err);
//             });
//     }
//
//     addOrder(){
//         const db = getDb();
//         return this.getCart()
//             .then(products =>{
//                 const order = {
//                     items:products,
//                     userId:this._id
//                 };
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(result=>{
//                 this.cart = { items:[]};
//                 return db.collection('users')
//                     .updateOne({_id: new objectId(this._id)},{$set:{cart:{items:[]}}});
//             })
//             .catch(err=>{
//                 console.log("err addOrder",err);
//             });
//     }
//
//     getOrder(){
//         const db =getDb();
//         return db.collection('orders').find({userId: new objectId(this._id)})
//             .toArray();
//     }
// }
//
// module.exports = User;
