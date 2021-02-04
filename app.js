//inbuilt
const path = require('path');

//third-party
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@shop.c0poi.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const store = new mongodbStore({
    uri: URI,
    collation: 'sessions'
});
const csrfProtection = csrf();

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


// const mongoConnect = require('./util/database').mongoConnect;


//
// //user-made
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const loginRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');

const Stream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
app.use(helmet({
    contentSecurityPolicy: false,
}));
// app.use(compression());
// app.use(morgan('combined',{stream:Stream}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            if (!user) {
                return next();
            }
            req.user = user;
            console.log("type of:",typeof user);
            next();
        })
        .catch(err=>{
            next(new Error(err));
        });
});
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.use(errorController.get404);
app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose.connect(URI)
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Yashi',
                        email: 'yashi@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log("err connecting to mongoose", err);
    });

