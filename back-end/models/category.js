const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const category = sequelize.define('Category', {
    name: DataTypes.STRING,
}, { timestamps: false });

module.exports = category;