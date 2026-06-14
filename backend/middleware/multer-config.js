const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

// Cloudinary est utilise si les 3 cles sont presentes (prod).
// Sinon repli sur le disque local (pratique en developpement).
const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true);
  } else {
    callback(new Error('Format de fichier non supporte'));
  }
};

let middleware;

if (useCloudinary) {
  // En memoire puis upload du buffer vers Cloudinary (paquet officiel v2)
  const cloudinary = require('../config/cloudinary');
  const uploadFile = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('image');

  const sendToCloudinary = (req, res, next) => {
    if (!req.file) {
      return next();
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'groupomania' },
      (error, result) => {
        if (error) {
          return next(error);
        }
        req.file.path = result.secure_url;
        next();
      }
    );
    stream.end(req.file.buffer);
  };

  middleware = [uploadFile, sendToCloudinary];
} else {
  middleware = multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => callback(null, 'images'),
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0].replace(/\s+/g, '_');
        const extension = MIME_TYPES[file.mimetype] || 'png';
        callback(null, name + Date.now() + '.' + extension);
      },
    }),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('image');
}

// Renvoie l'URL publique du fichier uploade, quel que soit le stockage utilise.
const resolveImageUrl = (req) => {
  if (!req.file) {
    return null;
  }
  if (useCloudinary) {
    return req.file.path; // URL Cloudinary (secure_url)
  }
  return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
};

// Express accepte un tableau de middlewares la ou un middleware est attendu.
module.exports = middleware;
module.exports.resolveImageUrl = resolveImageUrl;
