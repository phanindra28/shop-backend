import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateProductRequest {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  asset: string;

  @IsOptional()
  @IsObject()
  stock?: {
    EXTRA_SMALL: number;
    SMALL: number;
    MEDIUM: number;
    LARGE: number;
    EXTRA_LARGE: number;
  };
}
