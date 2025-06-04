// Custom error class for API errors
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Handle mongoose validation errors
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    return new ApiError(400, `Invalid input data. ${errors.join('. ')}`);
};

// Handle mongoose duplicate field errors
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return new ApiError(400, `Duplicate field value: ${value}. Please use another value!`);
};

// Handle mongoose cast errors
const handleCastErrorDB = (err) => {
    return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
};

// Handle JWT errors
const handleJWTError = () => new ApiError(401, 'Invalid token. Please log in again!');
const handleJWTExpiredError = () => new ApiError(401, 'Your token has expired! Please log in again.');

// Development error response
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Production error response
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } 
   
    else {
        // Log error for debugging
        console.error('ERROR 💥', err);

        // Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

// Catch async errors
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Not Found error handler
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};

// Already Found error handler
const alreadyExists = (req, res, next) => {
    const error = new ApiError(404, `Already Exists - ${req.originalUrl}`);
    next(error);
};

export { 
    errorHandler, 
    catchAsync, 
    notFound, 
    ApiError,
    alreadyExists
}; 