const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || res.statusCode;
    if (statusCode < 400) statusCode = 500;

    res.status(statusCode);

    const response = {
        success: false,
        message: err.message || "Internal Server Error",

        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };

    if (err.name === "ValidationError") {
        res.status(400);
        response.message = "Invalid input data";
        response.errors = err.errors;
    }

    console.error(`[ERROR] ${req.method} ${req.url}:`, {
        message: err.message,
        stack: err.stack,
        body: req.body,
    });

    res.json(response);
};

module.exports = errorHandler;
