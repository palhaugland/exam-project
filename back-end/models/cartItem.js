const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'CartItem',
        {
            cartId: DataTypes.INTEGER,
            productId: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
        },
        { timestamps: true }
    );
};