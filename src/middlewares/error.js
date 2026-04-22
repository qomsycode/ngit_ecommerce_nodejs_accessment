const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || res.statusCode;
    if (statusCode < 400) statusCode = 500;

    res.status(statusCode).json({
        error: err.message || "Internal Server Error"
    });

    console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);
};

module.exports = errorHandler;
