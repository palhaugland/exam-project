const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const cartItem = sequelize.define('CartItem', {
    cartId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
}, { timestamps: true });

module.exports = cartItem;