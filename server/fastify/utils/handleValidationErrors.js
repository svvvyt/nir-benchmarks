import { validationResult } from 'express-validator';

export default async (request, reply, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return reply.status(400).send(errors.array());
  }

  next();
};
