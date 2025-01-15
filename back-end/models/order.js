const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const order = sequelize.define('Order', {
    userId: DataTypes.INTEGER,
    orderNumber: { type: DataTypes.STRING, unique: true },
    status: { type: DataTypes.STRING, defaultValue: 'In Progress' },
    membership: DataTypes.STRING,
}, { timestamps: true });

module.exports = order;