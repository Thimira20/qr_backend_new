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
    origin: ["http://localhost:3001", "https://qr-code-v2-brown.vercel.app/"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

const createAdminUser = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      

      const adminUser = new User({
        username: "Admin",
        email: "admin@example.com",
        password: "1234",
        role: "super_admin",
      });

      await adminUser.save();
      console.log("✅ Default Admin user created");
    } else {
      console.log("⚠️ Admin user already exists, skipping creation");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error);
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


// const reactBuildPath = path.join(__dirname, "../../frontend/qr-code2-main-main/build");

// app.use(express.static(reactBuildPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(reactBuildPath, "index.html"));
// });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
