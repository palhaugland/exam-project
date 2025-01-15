const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const membership = sequelize.define('Membership', {
    name: DataTypes.STRING,
    minQuantity: DataTypes.INTEGER,
    maxQuantity: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
}, { timestamps: false });

module.exports = membership;
