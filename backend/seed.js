const sequelize = require("./config/db");
const Product = require("./models/Product");
const Category = require("./models/Category");

const seedProducts = async () => {
  try {
    await sequelize.sync({ alter: true });

    // Clear existing products and categories to ensure clean seed data
    await Product.destroy({ where: {}, truncate: { cascade: true } });
    await Category.destroy({ where: {}, truncate: { cascade: true } });

    const sampleProducts = [
      {
        name: "Apple iPhone 15 Pro",
        price: 999.00,
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800",
        description: "The first iPhone with an aerospace‑grade titanium design, using the same alloy as spacecraft.",
        categoryName: "Phones"
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        price: 1299.00,
        imageUrl: "https://images.unsplash.com/photo-1707227155609-bde8d10ed88d?q=80&w=800",
        description: "Experience the next level of mobile productivity with AI-driven features and a stunning 200MP camera.",
        categoryName: "Phones"
      },
      {
        name: "MacBook Pro M3 Max",
        price: 3499.00,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800",
        description: "The most advanced chips ever built for a personal computer, delivering extreme performance for pros.",
        categoryName: "Laptops"
      },
      {
        name: "Sony WH-1000XM5",
        price: 399.00,
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800",
        description: "Industry-leading noise cancellation and premium sound quality for an immersive listening experience.",
        categoryName: "Accessories"
      },
      {
        name: "iPad Pro M4",
        price: 1199.00,
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800",
        description: "Supercharged by the M4 chip, the iPad Pro features a breakthrough Tandem OLED display.",
        categoryName: "Tablets"
      },
      {
        name: "Dell XPS 15",
        price: 1899.00,
        imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800",
        description: "Powerful performance meets a thin, refined design with a 15.6-inch InfinityEdge display.",
        categoryName: "Laptops"
      },
      {
        name: "Logitech MX Master 3S",
        price: 99.00,
        imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800",
        description: "An iconic mouse remastered for ultimate precision and tactile feel with Quiet Click technology.",
        categoryName: "Accessories"
      },
      {
        name: "Nintendo Switch OLED",
        price: 349.00,
        imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800",
        description: "Play anytime, anywhere with a vibrant 7-inch OLED screen and enhanced audio in handheld mode.",
        categoryName: "Gaming"
      },
      {
        name: "DJI Mini 4 Pro",
        price: 759.00,
        imageUrl: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=800",
        description: "The most advanced mini-drone to date, featuring omnidirectional obstacle sensing and 4K HDR video.",
        categoryName: "Drones"
      },
      {
        name: "Apple Watch Ultra 2",
        price: 799.00,
        imageUrl: "https://images.unsplash.com/photo-1434493907317-a46b5bc78344?q=80&w=800",
        description: "The most rugged and capable Apple Watch ever, designed for the demands of endurance athletes.",
        categoryName: "Wearables"
      }
    ];

    const categories = [
      "Phones",
      "Laptops",
      "Accessories",
      "Tablets",
      "Gaming",
      "Drones",
      "Wearables"
    ];

    const createdCategories = {};
    for (const categoryName of categories) {
      const category = await Category.create({ name: categoryName });
      createdCategories[categoryName] = category.id;
    }

    for (const prod of sampleProducts) {
      const categoryId = createdCategories[prod.categoryName];
      await Product.create({
        name: prod.name,
        price: prod.price,
        imageUrl: prod.imageUrl,
        description: prod.description,
        CategoryId: categoryId
      });
    }
    
    console.log("Successfully seeded 10 detailed products!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
};

seedProducts();
