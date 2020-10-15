const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const user = sequelize.define("user",{
    id:{
        notNull:true,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = user;
