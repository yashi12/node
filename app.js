//inbuilt
const path = require('path');

//third-party
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


const mongoConnect = require('./util/database').mongoConnect;






//
// //user-made
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const errorController = require('./controllers/error');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findUser('5ff6a7c39157f9789e98533e')
        .then(user=>{
            req.user = new User(user.name,user.email,user.cart,user._id);
            console.log("type of:",typeof user);
            console.log("user is:" ,req.user);
            next();
        })
        .catch(err=>{
            console.log(err);
        });
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);
//
// app.use(errorController.get404);
//
// // associations
// Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product,{through: CartItem});
// Product.belongsToMany(Cart,{through: CartItem});
//
//
//
// // sequelize.sync({force:true})
// sequelize.sync()
//     .then(res=>{
//         return User.findByPk(1)
//     })
//     .then(user=>{
//         if(!user){
//             return User.create({name:'Yashi',email:'abc@gmail.com'})
//         }
//         return User;
//     })
//     .then(user=>{
//         console.log("user*",user);
//         app.listen(3000);
//     })
//     .catch(err=>{
//         console.log(err);
//     })




mongoConnect(()=>{
    app.listen(3000);
});
