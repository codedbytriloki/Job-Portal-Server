import { User } from "../models/user_model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/dataUri.js";
import cloudinary from '../utils/cloudinary.js'


export const register = async (req, res) => {
  try {

    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Please provide all field",
        success: false
      });
    };
    
    const file = req.file; // may be undefined if user didn't choose one

    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      if (fileUri) {
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      }
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email",
        success: false
      });
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileData = {};
    if (cloudResponse) {
      profileData.profilePhoto = cloudResponse.secure_url;
    }

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: profileData
    });
    await newUser.save();
    return res.status(200).json({
      message: "User successfully registered",
      success: true
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Please provide all field",
        success: false
      });
    };
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Please provide valid email and password",
        success: false
      });
    };

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({
        message: "Please provide valid email and password",
        success: false
      });
    }
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exit with current role.",
        success: false
      });
    }

    const tokenData = {
      userId: user._id
    }
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    }

    return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
      message: `Welcome back ${user.fullName}`,
      user,
      success: true
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "LogOut Successfully",
      success: true,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    let cloudResponse;
    if (file) {
      const fileuri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileuri.content);
    }
    // console.log(fullName, email, phoneNumber, bio, skills, file, cloudResponse);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    const userId = req.id; //middleware authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false
      });
    };
    // update
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url //save cloundary url
      user.profile.resumeOriginalName = file.originalname //save the original file name
    }

    await user.save();
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    }


    return res.status(200).json({
      message: `Profile updated successfully`,
      user,
      success: true
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      success: false,
      err
    });
  }
}
