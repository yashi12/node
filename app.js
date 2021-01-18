//inbuilt
const path = require('path');

//third-party
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


// const mongoConnect = require('./util/database').mongoConnect;






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
    User.findById('6005b7488a92211bbc18bfde')
        .then(user=>{
            req.user = user;
            console.log("type of:",typeof user);
            next();
        })
        .catch(err=>{
            console.log(err);
        });
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);




mongoose.connect('mongodb+srv://yashi:abcd1234@shop.c0poi.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result =>{
        User.findOne()
            .then(user =>{
                if(!user){
                    const user = new User({
                        name: 'Yashi',
                        email: 'yashi@gmail.com',
                        cart:{
                            items:[]
                        }
                    });
                    user.save();
                }
            });
        app.listen(3000);
    })
    .catch(err=>{
        console.log("err connecting to mongoose",err);
    });

