import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    companyName: {
      position: {
        type: String,
        required: true,
        trim: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      responsibility: [
        {
          type: String,
          required: true,
          trim: true,
        },
      ],

      image: {
        type: String,
        required: true,
        trim: true,
      },

      liveLink: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamp: true }
);

const experience = mongoose.model("experience", experienceSchema);

export default experience;
