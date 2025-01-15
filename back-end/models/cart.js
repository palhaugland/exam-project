const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const cart = sequelize.define('Cart', {
    userId: DataTypes.INTEGER,
}, { timestamps: true });

module.exports = cart;
