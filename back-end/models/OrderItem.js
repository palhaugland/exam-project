const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'OrderItem',
        {
            orderId: DataTypes.INTEGER,
            productId: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            originalPrice: DataTypes.DECIMAL(10, 2),
        },
        { timestamps: true }
    );
};