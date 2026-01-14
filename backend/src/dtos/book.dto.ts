import { IsString, IsNotEmpty, IsOptional, Length, IsISBN, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

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

export class GetBooksQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @IsOptional()
  @IsIn(['title', 'author', 'isbn'], { message: 'Sort by must be title, author, or isbn' })
  sortBy?: 'title' | 'author' | 'isbn' = 'title';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Order must be asc or desc' })
  order?: 'asc' | 'desc' = 'asc';
}

export interface BookResponseDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
}

export interface PaginatedBooksResponseDto {
  data: BookResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}