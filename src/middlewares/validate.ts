import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request, Response, NextFunction } from "express";

export const validateDto =
  (DtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }

    const dto = plainToInstance(DtoClass, req.body);

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.map((e) => e.constraints),
      });
    }

    req.body = dto;
    next();
  };
