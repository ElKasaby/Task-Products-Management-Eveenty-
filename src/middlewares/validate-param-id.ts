import type { Request, Response, NextFunction } from "express";

export const validateParamId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const parsed = Number(id);

  if (!id || Number.isNaN(parsed)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  req.params.id = String(parsed);
  next();
};
