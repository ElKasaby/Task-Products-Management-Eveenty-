import { Router } from "express";
import {
  listProducts,
  addPaymentMethod,
  deletePaymentMethod,
  createOrder,
  getMyOrders,
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { validateDto } from "../middlewares/validate.js";
import { AddPaymentMethodDto } from "../dtos/add-payment-method.dto.js";
import { CreateOrderDto } from "../dtos/create-order.dto.js";
import { validateQuery } from "../middlewares/validate-query.js";
import { PaginationDto } from "../dtos/pagination.dto.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @openapi
 * /users/products:
 *   get:
 *     summary: List products
 *     description: Returns all available products.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                     nullable: true
 *                   price:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/products", authenticateJWT, listProducts);

/**
 * @openapi
 * /users/me/payment-methods:
 *   post:
 *     summary: Add a payment method
 *     description: Adds and stores a payment method for the authenticated user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *             required:
 *               - paymentMethodId
 *     responses:
 *       201:
 *         description: Payment method added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request or Stripe error
 *       404:
 *         description: User not found
 */
router.post(
  "/me/payment-methods",
  authenticateJWT,
  authorizeRole("USER"),
  validateDto(AddPaymentMethodDto),
  addPaymentMethod
);

/**
 * @openapi
 * /users/me/payment-methods/{id}:
 *   delete:
 *     summary: Delete a payment method
 *     description: Deletes a payment method owned by the authenticated user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Payment method not found
 */
router.delete(
  "/me/payment-methods/:id",
  authenticateJWT,
  authorizeRole("USER"),
  deletePaymentMethod
);

/**
 * @openapi
 * /users/orders:
 *   post:
 *     summary: Create an order
 *     description: Creates an order for the authenticated user and charges the default payment method.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                   required:
 *                     - productId
 *                     - quantity
 *             required:
 *               - items
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *                 total:
 *                   type: number
 *                 paymentIntentId:
 *                   type: string
 *       400:
 *         description: Validation error or Stripe error
 */
router.post(
  "/orders",
  authenticateJWT,
  authorizeRole("USER"),
  validateDto(CreateOrderDto),
  createOrder
);

/**
 * @openapi
 * /users/me/orders:
 *   get:
 *     summary: List authenticated user orders
 *     description: Returns paginated list of orders for the authenticated user.
 *     tags:
 *       - Users
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
 *     responses:
 *       200:
 *         description: Paginated orders list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       total:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to fetch orders
 */
router.get(
  "/me/orders",
  authenticateJWT,
  authorizeRole("USER"),
  validateQuery(PaginationDto),
  getMyOrders
);

export default router;
