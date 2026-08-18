require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB, sequelize } = require('./src/config/db');
const { Employee, Task, User } = require('./src/models');

const seedDatabase = async () => {
  try {
    await connectDB();

    try {
      await sequelize.query('TRUNCATE TABLE tasks, employees, users RESTART IDENTITY CASCADE');
    } catch (error) {
      console.error(
        '\x1b[31mCould not truncate tables — have migrations been run yet? Try `npm run migrate` first.\x1b[0m'
      );
      throw error;
    }
    console.log('Cleared existing data');

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@company.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({ email: adminEmail, password: passwordHash });
    console.log('Created admin user');

    // Create employees
    const employees = await Employee.bulkCreate([
      { name: 'Alice Johnson', role: 'Frontend Developer', email: 'alice@company.com' },
      { name: 'Bob Smith', role: 'Backend Developer', email: 'bob@company.com' },
      { name: 'Carol Williams', role: 'UI/UX Designer', email: 'carol@company.com' },
      { name: 'David Brown', role: 'Full Stack Developer', email: 'david@company.com' },
    ]);
    console.log(`Created ${employees.length} employees`);

    // Create tasks
    const tasks = await Task.bulkCreate([
      {
        title: 'Build login page',
        description: 'Create responsive login form with validation',
        status: 'Completed',
        priority: 'High',
        employeeId: employees[0].id,
      },
      {
        title: 'Implement dashboard',
        description: 'Build main dashboard with statistics',
        status: 'In Progress',
        priority: 'High',
        employeeId: employees[0].id,
      },
      {
        title: 'API integration',
        description: 'Integrate third-party payment API',
        status: 'Pending',
        priority: 'Medium',
        employeeId: employees[1].id,
      },
      {
        title: 'Database optimization',
        description: 'Optimize database queries and indexes',
        status: 'In Progress',
        priority: 'High',
        employeeId: employees[1].id,
      },
      {
        title: 'Design landing page',
        description: 'Create modern landing page design',
        status: 'Completed',
        priority: 'Medium',
        employeeId: employees[2].id,
      },
      {
        title: 'Create wireframes',
        description: 'Design wireframes for mobile app',
        status: 'Pending',
        priority: 'Low',
        employeeId: employees[2].id,
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated deployment pipeline',
        status: 'Pending',
        priority: 'Medium',
        employeeId: employees[3].id,
      },
      {
        title: 'Code review',
        description: 'Review pull requests and provide feedback',
        status: 'In Progress',
        priority: 'Medium',
        employeeId: employees[3].id,
      },
    ]);
    console.log(`Created ${tasks.length} tasks`);

    console.log('\x1b[32m%s\x1b[0m', '\n✓ Database seeded successfully!');
    console.log('\nTest credentials for authentication:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Error seeding database: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
