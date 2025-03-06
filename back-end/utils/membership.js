const { Order, User } = require('../models');

async function updateUserMembership(userId) {
    try {
        // Fetch all completed orders of the user
        const totalItemsPurchased = await Order.count({
            where: { userId: userId, status: 'Completed' },
        });
        
        //Find membership level
        let newMembershipStatus = 'Bronze';
        if (totalItemsPurchased >= 15) {
            newMembershipStatus = 'Silver';
        }
        if (totalItemsPurchased >= 31) {
            newMembershipStatus = 'Gold';
        }

        // Update user membership
        await User.update(
            { membershipStatus: newMembershipStatus },
            { where: { id: userId } }
        );

        console.log(`Updated user ${userId} to ${newMembershipStatus} membership.`);
    } catch (error) {
        console.error('Error updating user membership:', error);
    }
}

module.exports = { updateUserMembership };