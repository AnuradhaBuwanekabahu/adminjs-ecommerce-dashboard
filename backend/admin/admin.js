const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Setting = require("../models/Setting");
const bcrypt = require("bcrypt");

// Analytics Relations
Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = async function setupAdmin() {
  const { default: AdminJS, ComponentLoader } = await import("adminjs");
  const AdminJSExpress = await import("@adminjs/express");
  const AdminJSSequelize = await import("@adminjs/sequelize");

  const path = require('path');
  const componentLoader = new ComponentLoader();
  const Components = {
    Dashboard: componentLoader.add('Dashboard', path.join(__dirname, './components/Dashboard'))
  };

  AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
  });

  const adminOnly = {
    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === "admin"
  };

  const adminActions = {
    edit: adminOnly,
    delete: adminOnly,
    new: adminOnly
  };

  const admin = new AdminJS({
    resources: [
      {
        resource: User,
        options: {
          navigation: { name: "Administration", icon: "User" },
          properties: { password: { isVisible: false } },
          isAccessible: adminOnly.isAccessible
        }
      },
      {
        resource: Setting,
        options: {
          navigation: { name: "Administration", icon: "Settings" },
          actions: adminActions,
          isAccessible: adminOnly.isAccessible
        }
      },
      {
        resource: Product,
        options: {
          navigation: { name: "E-Commerce", icon: "Package" },
          actions: adminActions,
          properties: {
            CategoryId: {
              reference: "Categories",
              isVisible: { list: true, filter: true, show: true, edit: true }
            },
            description: {
              type: "richtext"
            }
          }
        }
      },
      {
        resource: Category,
        options: {
          navigation: { name: "E-Commerce", icon: "Folder" },
          actions: adminActions
        }
      },
      {
        resource: Order,
        options: {
          navigation: { name: "E-Commerce", icon: "ShoppingCart" },
          actions: adminActions
        }
      },
      {
        resource: OrderItem,
        options: {
          navigation: { name: "E-Commerce", icon: "List" },
          actions: adminActions
        }
      }
    ],
    branding: {
      companyName: 'Modern E-Commerce',
      withMadeWithAdminJS: false,
    },
    rootPath: "/admin",
    dashboard: {
      component: Components.Dashboard,
      handler: async (request, response, context) => {
        try {
          console.log('[Dashboard Handler] Syncing live data...');
          
          const productCount = await Product.count();
          const categoryCount = await Category.count();
          const orderCount = await Order.count();
          const totalUsers = await User.count();
          const settingCount = await Setting.count();
          
          // Use a safer sum method or default to 0
          const sumResult = await Order.sum('total');
          const totalIncome = sumResult || 0;
          
          console.log(`[Dashboard Handler] Counts - Products: ${productCount}, Orders: ${orderCount}, Income: ${totalIncome}`);

          // --- Robust Best Sellers Aggregation ---
          const allOrderItems = await OrderItem.findAll({
            include: [{ model: Product, attributes: ['name', 'price'] }]
          });

          const salesByProduct = allOrderItems.reduce((acc, item) => {
            const id = item.ProductId;
            if (!acc[id]) {
              acc[id] = { 
                id, 
                name: (item.Product && item.Product.name) ? item.Product.name : `Product #${id}`,
                totalSold: 0,
                price: item.Product ? item.Product.price : 0
              };
            }
            acc[id].totalSold += item.quantity;
            return acc;
          }, {});

          const bestSellers = Object.values(salesByProduct)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5);

          // --- Robust Sales Aggregation (Last 7 Days) ---
          const { Op } = require('sequelize');
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setHours(0, 0, 0, 0);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const recentOrders = await Order.findAll({
            where: {
              createdAt: { [Op.gte]: sevenDaysAgo }
            },
            order: [['createdAt', 'ASC']]
          });

          // Diagnostic: Get the absolute latest order ID in the entire system
          const latestOrder = await Order.findOne({ order: [['createdAt', 'DESC']] });

          const salesByDay = recentOrders.reduce((acc, order) => {
            const day = new Date(order.createdAt).toISOString().split('T')[0];
            if (!acc[day]) {
              acc[day] = { name: day, income: 0, expense: 0 };
            }
            acc[day].income += parseFloat(order.total);
            acc[day].expense += parseFloat(order.total) * 0.4;
            return acc;
          }, {});

          const salesData = Object.values(salesByDay);

          console.log('--- Dashboard Sync Details ---');
          console.log('System Time:', new Date().toLocaleString());
          console.log('Total Orders Found (7d):', recentOrders.length);
          console.log('Latest System Order ID:', latestOrder ? latestOrder.id : 'None');
          console.log('------------------------------');

          const categoryData = (await Category.findAll({ include: Product })).slice(0, 6).map(cat => ({
            subject: cat.name,
            A: cat.Products ? cat.Products.length : 0,
            fullMark: 10
          }));

          return {
            totalIncome,
            productCount,
            categoryCount,
            orderCount,
            totalUsers,
            settingCount,
            bestSellers,
            latestOrderId: latestOrder ? latestOrder.id : 'None',
            categoryData,
            salesData: salesData.length > 0 ? salesData : [{ name: 'No Recent Sales', income: 0, expense: 0 }],
            lastUpdate: new Date().toLocaleTimeString()
          };
        } catch (error) {
          console.error('[Dashboard Handler Error]:', error);
          // Return at least some basic data so UI doesn't break
          return {
            totalIncome: 0,
            productCount: 0,
            orderCount: 0,
            totalUsers: 0,
            bestSellers: [],
            salesData: [{ name: 'Error Loading Data', income: 0, expense: 0 }],
            lastUpdate: 'Error: ' + new Date().toLocaleTimeString()
          };
        }
      }
    },
    componentLoader
  });

  const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ where: { email } });
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return { id: user.id, email: user.email, role: user.role };
      }
      return null;
    },
    cookiePassword: "secure-auth-cookie-password-secret-12345"
  });

  return router;
};
