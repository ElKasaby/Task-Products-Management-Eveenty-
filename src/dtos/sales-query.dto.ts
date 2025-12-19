// src/dtos/sales-query.dto.ts
import { IsOptional, IsString, IsIn, IsDateString } from "class-validator";
import { PaginationDto } from "./pagination.dto.js";

export class SalesQueryDto extends PaginationDto {
  // Sorting
  @IsOptional()
  @IsString()
  sortBy?: "total" | "createdAt";

  @IsOptional()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc";

  // Filters
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  user_name?: string;
}
