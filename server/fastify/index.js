import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import https from 'https';
import cluster from 'cluster';
import { cpus } from 'os';
import { logger } from './utils/logger.js';
import { PostController } from './controllers/index.js';
import { postCreateValidation } from './validation/validations.js';
import { handleValidationErrors } from './utils/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

const fastify = Fastify({
  logger: false,
  https: cluster.isWorker
    ? {
        key: await fs.readFile(path.resolve(__dirname, 'key.pem')),
        cert: await fs.readFile(path.resolve(__dirname, 'cert.pem')),
      }
    : null,
});

await fastify.register(multipart, { limits: { fileSize: 10000000 } });
await fastify.register(fastifyCors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
});
await fastify.register(fastifyRateLimit, {
  max: 100, // 100 запросов с одного IP
  timeWindow: 15 * 60 * 1000, // 15 минут
});

// Настройка статической папки
try {
  await fs.access(uploadsDir);
} catch {
  await fs.mkdir(uploadsDir);
  logger.info('Папка uploads создана автоматически');
}
fastify.register(fastifyStatic, { root: uploadsDir, prefix: '/uploads/' });

// Парсер для JSON
fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'string' },
  (req, body, done) => {
    try {
      done(null, JSON.parse(body));
    } catch (err) {
      done(err);
    }
  }
);

// Обработка multipart/form-data
const processMultipartForm = async (request) => {
  const parts = request.parts();
  const fields = {};
  let file = null;

  for await (const part of parts) {
    if (part.type === 'file') {
      file = part;
      const filePath = path.join(uploadsDir, file.filename);
      const fileStream = createWriteStream(filePath);
      part.file.pipe(fileStream);
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  return { body: fields, file };
};

// Валидация с express-validator
const validateRequest = async (request, reply) => {
  const data = await processMultipartForm(request);
  request.body = data.body;
  request.file = data.file;

  for (const validator of postCreateValidation) {
    await validator(request, reply, () => {});
  }
  await handleValidationErrors(request, reply, () => {});
};

// Добавление заголовков безопасности (аналог Helmet)
fastify.addHook('onSend', (request, reply, payload, done) => {
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');
  done(null, payload);
});

// Маршруты
fastify.get('/', async (request, reply) => {
  logger.info('GET / requested');
  reply.send('hello world');
});

fastify.get('/posts', PostController.getAll);
fastify.get('/posts/:id', PostController.getOne);

fastify.post(
  '/posts',
  { preValidation: validateRequest },
  async (request, reply) => {
    logger.info(
      'POST /posts received:',
      request.body,
      request.file?.filename || null
    );
    await PostController.create(request, reply);
  }
);

fastify.patch(
  '/posts/:id',
  { preValidation: validateRequest },
  async (request, reply) => {
    logger.info(
      'PATCH /posts/:id received:',
      request.params.id,
      request.body,
      request.file?.filename || null
    );
    await PostController.update(request, reply);
  }
);

fastify.delete('/posts/:id', PostController.remove);

// Кластеризация и запуск сервера
if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  logger.info(`Primary ${process.pid} is running, forking ${numCPUs} workers`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    logger.info(`Worker ${process.pid} started on HTTPS port 3001`);
  } catch (err) {
    logger.error('Server error:', err);
    process.exit(1);
  }
}
