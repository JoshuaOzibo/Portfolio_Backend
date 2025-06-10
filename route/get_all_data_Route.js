import { Router } from "express";
import connectDb from "../DataBase/mongo_db.js";
import mongoose from "mongoose";

const route = Router();

route.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Mongobd not connected')
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    const result = {};

    for (const col of collections) {
      const collectionName = col.name;
      const docs = await mongoose.connection.db
        .collection(collectionName)
        .find()
        .toArray();
      result[collectionName] = docs;
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch full database dump",
      details: error.message,
    });
  }
});

export default route;
