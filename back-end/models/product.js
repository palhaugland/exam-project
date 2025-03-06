const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'Product',
        {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            price: DataTypes.DECIMAL(10, 2),
            stock: DataTypes.INTEGER,
            categoryId: DataTypes.INTEGER,
            brandId: DataTypes.INTEGER,
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
        },
        { timestamps: true }
    );
};