import type { Request, Response } from 'express';
import { imageLibrary } from '../../data/imageLibrary.js';

// @desc:   bundled product images admins can choose from
// @access: private (admin)
// @route:  GET /api/admin/image-library
export const getImageLibrary = (_req: Request, res: Response): void => {
  res.status(200).json(imageLibrary);
};
