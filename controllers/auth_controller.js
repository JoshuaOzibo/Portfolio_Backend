import mongoose from "mongoose";
import User from "../models/user_Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUpController = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exist");
      // error.status(409);
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign({ userId: newUser[0]._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: {
        token,
        user: newUser,
      },
    });

    // console.log(res)
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message || error.toString(),
    });
    
  }
};


export const signInController = async(req, res, next) => {

  try {
    const {email, password} = req.body;

    // compare email from the request and email from the db;
    const userFromDb = await User.findOne({email});

    // error if user dosent exist;
    if(!userFromDb){
      const error = new Error('User not registered');
      throw error
    };

    // compare password;
    const comparePassword = await bcrypt.compare(password, userFromDb.password);

    // error if password is wrong;
    if(!comparePassword) new Error('invalid password');

    // if everything is correct get token
    const token = jwt.sign({userId: userFromDb._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    res.status(200).json({
      success: true,
      message:'user signed in',
      data: {
        token, 
        userFromDb
      }
    })
    
  } catch (error) {
    next(error)
  }
}