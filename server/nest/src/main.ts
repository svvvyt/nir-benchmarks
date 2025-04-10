import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { join, resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as _cluster from 'cluster';
import { cpus } from 'os';
import * as https from 'https';
import * as fs from 'fs';
import { logger } from '../utils/logger';

const cluster = _cluster as unknown as _cluster.Cluster;

async function bootstrap() {
  if (cluster.isPrimary) {
    const numCPUs = cpus().length;
    logger.info(
      `Primary ${process.pid} is running, forking ${numCPUs} workers`,
    );
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(helmet());
    app.use(cors());

    const uploadsPath = resolve(__dirname, '..', '..', 'uploads');
    app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });

    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    const options = {
      key: fs.readFileSync(resolve(__dirname, '..', '..', 'key.pem')),
      cert: fs.readFileSync(resolve(__dirname, '..', '..', 'cert.pem')),
    };

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    const server = https.createServer(
      options,
      app.getHttpAdapter().getInstance(),
    );
    await app.init();
    server.listen(port, () => {
      logger.info(`Worker ${process.pid} started on HTTPS port ${port}`);
    });
  }
}
bootstrap();
