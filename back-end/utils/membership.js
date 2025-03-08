const { Order, OrderItem, User, Membership, UserMembership, sequelize } = require('../models');

async function updateUserMembership(userId, req) { 
    try {
        // Fetch total quantity of items purchased
        const totalItemsPurchased = await OrderItem.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalQuantity']
            ],
            include: [{
                model: Order,
                attributes: [], // Don't fetch order fields
                where: { userId: userId, status: 'Completed' }
            }],
            raw: true
        });

        console.log(`SQL Query Result for User ${userId}:`, totalItemsPurchased);

        // Handle if no completed orders are found
        const totalItems = totalItemsPurchased?.totalQuantity || 0;
        console.log(`Total Items Purchased by User ${userId}:`, totalItems);

        // Determine new membership level
        let newMembershipStatus = 'Bronze';
        if (totalItems >= 15) newMembershipStatus = 'Silver';
        if (totalItems >= 31) newMembershipStatus = 'Gold';

        // Find membership ID
        const membership = await Membership.findOne({ where: { name: newMembershipStatus } });
        if (!membership) {
            console.error(`Membership level '${newMembershipStatus}' not found.`);
            return;
        }

        // Ensure only ONE membership per user
        await UserMembership.destroy({ where: { userId } });

        // Assign new membership to the user
        await UserMembership.create({
            userId: userId,
            membershipId: membership.id
        });

        // Update `membershipStatus` in `User` model
        await User.update(
            { membershipStatus: newMembershipStatus },
            { where: { id: userId } }
        );

        // Refresh session
        if (req && req.session) {
            const updatedUser = await User.findByPk(userId, { 
                include: [{ model: Membership, as: "memberships" }]
            });
            req.session.user = updatedUser;
        }

        console.log(`Updated user ${userId} to ${newMembershipStatus} membership.`);
    } catch (error) {
        console.error('Error updating user membership:', error);
    }
}

module.exports = { updateUserMembership };