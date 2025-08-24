import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    const validate = await schema.validateAsync(req.body);
    console.log('Validation result:', validate);
    if (validate.error) {
      // next(createHttpError(422, validate.error));
      return next(createHttpError(422, validate.error));
    }
    next();
  } catch (error) {
    next(error);
  }
};
