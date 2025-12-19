import type { Request, Response } from "express";
import prisma from "../config/db.js";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto.js";
import { SalesQueryDto } from "../dtos/sales-query.dto.js";

export const createProduct = async (
  req: Request<{}, {}, CreateProductDto>,
  res: Response
) => {
  const { name, description, price } = req.body;

  try {
    const product = await prisma.product.create({
      data: { name, description, price },
    });

    res.status(201).send(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).send({ message: "Failed to create product" });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductDto>,
  res: Response
) => {
  const id = Number(req.params.id);

  try {
    const existing = await findProductOrNull(id);

    if (!existing) {
      return res.status(404).send({ message: "Product not found" });
    }

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.status(200).send(product);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).send({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = Number(req.params.id);

  try {
    const existing = await findProductOrNull(id);

    if (!existing) {
      return res.status(404).send({ message: "Product not found" });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).send({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).send({ message: "Failed to delete product" });
  }
};

export const getSalesReport = async (
  req: Request<{}, {}, {}, SalesQueryDto>,
  res: Response
) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    from,
    to,
    user_name,
  } = req.query;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  if (user_name) {
    where.user = {
      email: {
        contains: user_name,
        mode: "insensitive",
      },
    };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        user: { select: { id: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, price: true } },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  });
};

const findProductOrNull = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
  });
};
