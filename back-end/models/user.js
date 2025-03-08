const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'User',
        {
            firstname: { type: DataTypes.STRING, allowNull: false },
            lastname: { type: DataTypes.STRING, allowNull: false },
            username: { type: DataTypes.STRING, unique: true, allowNull: false },
            email: { type: DataTypes.STRING, unique: true, allowNull: false },
            password: { type: DataTypes.STRING, allowNull: false },
            address: { type: DataTypes.STRING, allowNull: false },
            phone: { type: DataTypes.STRING, allowNull: false },
            roleId: { type: DataTypes.INTEGER, allowNull: false },
            membershipStatus: { type: DataTypes.STRING, defaultValue: 'Bronze' },            
        },
        { timestamps: true }
    );
};

