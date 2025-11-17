/**
 * Seed Script for QuikRide Database
 * Creates sample data for development and testing
 *
 * Usage: node scripts/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const BusOperator = require('../src/models/BusOperator');
const Employee = require('../src/models/Employee');
const Route = require('../src/models/Route');
const Bus = require('../src/models/Bus');
const Trip = require('../src/models/Trip');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quikride', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Sample data
const seedData = async () => {
  try {
    console.log('\n🌱 Starting to seed database...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await BusOperator.deleteMany({});
    await Employee.deleteMany({});
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await Trip.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // ==================== USERS ====================
    console.log('👥 Creating Users...');

    const users = await User.create([
      // Admin
      {
        email: 'admin@quikride.com',
        phone: '0900000000',
        password: 'admin123',
        fullName: 'Quản Trị Viên',
        role: 'admin',
        isEmailVerified: true,
        isPhoneVerified: true,
      },
      // Customers
      {
        email: 'customer1@gmail.com',
        phone: '0912345678',
        password: '123456',
        fullName: 'Nguyễn Văn An',
        role: 'customer',
        isEmailVerified: true,
        isPhoneVerified: true,
        loyaltyTier: 'gold',
        totalPoints: 5500,
      },
      {
        email: 'customer2@gmail.com',
        phone: '0923456789',
        password: '123456',
        fullName: 'Trần Thị Bình',
        role: 'customer',
        isEmailVerified: true,
        isPhoneVerified: true,
        loyaltyTier: 'silver',
        totalPoints: 3200,
      },
      {
        email: 'customer3@gmail.com',
        phone: '0934567890',
        password: '123456',
        fullName: 'Lê Hoàng Cường',
        role: 'customer',
        isEmailVerified: false,
        isPhoneVerified: true,
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // ==================== BUS OPERATORS ====================
    console.log('\n🚌 Creating Bus Operators...');

    const operators = await BusOperator.create([
      {
        companyName: 'Phương Trang (FUTA Bus Lines)',
        email: 'futabus@example.com',
        phone: '0281234567',
        password: 'operator123',
        businessLicense: 'GP-001234567',
        taxCode: '0312345678',
        description: 'Nhà xe uy tín hàng đầu Việt Nam với hơn 20 năm kinh nghiệm vận chuyển hành khách',
        website: 'https://futabus.vn',
        address: {
          street: '272 Đường 3/2',
          ward: 'Phường 12',
          district: 'Quận 10',
          city: 'TP. Hồ Chí Minh',
          country: 'Vietnam',
        },
        bankInfo: {
          bankName: 'Vietcombank',
          accountNumber: '0123456789',
          accountHolder: 'CÔNG TY TNHH PHƯƠNG TRANG',
        },
        verificationStatus: 'approved',
        verifiedAt: new Date(),
        averageRating: 4.5,
        totalReviews: 1250,
        totalTrips: 5420,
        totalRevenue: 45000000000,
        commissionRate: 5,
        isActive: true,
      },
      {
        companyName: 'Thanh Bưởi',
        email: 'thanhbuoi@example.com',
        phone: '0287654321',
        password: 'operator123',
        businessLicense: 'GP-007654321',
        taxCode: '0387654321',
        description: 'Chuyên tuyến Sài Gòn - Vũng Tàu chất lượng cao',
        website: 'https://thanhbuoi.vn',
        address: {
          street: '123 Lê Lợi',
          ward: 'Phường 4',
          district: 'Quận 5',
          city: 'TP. Hồ Chí Minh',
          country: 'Vietnam',
        },
        verificationStatus: 'approved',
        verifiedAt: new Date(),
        averageRating: 4.3,
        totalReviews: 840,
        totalTrips: 3200,
        totalRevenue: 28000000000,
        commissionRate: 5,
        isActive: true,
      },
      {
        companyName: 'Hải Vân',
        email: 'haivan@example.com',
        phone: '0289876543',
        password: 'operator123',
        businessLicense: 'GP-009876543',
        taxCode: '0389876543',
        description: 'Tuyến miền Trung chuyên nghiệp, giá cả hợp lý',
        verificationStatus: 'pending',
        address: {
          street: '456 Trần Hưng Đạo',
          ward: 'Phường 1',
          district: 'Quận 5',
          city: 'TP. Hồ Chí Minh',
          country: 'Vietnam',
        },
        isActive: true,
      },
    ]);

    console.log(`✅ Created ${operators.length} bus operators`);

    // ==================== EMPLOYEES ====================
    console.log('\n👷 Creating Employees...');

    const employees = [];

    // Employees for FUTA (operator 0)
    const futaEmployees = await Employee.create([
      // Trip Managers
      {
        operatorId: operators[0]._id,
        employeeCode: 'TM001',
        fullName: 'Nguyễn Minh Quản',
        phone: '0901111111',
        email: 'tripmanager1@futa.com',
        password: 'tripmanager123',
        role: 'trip_manager',
        status: 'active',
        hireDate: new Date('2020-01-15'),
      },
      {
        operatorId: operators[0]._id,
        employeeCode: 'TM002',
        fullName: 'Trần Văn Hùng',
        phone: '0901111112',
        email: 'tripmanager2@futa.com',
        password: 'tripmanager123',
        role: 'trip_manager',
        status: 'active',
        hireDate: new Date('2021-03-20'),
      },
      // Drivers
      {
        operatorId: operators[0]._id,
        employeeCode: 'DR001',
        fullName: 'Phạm Văn Tài',
        phone: '0902222221',
        email: 'driver1@futa.com',
        password: 'driver123',
        role: 'driver',
        licenseNumber: 'B1234567',
        licenseClass: 'D',
        licenseExpiry: new Date('2026-12-31'),
        status: 'active',
        hireDate: new Date('2019-05-10'),
      },
      {
        operatorId: operators[0]._id,
        employeeCode: 'DR002',
        fullName: 'Lê Minh Phong',
        phone: '0902222222',
        password: 'driver123',
        role: 'driver',
        licenseNumber: 'B2345678',
        licenseClass: 'D',
        licenseExpiry: new Date('2027-06-30'),
        status: 'active',
        hireDate: new Date('2020-08-15'),
      },
    ]);
    employees.push(...futaEmployees);

    // Employees for Thanh Bưởi (operator 1)
    const thanhBuoiEmployees = await Employee.create([
      {
        operatorId: operators[1]._id,
        employeeCode: 'TM001',
        fullName: 'Võ Thị Mai',
        phone: '0903333331',
        email: 'tripmanager@thanhbuoi.com',
        password: 'tripmanager123',
        role: 'trip_manager',
        status: 'active',
        hireDate: new Date('2021-06-01'),
      },
      {
        operatorId: operators[1]._id,
        employeeCode: 'DR001',
        fullName: 'Hoàng Văn Sơn',
        phone: '0904444441',
        password: 'driver123',
        role: 'driver',
        licenseNumber: 'C3456789',
        licenseClass: 'D',
        licenseExpiry: new Date('2026-09-30'),
        status: 'active',
        hireDate: new Date('2020-02-20'),
      },
    ]);
    employees.push(...thanhBuoiEmployees);

    console.log(`✅ Created ${employees.length} employees`);

    // ==================== ROUTES ====================
    console.log('\n🛣️  Creating Routes...');

    const routes = await Route.create([
      {
        operatorId: operators[0]._id,
        routeName: 'Sài Gòn - Đà Lạt',
        routeCode: 'SGN-DLT-001',
        origin: {
          city: 'TP. Hồ Chí Minh',
          province: 'TP. Hồ Chí Minh',
          station: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, Phường 26, Bình Thạnh',
          coordinates: { lat: 10.8142, lng: 106.7107 },
        },
        destination: {
          city: 'Đà Lạt',
          province: 'Lâm Đồng',
          station: 'Bến xe Đà Lạt',
          address: '1 Tô Hiến Thành, Phường 3, Đà Lạt',
          coordinates: { lat: 11.9404, lng: 108.4583 },
        },
        distance: 308,
        estimatedDuration: 420,
        pickupPoints: [
          {
            name: 'Bến xe Miền Đông',
            address: '292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM',
          },
          {
            name: 'VP Phương Trang Q1',
            address: '272 Đường 3/2, Quận 10, TP.HCM',
          },
        ],
        dropoffPoints: [
          {
            name: 'Bến xe Đà Lạt',
            address: '1 Tô Hiến Thành, Phường 3, Đà Lạt',
          },
          {
            name: 'Chợ Đà Lạt',
            address: 'Nguyễn Thị Minh Khai, Phường 1, Đà Lạt',
          },
        ],
        status: 'active',
      },
      {
        operatorId: operators[0]._id,
        routeName: 'Sài Gòn - Nha Trang',
        routeCode: 'SGN-NTR-001',
        origin: {
          city: 'TP. Hồ Chí Minh',
          province: 'TP. Hồ Chí Minh',
          station: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, Phường 26, Bình Thạnh',
          coordinates: { lat: 10.8142, lng: 106.7107 },
        },
        destination: {
          city: 'Nha Trang',
          province: 'Khánh Hòa',
          station: 'Bến xe Nha Trang',
          address: '23 Tháng 10, Phường Phước Long, Nha Trang',
          coordinates: { lat: 12.2388, lng: 109.1967 },
        },
        distance: 450,
        estimatedDuration: 540,
        pickupPoints: [
          {
            name: 'Bến xe Miền Đông',
            address: '292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM',
          },
        ],
        dropoffPoints: [
          {
            name: 'Bến xe Nha Trang',
            address: '23 Tháng 10, Phước Long, Nha Trang',
          },
        ],
        status: 'active',
      },
      {
        operatorId: operators[1]._id,
        routeName: 'Sài Gòn - Vũng Tàu',
        routeCode: 'SGN-VT-001',
        origin: {
          city: 'TP. Hồ Chí Minh',
          province: 'TP. Hồ Chí Minh',
          station: 'Bến xe Miền Đông',
          address: '292 Đinh Bộ Lĩnh, Phường 26, Bình Thạnh',
          coordinates: { lat: 10.8142, lng: 106.7107 },
        },
        destination: {
          city: 'Vũng Tàu',
          province: 'Bà Rịa - Vũng Tàu',
          station: 'Bến xe Vũng Tàu',
          address: '192 Nam Kỳ Khởi Nghĩa, Phường 7, Vũng Tàu',
          coordinates: { lat: 10.3459, lng: 107.0843 },
        },
        distance: 125,
        estimatedDuration: 120,
        pickupPoints: [
          {
            name: 'Bến xe Miền Đông',
            address: '292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM',
          },
          {
            name: 'VP Thanh Bưởi Q5',
            address: '123 Lê Lợi, Quận 5, TP.HCM',
          },
        ],
        dropoffPoints: [
          {
            name: 'Bến xe Vũng Tàu',
            address: '192 Nam Kỳ Khởi Nghĩa, Phường 7, Vũng Tàu',
          },
          {
            name: 'Bãi Sau',
            address: 'Thùy Vân, Phường Thắng Tam, Vũng Tàu',
          },
        ],
        status: 'active',
      },
    ]);

    console.log(`✅ Created ${routes.length} routes`);

    // ==================== BUSES ====================
    console.log('\n🚐 Creating Buses...');

    const buses = await Bus.create([
      // FUTA buses
      {
        operatorId: operators[0]._id,
        busNumber: '51B-12345',
        busType: 'limousine',
        seatLayout: {
          floors: 1,
          rows: 6,
          columns: 3,
          layout: [
            ['A1', 'A2', 'A3'],
            ['B1', 'B2', 'B3'],
            ['C1', 'C2', 'C3'],
            ['D1', 'D2', 'D3'],
            ['E1', 'E2', 'E3'],
            ['F1', 'F2', 'F3'],
          ],
          totalSeats: 18,
        },
        amenities: ['wifi', 'ac', 'blanket', 'water', 'charging'],
        model: 'Mercedes-Benz Sprinter',
        registrationExpiry: new Date('2026-12-31'),
        insuranceExpiry: new Date('2025-12-31'),
        lastMaintenanceDate: new Date('2024-10-01'),
        status: 'active',
      },
      {
        operatorId: operators[0]._id,
        busNumber: '51B-67890',
        busType: 'sleeper',
        seatLayout: {
          floors: 2,
          rows: 8,
          columns: 3,
          layout: [
            ['1A', '1B', '1C'],
            ['2A', '2B', '2C'],
            ['3A', '3B', '3C'],
            ['4A', '4B', '4C'],
            ['5A', '5B', '5C'],
            ['6A', '6B', '6C'],
            ['7A', '7B', '7C'],
            ['8A', '8B', '8C'],
          ],
          totalSeats: 40,
        },
        amenities: ['wifi', 'ac', 'blanket', 'pillow', 'water', 'charging', 'tv'],
        model: 'Thaco Universe',
        registrationExpiry: new Date('2027-06-30'),
        insuranceExpiry: new Date('2025-12-31'),
        lastMaintenanceDate: new Date('2024-09-15'),
        status: 'active',
      },
      // Thanh Bưởi buses
      {
        operatorId: operators[1]._id,
        busNumber: '51G-11111',
        busType: 'seater',
        seatLayout: {
          floors: 1,
          rows: 11,
          columns: 4,
          layout: [
            ['A1', 'A2', '', 'A3'],
            ['B1', 'B2', '', 'B3'],
            ['C1', 'C2', '', 'C3'],
            ['D1', 'D2', '', 'D3'],
            ['E1', 'E2', '', 'E3'],
            ['F1', 'F2', '', 'F3'],
            ['G1', 'G2', '', 'G3'],
            ['H1', 'H2', '', 'H3'],
            ['I1', 'I2', '', 'I3'],
            ['J1', 'J2', '', 'J3'],
            ['K1', 'K2', 'K3', 'K4'],
          ],
          totalSeats: 34,
        },
        amenities: ['ac', 'water'],
        model: 'Hyundai Universe',
        registrationExpiry: new Date('2026-08-31'),
        insuranceExpiry: new Date('2025-12-31'),
        lastMaintenanceDate: new Date('2024-11-01'),
        status: 'active',
      },
    ]);

    console.log(`✅ Created ${buses.length} buses`);

    // ==================== TRIPS ====================
    console.log('\n🚌 Creating Trips...');

    // Helper function to create date for trips
    const createTripDate = (daysFromNow, hours, minutes) => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const trips = await Trip.create([
      // FUTA - Sài Gòn Đà Lạt (Today - Tomorrow)
      {
        operatorId: operators[0]._id,
        routeId: routes[0]._id,
        busId: buses[0]._id, // Limousine
        driverId: futaEmployees[2]._id, // Driver 1
        tripManagerId: futaEmployees[0]._id, // Trip Manager 1
        departureTime: createTripDate(0, 6, 0), // Today 6:00 AM
        arrivalTime: createTripDate(0, 13, 0), // Today 1:00 PM
        basePrice: 250000,
        status: 'scheduled',
        availableSeats: 18,
        bookedSeats: 0,
      },
      {
        operatorId: operators[0]._id,
        routeId: routes[0]._id,
        busId: buses[1]._id, // Sleeper
        driverId: futaEmployees[3]._id, // Driver 2
        tripManagerId: futaEmployees[1]._id, // Trip Manager 2
        departureTime: createTripDate(0, 22, 0), // Today 10:00 PM
        arrivalTime: createTripDate(1, 5, 0), // Tomorrow 5:00 AM
        basePrice: 300000,
        status: 'scheduled',
        availableSeats: 40,
        bookedSeats: 0,
      },
      {
        operatorId: operators[0]._id,
        routeId: routes[0]._id,
        busId: buses[0]._id,
        driverId: futaEmployees[2]._id,
        tripManagerId: futaEmployees[0]._id,
        departureTime: createTripDate(1, 6, 0), // Tomorrow 6:00 AM
        arrivalTime: createTripDate(1, 13, 0), // Tomorrow 1:00 PM
        basePrice: 250000,
        status: 'scheduled',
        availableSeats: 18,
        bookedSeats: 0,
      },

      // FUTA - Sài Gòn Nha Trang
      {
        operatorId: operators[0]._id,
        routeId: routes[1]._id,
        busId: buses[1]._id,
        driverId: futaEmployees[3]._id,
        tripManagerId: futaEmployees[1]._id,
        departureTime: createTripDate(0, 20, 0), // Today 8:00 PM
        arrivalTime: createTripDate(1, 5, 0), // Tomorrow 5:00 AM
        basePrice: 350000,
        status: 'scheduled',
        availableSeats: 40,
        bookedSeats: 0,
      },
      {
        operatorId: operators[0]._id,
        routeId: routes[1]._id,
        busId: buses[1]._id,
        driverId: futaEmployees[2]._id,
        tripManagerId: futaEmployees[0]._id,
        departureTime: createTripDate(2, 20, 0), // Day after tomorrow 8:00 PM
        arrivalTime: createTripDate(3, 5, 0),
        basePrice: 350000,
        status: 'scheduled',
        availableSeats: 40,
        bookedSeats: 0,
      },

      // Thanh Bưởi - Sài Gòn Vũng Tàu
      {
        operatorId: operators[1]._id,
        routeId: routes[2]._id,
        busId: buses[2]._id,
        driverId: thanhBuoiEmployees[1]._id,
        tripManagerId: thanhBuoiEmployees[0]._id,
        departureTime: createTripDate(0, 7, 0), // Today 7:00 AM
        arrivalTime: createTripDate(0, 9, 0), // Today 9:00 AM
        basePrice: 120000,
        status: 'scheduled',
        availableSeats: 34,
        bookedSeats: 0,
      },
      {
        operatorId: operators[1]._id,
        routeId: routes[2]._id,
        busId: buses[2]._id,
        driverId: thanhBuoiEmployees[1]._id,
        tripManagerId: thanhBuoiEmployees[0]._id,
        departureTime: createTripDate(0, 14, 0), // Today 2:00 PM
        arrivalTime: createTripDate(0, 16, 0), // Today 4:00 PM
        basePrice: 120000,
        status: 'scheduled',
        availableSeats: 34,
        bookedSeats: 0,
      },
      {
        operatorId: operators[1]._id,
        routeId: routes[2]._id,
        busId: buses[2]._id,
        driverId: thanhBuoiEmployees[1]._id,
        tripManagerId: thanhBuoiEmployees[0]._id,
        departureTime: createTripDate(1, 7, 0), // Tomorrow 7:00 AM
        arrivalTime: createTripDate(1, 9, 0), // Tomorrow 9:00 AM
        basePrice: 120000,
        status: 'scheduled',
        availableSeats: 34,
        bookedSeats: 0,
      },
      {
        operatorId: operators[1]._id,
        routeId: routes[2]._id,
        busId: buses[2]._id,
        driverId: thanhBuoiEmployees[1]._id,
        tripManagerId: thanhBuoiEmployees[0]._id,
        departureTime: createTripDate(1, 14, 0), // Tomorrow 2:00 PM
        arrivalTime: createTripDate(1, 16, 0), // Tomorrow 4:00 PM
        basePrice: 120000,
        status: 'scheduled',
        availableSeats: 34,
        bookedSeats: 0,
      },
    ]);

    console.log(`✅ Created ${trips.length} trips`);

    console.log('\n✅ Seed completed successfully!\n');

    // Print summary
    console.log('📊 SUMMARY:');
    console.log('═'.repeat(50));
    console.log(`Users: ${users.length}`);
    console.log(`  - Admin: 1`);
    console.log(`  - Customers: ${users.length - 1}`);
    console.log(`\nBus Operators: ${operators.length}`);
    console.log(`  - Approved: ${operators.filter(o => o.verificationStatus === 'approved').length}`);
    console.log(`  - Pending: ${operators.filter(o => o.verificationStatus === 'pending').length}`);
    console.log(`\nEmployees: ${employees.length}`);
    console.log(`  - Trip Managers: ${employees.filter(e => e.role === 'trip_manager').length}`);
    console.log(`  - Drivers: ${employees.filter(e => e.role === 'driver').length}`);
    console.log(`\nRoutes: ${routes.length}`);
    console.log(`Buses: ${buses.length}`);
    console.log(`Trips: ${trips.length}`);
    console.log(`  - Today: ${trips.filter(t => {
      const today = new Date();
      return t.departureTime.toDateString() === today.toDateString();
    }).length}`);
    console.log(`  - Upcoming: ${trips.filter(t => t.departureTime > new Date()).length}`);
    console.log('═'.repeat(50));

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('\n🎉 All done! You can now use the application.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedData, connectDB };
