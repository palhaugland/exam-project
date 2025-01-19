const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'Cart',
        {
            userId: DataTypes.INTEGER,
        },
        { timestamps: true }
    );
};