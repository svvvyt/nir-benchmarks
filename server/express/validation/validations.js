import { body } from 'express-validator';

export const postCreateValidation = [
  body('title', 'Enter the article title').isLength({ min: 3 }).isString(),
  body('text', 'Enter the article text').isLength({ min: 3 }).isString(),
  body('imageUrl', 'Invalid image URL').optional().isString(),
];
