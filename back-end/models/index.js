const Sequelize = require('sequelize');
const sequelize = new Sequelize('ecommerce_db', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

// Import models
const userModel = requrire('./user');
const roleModel = require('./role');
const productModel = require('./product');
const categoryModel = require('./category');
const brandModel = require('./brand');
const membershipModel = require('./membership');
const cartModel = require('./cart');
const cartItemModel = require('./cartItem');
const orderModel = require('./order');
const orderItemModel = require('./orderItem');

// Initialize models
const user = userModel(sequelize);
const role = roleModel(sequelize);
const product = productModel(sequelize);
const category = categoryModel(sequelize);
const brand = brandModel(sequelize);
const membership = membershipModel(sequelize);
const cart = cartModel(sequelize);
const cartItem = cartItemModel(sequelize);
const order = orderModel(sequelize);
const orderItem = orderItemModel(sequelize);

// Define relationships
role.hasMany(user, {foreignKey: 'roleId'});
user.belongsTo(role, { foreignKey: 'roleId'});

category.hasMany(product, { foreignKey: 'categoryId'});
product.belongsTo(category, { foreignKey: 'categoryId'});

brand.hasMany(product, { foreignKey: 'brandId'});
product.belongsTo(brand, { foreignKey: 'brandId'});

user.hasOne(cart, { foreignKey: 'userId'});
cart.belongsTo(user, { foreignKey: 'userId'});

cart.hasMany(cartItem, { foreignKey: 'cartId'});
cartItem.belongsTo(cart, { foreignKey: 'cartId'});

product.hasMany(cartItem, { foreignKey: 'productId'});
cartItem.belongsTo(product, {foreignKey: 'productId'});

user.hasMany(order, { foreignKey: 'userId'});
order.belongsTo(user, { foreignKey: 'userId'});

order.hasMany(orderItem, { foreignKey: 'orderId'});
orderItem.belongsTo(order, { foreignKey: 'orderId'});

product.hasMany(orderItem, { foreignKey: 'productId'});
orderItem.belongsTo(product, { foreignKey: 'productId'});

module.exports = {
    sequelize,
    user,
    role,
    product,
    category,
    brand,
    membership,
    cart,
    cartItem,
    order,
    orderItem
};
