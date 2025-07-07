import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync, ApiError } from "../middleware/errorHandler.js";

export const signUpController = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1. Basic validation
  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password.');
  }

  // 2. Email format check (optional but useful)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Please provide a valid email address.');
  }

  // 3. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists.');
  }

  // 4. Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 6. Generate token
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  // 7. Remove sensitive data from response
  const { password: _, ...userData } = newUser.toObject();

  // 8. Send response
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      token,
      user: userData,
    },
  });
});


export const signInController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Check if user exists
    const userFromDb = await User.findOne({ email });
    if (!userFromDb) {
      return res.status(401).json({
        success: false,
        message: 'User not registered.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, userFromDb.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userFromDb._id, email: userFromDb.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Remove sensitive fields before sending response
    const userResponse = {
      _id: userFromDb._id,
      email: userFromDb.email,
      name: userFromDb.name,
      // Add any other public fields
    };

    res.status(200).json({
      success: true,
      message: 'User signed in successfully.',
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};