export function successResponse(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    errors: null
  });
}

export function errorResponse(res, message = 'An error occurred', errors = null, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors
  });
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

