const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const role = sequelize.define('Role', {
    name: DataTypes.STRING,
}, { timestamps: false });

module.exports = role;