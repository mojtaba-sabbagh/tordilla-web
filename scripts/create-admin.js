// scripts/create-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin exists using username field
    const existingAdmin = await prisma.admin.findFirst({
      where: { 
        username: "admin"  // Using username instead of email
      }
    });
    
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.username);
      console.log("To reset password, delete this admin first");
      return;
    }
    
    // Create new admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prisma.admin.create({
      data: {
        username: "admin",  // username field
        password: hashedPassword,
      },
    });
    
    console.log("Admin created successfully!");
    console.log("Username:", admin.username);
    console.log("Password: admin123");
    console.log("ID:", admin.id);
    
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();