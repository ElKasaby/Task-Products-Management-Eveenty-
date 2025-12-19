import { IsString, IsOptional, IsNumber, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateProductDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  name!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price!: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price?: number;
}
