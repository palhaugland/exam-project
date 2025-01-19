const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'Membership',
        {
            name: DataTypes.STRING,
            minQuantity: DataTypes.INTEGER,
            maxQuantity: DataTypes.INTEGER,
            discount: DataTypes.INTEGER,
        },
        { timestamps: false }
    );
};