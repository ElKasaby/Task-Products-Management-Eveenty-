import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getSalesReport,
} from "../controllers/admin.controller.js";

import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { validateDto } from "../middlewares/validate.js";
import { validateParamId } from "../middlewares/validate-param-id.js";
import { validateQuery } from "../middlewares/validate-query.js";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto.js";
import { SalesQueryDto } from "../dtos/sales-query.dto.js";

const router = Router();

/**
 * @openapi
 * /admin/products:
 *   post:
 *     summary: Create product
 *     description: Creates a new product. Admin only.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Failed to create product
 */
router.post(
  "/products",
  authenticateJWT,
  authorizeRole("ADMIN"),
  validateDto(CreateProductDto),
  createProduct
);

/**
 * @openapi
 * /admin/products/{id}:
 *   put:
 *     summary: Update product
 *     description: Updates an existing product by ID. Admin only.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product
 */
router.put(
  "/products/:id",
  authenticateJWT,
  authorizeRole("ADMIN"),
  validateParamId,
  validateDto(UpdateProductDto),
  updateProduct
);

/**
 * @openapi
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Deletes a product by ID. Admin only.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to delete product
 */
router.delete(
  "/products/:id",
  authenticateJWT,
  authorizeRole("ADMIN"),
  validateParamId,
  deleteProduct
);

/**
 * @openapi
 * /admin/sales:
 *   get:
 *     summary: Get sales report
 *     description: Returns paginated sales report with optional filters. Admin only.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [total, createdAt]
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: user_name
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sales report
 *       500:
 *         description: Failed to fetch sales report
 */
router.get(
  "/sales",
  authenticateJWT,
  authorizeRole("ADMIN"),
  validateQuery(SalesQueryDto),
  getSalesReport
);
export default router;
