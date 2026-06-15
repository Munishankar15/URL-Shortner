import { IsUrl, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({ message: 'URL must not be empty' })
  @IsUrl({}, { message: 'Invalid URL format' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  customAlias?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  maxClicks?: number;

  @IsOptional()
  @IsString()
  ogTitle?: string;

  @IsOptional()
  @IsString()
  ogDescription?: string;

  @IsOptional()
  @IsString()
  ogImage?: string;

  @IsOptional()
  @IsString()
  folderId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
