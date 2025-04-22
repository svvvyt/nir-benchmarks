import { validationResult } from 'express-validator';

import { logger } from './logger.js';

export default async (request, reply, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    logger.error('Validation errors:', errors.array());
    return reply.status(400).send(errors.array());
  }

  next();
};
