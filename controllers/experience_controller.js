import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import Experience from "../models/experience_model.js";

const createExperience = catchAsync(async (req, res) => {
  try {
    const { title, description, image, liveLink } = req.body;

    const experience = await Experience.create({ title, description, image, liveLink });
    if (!experience) {
      throw new ApiError(404, "Experience not found");
    }
    
    res.status(201).json({
      message: "Experience created successfully",
      status: "success",
      data: {
        experience,
      },
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getAllExperiences = catchAsync(async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json({
      message: "Experiences fetched successfully",
      status: "success",
      data: {
        experiences,
      },
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updateExperience = catchAsync(async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!experience) {
      throw new ApiError(404, "Experience not found");
    }
    res.status(200).json({
      message: "Experience updated successfully",
      status: "success",
      data: {
        experience,
      },
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deleteExperience = catchAsync(async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      throw new ApiError(404, "Experience not found");
    }
    res.status(200).json({
      message: "Experience deleted successfully",
      status: "success",
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { createExperience, getAllExperiences, updateExperience, deleteExperience };


