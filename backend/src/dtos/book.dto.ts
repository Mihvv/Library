import { IsString, IsNotEmpty, IsOptional, Length, IsISBN } from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  title!: string;

  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author is required' })
  @Length(1, 255, { message: 'Author must be between 1 and 255 characters' })
  author!: string;

  @IsString({ message: 'ISBN must be a string' })
  @IsNotEmpty({ message: 'ISBN is required' })
  @IsISBN(undefined, { message: 'Invalid ISBN format' })
  isbn!: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Author must be a string' })
  @Length(1, 255, { message: 'Author must be between 1 and 255 characters' })
  author?: string;

  @IsOptional()
  @IsString({ message: 'ISBN must be a string' })
  @IsISBN(undefined, { message: 'Invalid ISBN format' })
  isbn?: string;
}

export interface BookResponseDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
}