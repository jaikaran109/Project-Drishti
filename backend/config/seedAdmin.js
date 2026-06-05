const User = require("../models/User");
const {
  normalizeString,
  normalizePhone,
  normalizeEmail,
} = require("../utils/validators");

const seedAdminUser = async () => {
  const adminNameRaw = process.env.ADMIN_NAME;
  const adminPhoneRaw = process.env.ADMIN_PHONE;
  const adminEmailRaw = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminNameRaw || !adminPhoneRaw || !adminEmailRaw || !adminPassword) {
    return;
  }

  const adminName = normalizeString(adminNameRaw);
  const adminPhone = normalizePhone(adminPhoneRaw);
  const adminEmail = normalizeEmail(adminEmailRaw);

  if (!adminName || adminPhone === null || !adminPhone || adminEmail === null || !adminEmail) {
    throw new Error("ADMIN_PHONE or ADMIN_EMAIL is invalid");
  }

  const existingAdmin = await User.findOne({
    $or: [{ phoneNumber: adminPhone }, { email: adminEmail }],
  });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
    }

    return;
  }

  await User.create({
    fullName: adminName,
    phoneNumber: adminPhone,
    fatherName: "Admin",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  console.log(`Admin user created for ${adminEmail}`);
};

module.exports = seedAdminUser;
