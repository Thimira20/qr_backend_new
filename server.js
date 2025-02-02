// server.js
const express = require("express");
const mongoose = require("mongoose");
const { PORT, MONGO_URI } = require("./config");
const authRoutes = require("./routes/authRoutes");
const userDataRoutes = require("./routes/userDataRoutes");
const profileDataRoutes = require("./routes/profileDataRouets");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.use("/api/auth", authRoutes);
app.use("/api/user-data", userDataRoutes);
app.use("/api/profile-data", profileDataRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
