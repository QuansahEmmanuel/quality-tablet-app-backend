import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/generateToken.js";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, employeeID, role } = req.body;

    if (!username || !email || !phone || !password || !employeeID || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All input fields are required!" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be more than six characters",
      });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashPassword,
      employeeID,
      role,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        employeeID: newUser.employeeID,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(`Error in registerUser controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All input fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        employeeID: user.employeeID,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Error in userLogin controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const userLogout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error(`Error in userLogout controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users.length) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(`Error in getAllUsers controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(`Error in getUserByID controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, password, employeeID, role } = req.body;

    // 1. Validate required fields (except password, since it's optional)
    if (!username || !email || !phone || !employeeID || !role) {
      return res
        .status(400)
        .json({ message: "All input fields are required!" });
    }

    // 2. Validate password (if provided)
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // 3. Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }

    // 4. Prepare update object
    const updateFields = {
      username,
      email,
      phone,
      employeeID,
      role,
    };

    if (password && password !== "") {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // 5. Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true, // ensures mongoose schema validations run
    }).select("-password"); // don’t return password in response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(`Error in updateUser controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }

    // 2. Try to delete user
    const deletedUser = await User.findByIdAndDelete(id);

    // 3. If user not found
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Success response
    res.status(200).json({ message: "User deleted successfully", id });
  } catch (error) {
    console.error(`Error in deleteUser controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authCheck = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
