const sequelize = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const createAdmin = async () => {
  try {
    await sequelize.sync({ alter: true });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: "admin@example.com" } });
    
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@example.com");
      console.log("Password: admin123");
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("\nLogin at: http://localhost:5000/admin/login");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
