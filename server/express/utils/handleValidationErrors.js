import { validationResult } from 'express-validator';
import { logger } from './logger.js';

export default (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array());
    return res.status(400).json(errors.array());
  }

  next();
};
