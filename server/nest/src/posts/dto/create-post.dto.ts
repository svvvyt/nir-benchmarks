import { IsString, Length, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Title must be a string' })
  @Length(3, undefined, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsString({ message: 'Text must be a string' })
  @Length(3, undefined, { message: 'Text must be at least 3 characters long' })
  text: string;

  @IsString({ message: 'Image URL must be a string' })
  @IsOptional()
  imageUrl?: string;
}