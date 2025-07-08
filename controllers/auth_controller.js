import User from "../models/user_model.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync, ApiError } from "../middleware/errorHandler.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    // console.log(res)
  } catch (error) {
    next(error);
  }
};


export const signInWithGoogleController = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Log server time for debugging token timing issues
    // const localTime = Math.floor(Date.now() / 1000);
    // console.log('⏱Server current time (Unix timestamp):', localTime);

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Log important token timing values
    // console.log('Token timestamps => nbf:', payload.nbf, 'iat:', payload.iat, 'exp:', payload.exp);

    const { email, name } = payload;

    // Check or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Google sign-in successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    // console.error('Google Sign-In Error:', error);
    next(error);
  }
};

