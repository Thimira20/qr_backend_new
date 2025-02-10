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



// exports.getAllUserData = async (req,res) =>{
//   try{
//     const user = await User.find();
//     res.status(200).send(user);
//   }catch(error){
//     res.status(400).send({error: error.message})
//   }
// }

// exports.updateUserRole = async (req, res) => {
//   try {
//     const { userId, role } = req.body;
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { role },
//       { new: true, runValidators: true }
//     );

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     res.status(400).json({ success: false, error });
//   }
// };
//  exports.deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const user = await User.findByIdAndDelete(userId);

//     if (!user) {
//       return res.status(404).send("User not found.");
//     }

//     res.status(200).send({ message: "User deleted successfully." });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };



// exports.deleteAllExceptAdmin = async (req, res) => {
//   try {
//     const result = await User.deleteMany({ role: { $ne: "admin" } });

//     res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} users deleted successfully.`,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
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


// Get all users (for admin dashboard)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({role: { $ne: "super_admin" }}).select("username email role lastActiveAt");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update multiple user roles
exports.updateUserRoles = async (req, res) => {
  try {
    const { users } = req.body; // Expecting an array of { userId, role }
    await Promise.all(
      users.map(({ userId, role }) =>
        User.findByIdAndUpdate(userId, { role }, { new: true })
      )
    );

    res.status(200).json({ success: true, message: "User roles updated successfully." });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete selected users
// exports.deleteSelectedUsers = async (req, res) => {
//   try {
//     const { userIds } = req.body; // Expecting an array of user IDs
//     const result = await User.deleteMany({ _id: { $in: userIds } });

//     res.status(200).json({ success: true, message: `${result.deletedCount} users deleted successfully.` });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };
exports.deleteSelectedUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    // Find all users in the request and filter out admins
    const usersToDelete = await User.find({ _id: { $in: userIds }, role: { $ne: "super_admin" } });

    if (usersToDelete.length === 0) {
      return res.status(400).json({ success: false, message: "No users were deleted. Admin users cannot be removed." });
    }

    // Delete only non-admin users
    const result = await User.deleteMany({ _id: { $in: usersToDelete.map(user => user._id) } });

    res.status(200).json({ 
      success: true, 
      message: `${result.deletedCount} users deleted successfully. Admins were not deleted.` 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// Delete all users except admin
exports.deleteAllExceptAdmin = async (req, res) => {
  try {
    const result = await User.deleteMany({ role: { $ne: "admin" } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} users deleted successfully.`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};