const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'Order',
        {
            userId: DataTypes.INTEGER,
            orderNumber: { type: DataTypes.STRING, unique: true },
            status: { type: DataTypes.STRING, defaultValue: 'In Progress' },
            membership: DataTypes.STRING,
        },
        { timestamps: true }
    );
};