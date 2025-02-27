const { OrderItem, User } = require('../models');

const updateUserMembership = async (userId) => {
    try {
        const totalItemsPurchased = await OrderItem.sum('quantity', {
            include: [{ model: Order, where: { userId } }]
        });

        //Find membership level
        let newMembership = 'Bronze';
        if (totalItemsPurchased >= 15) {
            newMembership = 'Silver';
        }
        if (totalItemsPurchased >= 31) {
            newMembership = 'Gold';
        }

        // Update user membership
        await User.update({ membership: newMembership }, { where: { id: userId } });
        console.log(`Membership updated for user ${userId} to ${newMembership}`);
    } catch (error) {
        console.error('Error updating user membership:', error);
    }
};

module.exports = { updateUserMembership };