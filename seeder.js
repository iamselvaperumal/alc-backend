const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Department = require("./models/Department");
const Employee = require("./models/Employee");
const Project = require("./models/Project");
const Attendance = require("./models/Attendance");
const Payroll = require("./models/Payroll");
const ClientOrder = require("./models/ClientOrder");
const ProductionTask = require("./models/ProductionTask");
const Award = require("./models/Award");
const Enquiry = require("./models/Enquiry");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 MongoDB Connected for Seeding...");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Employee.deleteMany({}),
      Project.deleteMany({}),
      Attendance.deleteMany({}),
      Payroll.deleteMany({}),
      ClientOrder.deleteMany({}),
      ProductionTask.deleteMany({}),
      Award.deleteMany({}),
      Enquiry.deleteMany({}),
    ]);

    // Create Departments
    console.log("📁 Creating departments...");
    const departments = await Department.insertMany([
      {
        name: "Weaving",
        description:
          "Responsible for weaving high-quality fabrics on state-of-the-art looms.",
      },
      {
        name: "Dyeing",
        description:
          "Handles dyeing processes with eco-friendly techniques and vibrant colors.",
      },
      {
        name: "Quality Control",
        description:
          "Ensures product quality through rigorous testing and inspection.",
      },
      {
        name: "Packaging",
        description:
          "Manages secure packaging for domestic and international export.",
      },
      {
        name: "HR & Administration",
        description:
          "Manages human resources, recruitment, and administrative operations.",
      },
      {
        name: "Production Planning",
        description:
          "Coordinates production schedules and resource allocation.",
      },
    ]);
    console.log(`✅ ${departments.length} departments created`);

    // Create Admin User & Profile
    console.log("👤 Creating admin user...");
    const adminUser = await User.create({
      username: "Admin User",
      email: "admin@alc.com",
      password: "password123",
      phone: "+91-9876543210",
      role: "Admin",
    });
    console.log(`✅ Admin created: ${adminUser.email} / password123`);

    // Create Multiple Employees
    console.log("👥 Creating employee users...");
    const employeeUsers = await Promise.all([
      User.create({
        username: "John Doe",
        email: "john@alc.com",
        password: "password123",
        phone: "+91-9876543211",
        role: "Employee",
      }),
      User.create({
        username: "Sarah Johnson",
        email: "sarah@alc.com",
        password: "password123",
        phone: "+91-9876543212",
        role: "Employee",
      }),
      User.create({
        username: "Rajesh Kumar",
        email: "rajesh@alc.com",
        password: "password123",
        phone: "+91-9876543213",
        role: "Employee",
      }),
      User.create({
        username: "Priya Sharma",
        email: "priya@alc.com",
        password: "password123",
        phone: "+91-9876543214",
        role: "Employee",
      }),
      User.create({
        username: "Michael Chen",
        email: "michael@alc.com",
        password: "password123",
        phone: "+91-9876543215",
        role: "Employee",
      }),
    ]);
    console.log(`✅ ${employeeUsers.length} employee users created`);

    // Create Employee Profiles
    console.log("📝 Creating employee profiles...");
    const employees = await Employee.insertMany([
      {
        user: employeeUsers[0]._id,
        department: departments[0]._id,
        designation: "Senior Weaver",
        salary: 25000,
        dateOfJoining: new Date("2020-01-15"),
        dateOfBirth: new Date("1990-05-10"),
        phone: "+91-9876543211",
        address: "Salem, Tamil Nadu",
        panNumber: "ABCDE1234F",
        aadharNumber: "123456789012",
        emergencyContactName: "Mrs. Doe",
        emergencyContactPhone: "+91-9876543220",
      },
      {
        user: employeeUsers[1]._id,
        department: departments[1]._id,
        designation: "Dyeing Technician",
        salary: 20000,
        dateOfJoining: new Date("2021-03-20"),
        dateOfBirth: new Date("1992-08-22"),
        phone: "+91-9876543212",
        address: "Namakkal, Tamil Nadu",
        panNumber: "BCDEF2345G",
        aadharNumber: "234567890123",
        emergencyContactName: "Mr. Johnson",
        emergencyContactPhone: "+91-9876543221",
      },
      {
        user: employeeUsers[2]._id,
        department: departments[2]._id,
        designation: "QC Inspector",
        salary: 18000,
        dateOfJoining: new Date("2021-06-10"),
        dateOfBirth: new Date("1988-12-03"),
        phone: "+91-9876543213",
        address: "Erode, Tamil Nadu",
        panNumber: "CDEFG3456H",
        aadharNumber: "345678901234",
        emergencyContactName: "Mrs. Kumar",
        emergencyContactPhone: "+91-9876543222",
      },
      {
        user: employeeUsers[3]._id,
        department: departments[3]._id,
        designation: "Packaging Supervisor",
        salary: 19000,
        dateOfJoining: new Date("2022-01-05"),
        dateOfBirth: new Date("1991-04-15"),
        phone: "+91-9876543214",
        address: "Krishnagiri, Tamil Nadu",
        panNumber: "DEFGH4567I",
        aadharNumber: "456789012345",
        emergencyContactName: "Mr. Sharma",
        emergencyContactPhone: "+91-9876543223",
      },
      {
        user: employeeUsers[4]._id,
        department: departments[4]._id,
        designation: "HR Manager",
        salary: 30000,
        dateOfJoining: new Date("2019-11-01"),
        dateOfBirth: new Date("1987-09-20"),
        phone: "+91-9876543215",
        address: "Salem, Tamil Nadu",
        panNumber: "EFGHI5678J",
        aadharNumber: "567890123456",
        emergencyContactName: "Mrs. Chen",
        emergencyContactPhone: "+91-9876543224",
      },
    ]);
    console.log(`✅ ${employees.length} employee profiles created`);

    // Create Client Users
    console.log("🏢 Creating client users...");
    const clientUsers = await Promise.all([
      User.create({
        username: "Global Textiles Inc",
        email: "client1@globaltex.com",
        password: "password123",
        phone: "+91-9876543230",
        role: "Client",
      }),
      User.create({
        username: "Fashion House Ltd",
        email: "client2@fashionhouse.com",
        password: "password123",
        phone: "+91-9876543231",
        role: "Client",
      }),
      User.create({
        username: "Premium Fabrics Co",
        email: "client3@premiumfab.com",
        password: "password123",
        phone: "+91-9876543232",
        role: "Client",
      }),
    ]);
    console.log(`✅ ${clientUsers.length} client accounts created`);

    // Create Projects
    console.log("📊 Creating projects...");
    const projects = await Project.insertMany([
      {
        title: "Summer Collection 2024",
        description:
          "Production of summer fabric collection with vibrant colors",
        client: clientUsers[0]._id,
        status: "Ongoing",
        department: departments[0]._id,
        assignedEmployees: [employees[0]._id, employees[1]._id],
        startDate: new Date("2024-01-15"),
        deadline: new Date("2024-06-30"),
        budget: 50000,
        progress: 65,
        priority: "High",
      },
      {
        title: "Monsoon Collection 2024",
        description: "Production of monsoon-resistant fabrics",
        client: clientUsers[1]._id,
        status: "Planned",
        department: departments[1]._id,
        assignedEmployees: [employees[1]._id],
        startDate: new Date("2024-05-01"),
        deadline: new Date("2024-08-31"),
        budget: 75000,
        progress: 0,
        priority: "Medium",
      },
    ]);
    console.log(`✅ ${projects.length} projects created`);

    // Create Attendance Records
    console.log("📅 Creating attendance records...");
    const today = new Date();
    const attendanceRecords = [];
    for (let emp of employees) {
      for (let i = 0; i < 20; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        attendanceRecords.push({
          employee: emp._id,
          date: date,
          checkInTime: new Date(date.setHours(9, 0, 0)),
          checkOutTime: new Date(date.setHours(18, 0, 0)),
          status: Math.random() > 0.1 ? "Present" : "Absent",
          remarks: "Regular working day",
        });
      }
    }
    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ ${attendanceRecords.length} attendance records created`);

    // Create Payroll Records
    console.log("💰 Creating payroll records...");
    const payrollRecords = [];
    const currentYear = new Date().getFullYear();
    for (let emp of employees) {
      for (let month = 1; month <= 12; month++) {
        payrollRecords.push({
          employee: emp._id,
          month: month,
          year: currentYear,
          basicSalary: emp.salary,
          allowances: emp.salary * 0.1,
          deductions: emp.salary * 0.05,
          netSalary: emp.salary + emp.salary * 0.1 - emp.salary * 0.05,
          status: month <= new Date().getMonth() ? "Paid" : "Pending",
          paymentDate:
            month <= new Date().getMonth()
              ? new Date(currentYear, month, 5)
              : null,
        });
      }
    }
    await Payroll.insertMany(payrollRecords);
    console.log(`✅ ${payrollRecords.length} payroll records created`);

    // Create Client Orders
    console.log("📦 Creating client orders...");
    const orders = await ClientOrder.insertMany([
      {
        orderNumber: `ORD-${Date.now()}-001`,
        client: clientUsers[0]._id,
        items: [
          {
            fabricType: "Cotton",
            quantity: 1000,
            color: "Blue",
            specifications: "100% Pure Cotton",
            unitPrice: 150,
            totalPrice: 150000,
          },
          {
            fabricType: "Linen",
            quantity: 500,
            color: "White",
            specifications: "Pure Linen",
            unitPrice: 200,
            totalPrice: 100000,
          },
        ],
        totalAmount: 250000,
        advanceAmount: 125000,
        status: "Order Received",
        priority: "High",
        orderDate: new Date("2024-01-10"),
        deadline: new Date("2024-02-15"),
        deliveryAddress: "Global Textiles Inc, Mumbai",
      },
      {
        orderNumber: `ORD-${Date.now()}-002`,
        client: clientUsers[1]._id,
        items: [
          {
            fabricType: "Polyester Blend",
            quantity: 2000,
            color: "Red",
            specifications: "Polyester Cotton Blend",
            unitPrice: 120,
            totalPrice: 240000,
          },
        ],
        totalAmount: 240000,
        advanceAmount: 80000,
        status: "In Production",
        priority: "Medium",
        orderDate: new Date("2024-01-20"),
        deadline: new Date("2024-03-10"),
        deliveryAddress: "Fashion House Ltd, Delhi",
      },
    ]);
    console.log(`✅ ${orders.length} client orders created`);

    // Create Production Tasks
    console.log("🏭 Creating production tasks...");
    const productionTasks = await ProductionTask.insertMany([
      {
        taskName: "Cotton Fabric Weaving",
        description: "Weave 1000 meters of pure cotton fabric in blue color",
        order: orders[0]._id,
        department: departments[0]._id,
        assignedTo: [employees[0]._id],
        stage: "Weaving",
        status: "In Progress",
        priority: "High",
        startDate: new Date(),
        expectedCompletionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        progress: 45,
        quality: "In Review",
      },
      {
        taskName: "Fabric Dyeing Process",
        description: "Dye polyester blend fabric with red color",
        order: orders[1]._id,
        department: departments[1]._id,
        assignedTo: [employees[1]._id],
        stage: "Dyeing",
        status: "Pending",
        priority: "Medium",
        startDate: new Date(),
        expectedCompletionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        progress: 0,
      },
    ]);
    console.log(`✅ ${productionTasks.length} production tasks created`);

    // Create Awards & Certifications
    console.log("🏆 Creating awards and certifications...");
    const awards = await Award.insertMany([
      {
        title: "ISO 9001:2015 Certification",
        description:
          "International Organization for Standardization - Quality Management",
        awardDate: new Date("2023-06-15"),
        issuingOrganization: "Bureau Veritas",
        category: "ISO",
        displayOrder: 1,
      },
      {
        title: "Export Excellence Award",
        description:
          "Recognition for outstanding export performance in textile sector",
        awardDate: new Date("2023-03-10"),
        issuingOrganization: "Tamil Nadu Chamber of Commerce",
        category: "Award",
        displayOrder: 2,
      },
      {
        title: "Eco-Friendly Manufacturing Certification",
        description:
          "Recognition for sustainable and environmentally friendly practices",
        awardDate: new Date("2023-09-20"),
        issuingOrganization: "Green Industries Association",
        category: "Certification",
        displayOrder: 3,
      },
    ]);
    console.log(`✅ ${awards.length} awards and certifications created`);

    // Create Sample Enquiries
    console.log("📧 Creating sample enquiries...");
    const enquiries = await Enquiry.insertMany([
      {
        name: "Robert Williams",
        email: "robert@example.com",
        subject: "Custom Fabric Order",
        message:
          "Looking for custom design cotton fabrics for our new collection.",
        status: "New",
      },
      {
        name: "Emma Davis",
        email: "emma@example.com",
        subject: "Bulk Order Inquiry",
        message: "Interested in bulk purchase of polyester blended fabrics.",
        status: "Read",
      },
    ]);
    console.log(`✅ ${enquiries.length} enquiries created`);

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("   Admin: admin@alc.com / password123");
    console.log("   Employee: john@alc.com / password123");
    console.log("   Client: client1@globaltex.com / password123");

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
