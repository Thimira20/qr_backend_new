// server.js
const express = require("express");
const mongoose = require("mongoose");
const { PORT, MONGO_URI } = require("./config");
const authRoutes = require("./routes/authRoutes");
const userDataRoutes = require("./routes/userDataRoutes");
const profileDataRoutes = require("./routes/profileDataRouets");
const path = require("path");
const cors = require("cors");
const app = express();
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");
//app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3001","http://localhost:3000", "https://qr-code-v2-brown.vercel.app/"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin && [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://qr-code-v2-brown.vercel.app'
      // Add your frontend URL from railway.app if different
  ].includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).end();
});


// const createAdminUser = async () => {
//   try {
//     // Check if any admin exists
//     const adminExists = await User.findOne({ role: "admin" });

//     if (!adminExists) {
      

//       const adminUser = new User({
//         username: "Admin",
//         email: "admin@example.com",
//         password: "1234",
//         role: "super_admin",
//       });

//       await adminUser.save();
//       console.log("✅ Default Admin user created");
//     } else {
//       console.log("⚠️ Admin user already exists, skipping creation");
//     }
//   } catch (error) {
//     console.error("❌ Error creating admin:", error);
//   }
// };
const createAdminUser = async () => {
  try {
    // Check if admin exists using both username and role
    const adminExists = await User.findOne({ 
      $or: [
        { username: "Admin" },
        { role: "super_admin" }
      ]
    });

    if (!adminExists) {
      // Hash the password before saving
      
      const adminUser = new User({
        username: "Admin",
        email: "admin@example.com",
        password: "1234",
        role: "super_admin",
      });

      await adminUser.save();
      console.log("✅ Default Admin user created");
    } else {
      // Check if we need to update the admin's role
      if (adminExists.role !== "super_admin") {
        await User.findByIdAndUpdate(adminExists._id, { role: "super_admin" });
        console.log("✅ Existing admin user role updated to super_admin");
      } else {
        console.log("⚠️ Admin user already exists with correct role");
      }
    }
  } catch (error) {
    if (error.code === 11000) {
      console.log("⚠️ Admin user already exists (duplicate key)");
      // Try to update the existing user's role if needed
      try {
        const existingAdmin = await User.findOne({ username: "Admin" });
        if (existingAdmin && existingAdmin.role !== "super_admin") {
          await User.findByIdAndUpdate(existingAdmin._id, { role: "super_admin" });
          console.log("✅ Existing admin user role updated to super_admin");
        }
      } catch (updateError) {
        console.error("❌ Error updating existing admin:", updateError);
      }
    } else {
      console.error("❌ Error creating admin:", error);
    }
  }
};

mongoose
  .connect(MONGO_URI, {})
  .then(() => {console.log("MongoDB connected");
  createAdminUser();
  })
  .catch((error) => console.log(error));

app.use("/api/auth", authRoutes);
app.use("/api/user-data", userDataRoutes);
app.use("/api/profile-data", profileDataRoutes);
app.get("/", (req, res) => {
  res.json({
      message: "QR Code Backend API",
      status: "running",
      endpoints: {
          auth: "/api/auth",
          userData: "/api/user-data",
          profileData: "/api/profile-data"
      },
      version: "1.0.0"
  });
});



// const reactBuildPath = path.join(__dirname, "../../frontend/qr-code2-main-main/build");

// app.use(express.static(reactBuildPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(reactBuildPath, "index.html"));
// });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
