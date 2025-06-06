require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("../config/config")[process.env.NODE_ENV || "development"];

// Initialize Sequelize
const sequelize = new Sequelize(config);

// Import models
const userModel = require("./User");
const roleModel = require("./Role");
const productModel = require("./Product");
const categoryModel = require("./Category");
const brandModel = require("./Brand");
const membershipModel = require("./Membership");
const cartModel = require("./Cart");
const cartItemModel = require("./CartItem");
const orderModel = require("./Order");
const orderItemModel = require("./OrderItem");
const userMembershipModel = require("./UserMembership");

// Initialize models
const User = userModel(sequelize);
const Role = roleModel(sequelize);
const Category = categoryModel(sequelize);
const Product = productModel(sequelize);
const Brand = brandModel(sequelize);
const Membership = membershipModel(sequelize);
const Cart = cartModel(sequelize);
const CartItem = cartItemModel(sequelize);
const Order = orderModel(sequelize);
const OrderItem = orderItemModel(sequelize);
const UserMembership = userMembershipModel(sequelize);

// Define relationships
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

Brand.hasMany(Product, { foreignKey: "brandId" });
Product.belongsTo(Brand, { foreignKey: "brandId" });

User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(Membership, { through: UserMembership, foreignKey: "userId", as: "memberships" }); 
Membership.belongsToMany(User, { through: UserMembership, foreignKey: "membershipId", as: "users" });

Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

CartItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(CartItem, { foreignKey: "productId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

OrderItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

// Export models and sequelize instance
module.exports = {
    sequelize,
    Sequelize,
    User,
    Role,
    Product,
    Category,
    Brand,
    Membership,
    Cart,
    CartItem,
    Order,
    OrderItem,
    UserMembership,
};