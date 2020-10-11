const {Sequelize,Model,DataTypes} =require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define("product",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    title: DataTypes.STRING,
    cost:{
        type: DataTypes.DOUBLE,
        notNull: true
    },
    imageUrl:{
      type: DataTypes.STRING,
      notNull:true
    },
    description:{
        type: DataTypes.STRING,
        notNull: true
    }
})

module.exports = Product;
