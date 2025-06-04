
import Social from "../models/social_model.js";
import { catchAsync } from "../middleware/errorHandler.js";

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
            status: 'success',
            data: {
                social
            }
        });
    } catch (error) {
        throw new ApiError(500, error.message);
    }

});

export { createSocial };

