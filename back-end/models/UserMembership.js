const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserMembership = sequelize.define(
        'UserMembership',
        {
            userId: { 
                type: DataTypes.INTEGER, 
                allowNull: false, 
                references: {
                    model: 'User',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            membershipId: { 
                type: DataTypes.INTEGER, 
                allowNull: false, 
                references: {
                    model: 'Membership',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        },
        { timestamps: false }
    )
    return UserMembership;
};