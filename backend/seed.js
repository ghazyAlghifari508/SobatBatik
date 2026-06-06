require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Store = require('./src/models/Store');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

mongoose.connect(process.env.MONGO_URI);

const seedDatabase = async () => {
  try {
    await User.deleteMany();
    await Store.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // 1. Create a dummy buyer
    const buyer = await User.create({
      name: 'Pembeli',
      email: 'pembeli@email.com',
      password_hash: '123456',
      role: 'user'
    });

    // 2. Create the store user
    const seller = await User.create({
      name: 'Penjual',
      email: 'penjual@email.com',
      password_hash: '123456',
      role: 'store'
    });

    // 3. Create the admin user
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@email.com',
      password_hash: '123456',
      role: 'admin'
    });

    const store = await Store.create({
      owner_id: seller._id,
      store_name: 'Batik Nusantara',
      description: 'Toko Resmi SobatBatik',
      address: 'Jl. Pemuda No.1',
    });

    // 3. Create products
    const p1 = await Product.create({
      store_id: store._id,
      store_name: store.store_name,
      name: 'Batik Mega Mendung',
      description: 'Batik asli dari Cirebon',
      price: 150000,
      stock: 50,
      category: 'Batik Tulis',
      origin_region: 'Cirebon',
      image_urls: ['/placeholder-batik-1.jpg']
    });

    const p2 = await Product.create({
      store_id: store._id,
      store_name: store.store_name,
      name: 'Batik Parang',
      description: 'Batik parang khas Yogyakarta',
      price: 200000,
      stock: 30,
      category: 'Batik Cap',
      origin_region: 'Yogyakarta',
      image_urls: ['/placeholder-batik-2.jpg']
    });

    // 5. Create an order
    await Order.create({
      user_id: buyer._id,
      user_name: buyer.name,
      shipping_address: 'Jl. Merdeka 45, Jakarta',
      total_price: 350000,
      status: 'Menunggu',
      items: [
        {
          product_id: p1._id,
          store_id: store._id,
          store_name: store.store_name,
          product_name: p1.name,
          quantity: 1,
          price_at_purchase: 150000
        },
        {
          product_id: p2._id,
          store_id: store._id,
          store_name: store.store_name,
          product_name: p2.name,
          quantity: 1,
          price_at_purchase: 200000
        }
      ]
    });

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
