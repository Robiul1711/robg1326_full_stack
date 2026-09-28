import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://robiulislam1711_db_user:RyVfi88cR5fQMJ1c@betsnipe-db.cwaq5ee.mongodb.net/betsnipe?retryWrites=true&w=majority&appName=BetSnipe-DB";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  status: String,
  isVerified: Boolean,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!");

  const adminEmail = "admin@betsnipe.com";
  const adminPassword = "Admin@betsnipe2026";

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log(`⚠️  Admin user already exists: ${adminEmail}`);
    console.log(`   Role: ${existing.role}`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: "Super Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    status: "active",
    isVerified: true,
  });

  console.log("✅ Admin user created successfully!");
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log("   ⚠️  Change your password after first login!");

  await mongoose.disconnect();
}

seedAdmin().catch(console.error);
