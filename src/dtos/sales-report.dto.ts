import { IsOptional, IsDateString, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class SalesReportQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  user_name?: string;
}
