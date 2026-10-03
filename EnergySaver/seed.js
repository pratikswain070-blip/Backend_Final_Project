const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Home = require('./models/Home');
const Device = require('./models/Device');
const Reading = require('./models/Reading');
const Limit = require('./models/Limit');
const Alert = require('./models/Alert');
const Tip = require('./models/Tip');
const DeviceTemplate = require('./models/DeviceTemplate');

const connectDB = require('./config/db');

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding...');

    // Clear all existing data
    await User.deleteMany({});
    await Home.deleteMany({});
    await Device.deleteMany({});
    await Reading.deleteMany({});
    await Limit.deleteMany({});
    await Alert.deleteMany({});
    await Tip.deleteMany({});
    await DeviceTemplate.deleteMany({});
    console.log('Cleared existing data.');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Users
    const user1 = await User.create({
      name: 'Pratik Swain',
      email: 'pratik@example.com',
      password: hashedPassword,
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      password: hashedPassword,
      role: 'user',
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Users created: 2 users + 1 admin');

    // Create Homes
    const home1 = await Home.create({
      user: user1._id,
      name: 'Pratik Home',
      address: '123 Main Street',
      city: 'Bhubaneswar',
      neighborhood: 'Saheed Nagar',
    });

    const home2 = await Home.create({
      user: user2._id,
      name: 'Rahul Home',
      address: '456 Park Avenue',
      city: 'Bhubaneswar',
      neighborhood: 'Saheed Nagar',
    });

    const home3 = await Home.create({
      user: user1._id,
      name: 'Pratik Office',
      address: '789 Tech Park',
      city: 'Bhubaneswar',
      neighborhood: 'Patia',
    });

    console.log('Homes created: 3');

    // Create Devices
    const devices = await Device.insertMany([
      { home: home1._id, name: 'Living Room AC', type: 'AC', brand: 'Daikin', powerRating: 1500, status: 'on' },
      { home: home1._id, name: 'Bedroom Fan', type: 'Fan', brand: 'Havells', powerRating: 75, status: 'on' },
      { home: home1._id, name: 'Kitchen Refrigerator', type: 'Refrigerator', brand: 'Samsung', powerRating: 200, status: 'on' },
      { home: home1._id, name: 'Hall TV', type: 'TV', brand: 'LG', powerRating: 120, status: 'off' },
      { home: home1._id, name: 'Bedroom Light', type: 'Light', brand: 'Philips', powerRating: 15, status: 'on' },
      { home: home2._id, name: 'Room AC', type: 'AC', brand: 'Voltas', powerRating: 1400, status: 'on' },
      { home: home2._id, name: 'Washing Machine', type: 'Washing Machine', brand: 'IFB', powerRating: 500, status: 'off' },
      { home: home2._id, name: 'Room Heater', type: 'Heater', brand: 'Bajaj', powerRating: 2000, status: 'off' },
      { home: home3._id, name: 'Office AC', type: 'AC', brand: 'Blue Star', powerRating: 1800, status: 'on' },
      { home: home3._id, name: 'Office Light', type: 'Light', brand: 'Syska', powerRating: 20, status: 'on' },
    ]);

    console.log('Devices created:', devices.length);

    // Create Readings (current month)
    const now = new Date();
    const readings = [];

    // Generate daily readings for the current month
    for (let day = 1; day <= Math.min(now.getDate(), 27); day++) {
      const date = new Date(now.getFullYear(), now.getMonth(), day, 10, 0, 0);

      // Readings for home1 devices
      readings.push(
        { device: devices[0]._id, energyConsumed: 8 + Math.random() * 4, voltage: 230, current: 6.5, timestamp: date },
        { device: devices[1]._id, energyConsumed: 0.5 + Math.random() * 0.3, voltage: 230, current: 0.3, timestamp: date },
        { device: devices[2]._id, energyConsumed: 1.5 + Math.random() * 0.5, voltage: 230, current: 0.9, timestamp: date },
        { device: devices[3]._id, energyConsumed: 1 + Math.random() * 0.5, voltage: 230, current: 0.5, timestamp: date },
        { device: devices[4]._id, energyConsumed: 0.2 + Math.random() * 0.1, voltage: 230, current: 0.07, timestamp: date }
      );

      // Readings for home2 devices
      readings.push(
        { device: devices[5]._id, energyConsumed: 9 + Math.random() * 3, voltage: 230, current: 6, timestamp: date },
        { device: devices[6]._id, energyConsumed: 1 + Math.random() * 0.5, voltage: 230, current: 2.2, timestamp: date }
      );

      // Readings for home3 devices
      readings.push(
        { device: devices[8]._id, energyConsumed: 10 + Math.random() * 5, voltage: 230, current: 7.8, timestamp: date },
        { device: devices[9]._id, energyConsumed: 0.3 + Math.random() * 0.1, voltage: 230, current: 0.09, timestamp: date }
      );
    }

    // Also add some previous month readings for comparison
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    for (let day = 1; day <= 28; day++) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day, 10, 0, 0);
      readings.push(
        { device: devices[0]._id, energyConsumed: 10 + Math.random() * 5, voltage: 230, current: 6.5, timestamp: date },
        { device: devices[1]._id, energyConsumed: 0.6 + Math.random() * 0.3, voltage: 230, current: 0.3, timestamp: date },
        { device: devices[2]._id, energyConsumed: 2 + Math.random() * 1, voltage: 230, current: 0.9, timestamp: date }
      );
    }

    await Reading.insertMany(readings);
    console.log('Readings created:', readings.length);

    // Create Limits
    const limits = await Limit.insertMany([
      {
        user: user1._id,
        home: home1._id,
        device: null,
        limitType: 'monthly',
        limitValue: 300,
        currentUsage: 0,
        alertPercentage: 90,
        active: true,
      },
      {
        user: user1._id,
        home: home1._id,
        device: devices[0]._id,
        limitType: 'daily',
        limitValue: 15,
        currentUsage: 0,
        alertPercentage: 80,
        active: true,
      },
      {
        user: user2._id,
        home: home2._id,
        device: null,
        limitType: 'monthly',
        limitValue: 350,
        currentUsage: 0,
        alertPercentage: 90,
        active: true,
      },
    ]);

    console.log('Limits created:', limits.length);

    // Create sample Alerts
    const alerts = await Alert.insertMany([
      {
        user: user1._id,
        device: devices[0]._id,
        home: home1._id,
        message: 'Warning: You have used 90% of your monthly energy limit.',
        percentageUsed: 90,
        type: 'warning',
      },
      {
        user: user1._id,
        device: null,
        home: home1._id,
        message: 'Alert: Your monthly energy limit has been EXCEEDED!',
        percentageUsed: 105,
        type: 'exceeded',
      },
    ]);

    console.log('Alerts created:', alerts.length);

    // Create Tips
    const tips = await Tip.insertMany([
      {
        title: 'Set AC temperature to 24°C',
        description: 'Setting your AC to 24°C instead of 18°C can save up to 25% of cooling energy.',
        category: 'cooling',
        createdBy: admin._id,
      },
      {
        title: 'Switch off lights when leaving',
        description: 'Always switch off lights when you leave a room. This simple habit can reduce lighting costs by 10-15%.',
        category: 'lighting',
        createdBy: admin._id,
      },
      {
        title: 'Avoid standby mode',
        description: 'Appliances on standby mode still consume 5-10% of their operating power. Unplug them when not in use.',
        category: 'general',
        createdBy: admin._id,
      },
      {
        title: 'Use energy-efficient appliances',
        description: 'Replace old appliances with BEE 5-star rated ones. They consume 30-50% less energy.',
        category: 'appliances',
        createdBy: admin._id,
      },
      {
        title: 'Use natural light during daytime',
        description: 'Open curtains and use natural sunlight during the day to reduce artificial lighting needs.',
        category: 'lighting',
        createdBy: admin._id,
      },
      {
        title: 'Clean AC filters regularly',
        description: 'Dirty filters make the AC work harder. Clean them monthly to improve efficiency by 5-15%.',
        category: 'cooling',
        createdBy: admin._id,
      },
    ]);

    console.log('Tips created:', tips.length);

    // Create Device Templates
    const templates = await DeviceTemplate.insertMany([
      { name: 'Air Conditioner', type: 'AC', defaultPowerRating: 1500, description: 'Standard 1.5 ton split AC' },
      { name: 'Ceiling Fan', type: 'Fan', defaultPowerRating: 75, description: 'Standard ceiling fan' },
      { name: 'Refrigerator', type: 'Refrigerator', defaultPowerRating: 200, description: 'Double door frost-free refrigerator' },
      { name: 'Washing Machine', type: 'Washing Machine', defaultPowerRating: 500, description: 'Front-loading washing machine' },
      { name: 'LED TV', type: 'TV', defaultPowerRating: 120, description: '43-inch LED smart TV' },
      { name: 'LED Bulb', type: 'Light', defaultPowerRating: 15, description: '15W LED bulb' },
      { name: 'Room Heater', type: 'Heater', defaultPowerRating: 2000, description: 'Oil-filled room heater' },
    ]);

    console.log('Device Templates created:', templates.length);

    console.log('\n========================================');
    console.log('  Database seeded successfully!');
    console.log('========================================');
    console.log('\nTest Accounts:');
    console.log('  User:  pratik@example.com / password123');
    console.log('  User:  rahul@example.com  / password123');
    console.log('  Admin: admin@example.com  / password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
