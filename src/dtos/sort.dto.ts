import { IsOptional, IsIn } from "class-validator";

export class SortDto {
  @IsOptional()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc" = "desc";

  @IsOptional()
  @IsIn(["createdAt", "total", "price"])
  sortBy?: "createdAt" | "total" | "price" = "createdAt";
}
