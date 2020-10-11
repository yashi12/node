// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'abcd1234'
// });
//
// module.exports = pool.promise(

const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('node-complete','root','abcd1234',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
