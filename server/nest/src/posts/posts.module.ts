// /server/src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import { prisma } from '../../prisma/prisma-client';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: 'PRISMA',
      useValue: prisma,
    },
  ],
})
export class PostsModule {}
