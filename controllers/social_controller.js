import Social from "../models/social_model.js";
import { catchAsync, ApiError } from "../middleware/errorHandler.js";

const createSocial = catchAsync(async (req, res) => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      throw new ApiError(400, "Name and link are required");
    }

    const existingSocial = await Social.findOne({ name });
    if (existingSocial) {
      throw new ApiError(400, "Social already exists");
    }

    const social = await Social.create({ name, link });
    res.status(201).json({
      message: "Social created successfully",
      status: "success",
      data: {
        social,
      },
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getAllSocials = catchAsync(async (req, res) => {
  try {
    const socials = await Social.find();
    if (!socials) {
      throw new ApiError(404, "No socials found");
    }

    res.status(200).json({
      message: "Socials fetched successfully",
      status: "success",
      data: { socials },
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});


const updateSocial = catchAsync(async (req, res) => {
  try {
    const { name, link } = req.body;
    const social = await Social.findByIdAndUpdate(req.params.id, { name, link }, { new: true });
    if (!social) {
      throw new ApiError(404, "Social not found");
    }
    res.status(200).json({
      message: "Social updated successfully",
      status: "success",
      data: {
        social,
      },
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deleteSocial = catchAsync(async (req, res) => {
  try {
    const social = await Social.findByIdAndDelete(req.params.id);
    if (!social) {
      throw new ApiError(404, "Social not found");
    }
    res.status(200).json({
      message: "Social deleted successfully",
      status: "success",
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { createSocial, getAllSocials, updateSocial, deleteSocial };