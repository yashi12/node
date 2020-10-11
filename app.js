//inbuilt
const path = require('path');

//third-party
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

//user-made
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

// db.execute('Select * from products')
//     .then(result=>{
//         console.log(result[0]);
//         // console.log(result[1]);
//     })
//     .catch(err=>{
//         console.log(err);
//     });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
    .then(res=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    })
