import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll() {
    return this.postsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      return await this.postsService.getOne(parseInt(id));
    } catch (error) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('imageUrl'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file
      ? `/uploads/${file.originalname}`
      : createPostDto.imageUrl;
    return this.postsService.create(
      createPostDto.title,
      createPostDto.text,
      imageUrl,
    );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUrl'))
  async update(
    @Param('id') id: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file
      ? `/uploads/${file.originalname}`
      : createPostDto.imageUrl;
    return this.postsService.update(
      parseInt(id),
      createPostDto.title,
      createPostDto.text,
      imageUrl,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(parseInt(id));
  }
}