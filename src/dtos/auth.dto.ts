import { IsEmail, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class SignupDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email!: string;

  @IsString()
  password!: string;
}
