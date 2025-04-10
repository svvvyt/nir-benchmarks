import express from 'express';
import multer from 'multer';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cluster from 'cluster';
import path from 'path';
import { fileURLToPath } from 'url';
import { cpus } from 'os';
import { PostController } from './controllers/index.js';
import { postCreateValidation } from './validation/validations.js';
import { handleValidationErrors } from './utils/index.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // 100 запросов с одного IP
  })
);

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/upload', upload.single('imageUrl'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post(
  '/posts',
  upload.single('imageUrl'),
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete('/posts/:id', PostController.remove);
app.patch(
  '/posts/:id',
  upload.single('imageUrl'),
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  logger.info(`Primary ${process.pid} is running, forking ${numCPUs} workers`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
  };

  https.createServer(options, app).listen(3001, (err) => {
    if (err) {
      logger.error('Server error:', err);
      return;
    }
    logger.info(`Worker ${process.pid} started on HTTPS port 3001`);
  });
}
