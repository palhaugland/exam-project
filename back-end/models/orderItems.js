const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const orderItem = sequelize.define('OrderItem', {
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    originalPrice: DataTypes.DECIMAL(10, 2),
}, { timestamps: true });

module.exports = orderItem;