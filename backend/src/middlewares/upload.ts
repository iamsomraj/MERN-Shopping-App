import multer from 'multer';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user?.id ?? 'anonymous'}-${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === 'image/jpeg' || file.mimetype === 'image/png');
  },
});
