import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request, Response, NextFunction } from "express";

export const validateQuery =
  (DtoClass: new () => object) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.query, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: errors.map((e) => e.constraints),
      });
    }

    res.locals.query = dto;
    next();
  };
