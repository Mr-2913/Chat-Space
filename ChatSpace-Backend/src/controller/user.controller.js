import ChatspaceUser from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, username, phonenumber, email, password } = req.body;

    //check for empty field
    if (!name || !username || !phonenumber || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are Required",
      });
    }

    //existing user check
    const existingUser = await ChatspaceUser.findOne({
      $or: [{ email }, { phonenumber }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Exist.",
      });
    }

    // hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 8);

    // create new user
    const newUser = await ChatspaceUser.create({
      name,
      username,
      email,
      password: hashedPassword,
      phonenumber,
    });

    // responder which create user data
    const responder = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phonenumber: newUser.phonenumber,
      username: newUser.username,
    };

    return res.status(200).json({
      success: true,
      message: "New User Create Successfully",
      data: responder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for empty fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find user
    const user = await ChatspaceUser.findOne({ username });

    // Check user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Password does not match
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    // User data to send to frontend
    const responder = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phonenumber: user.phonenumber,
    };

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: responder,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const ChangePassword = async (req, res) => {
  try {
    const { currentpassword, newpassword } = req.body;

    // Check fields
    if (!currentpassword || !newpassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Optional: prevent same password
    if (currentpassword === newpassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Find logged-in user
    const user = await ChatspaceUser.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isPasswordCorrect = await bcrypt.compare(
      currentpassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { name, username } = req.body;

    const updateData = {};

    // Update name
    if (name) {
      updateData.name = name.trim();
    }

    // Update username
    if (username) {
      const trimmedUsername = username.trim();

      // Check if username is already taken
      const existingUsername = await ChatspaceUser.findOne({
        username: trimmedUsername,
      });

      if (
        existingUsername &&
        existingUsername._id.toString() !== req.user.id
      ) {
        return res.status(409).json({
          success: false,
          message: "Username is already taken",
        });
      }

      updateData.username = trimmedUsername;
    }

    // Make sure something is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Update user
    const user = await ChatspaceUser.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    // User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const userProfile = async (req, res) => {
  try {
    const user = await ChatspaceUser
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("User Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};