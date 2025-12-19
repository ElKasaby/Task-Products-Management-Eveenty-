import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
export const validateDto = (DtoClass) => async (req, res, next) => {
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
//# sourceMappingURL=validate.js.map