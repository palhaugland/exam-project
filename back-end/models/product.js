const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
}, { timestamps: false });

module.exports = Role;

// Product model
// /models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    brandId: DataTypes.INTEGER,
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

module.exports = product;