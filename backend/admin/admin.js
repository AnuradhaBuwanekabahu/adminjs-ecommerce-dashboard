const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Setting = require("../models/Setting");
const bcrypt = require("bcrypt");

module.exports = async function setupAdmin() {
  const { default: AdminJS, ComponentLoader } = await import("adminjs");
  const AdminJSExpress = await import("@adminjs/express");
  const AdminJSSequelize = await import("@adminjs/sequelize");

  const componentLoader = new ComponentLoader();
  const Components = {
    Dashboard: componentLoader.add('Dashboard', './components/Dashboard')
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
          actions: adminActions
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
    rootPath: "/admin",
    dashboard: {
      component: Components.Dashboard
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
