// controllers/userDataController.js
const UserData = require("../models/userDataModel");
const User = require("../models/userModel");
exports.getUserData = async (req, res) => {
  try {
    const userData = await UserData.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

// exports.getUserData = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id); // Fetch user details
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const userData = await UserData.find({ userId: req.user.id }); // Fetch user data
//     res.status(200).json({
//       success: true,
//       data: {
//         username: user.username,
//         email: user.email,
//         userData, // Optional: include additional user data if necessary
//       },
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error });
//   }
// };

exports.createUserData = async (req, res) => {
  try {
    const { data } = req.body;
    const userData = await UserData.create({ userId: req.user.id, data });
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
