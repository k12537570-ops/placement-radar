import { errorResponse } from '../utils/response.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }));
      return errorResponse(res, 'Validation error', formattedErrors, 400);
    }
    return errorResponse(res, 'Invalid request payload', null, 400);
  }
};

