const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const brand = sequelize.define('Brand', {
    name: DataTypes.STRING,
}, { timestamps: false });

module.exports = brand;
