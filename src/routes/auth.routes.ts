import { Router } from "express";
import { signup, login, signupAdmin } from "../controllers/auth.controller.js";
import { validateDto } from "../middlewares/validate.js";
import { SignupDto, LoginDto } from "../dtos/auth.dto.js";

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with role USER.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/signup", validateDto(SignupDto), signup);

/**
 * @openapi
 * /auth/signup-admin:
 *   post:
 *     summary: Register a new admin user
 *     description: Creates a new user account with role ADMIN.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/signup-admin", validateDto(SignupDto), signupAdmin);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticates a user and returns a JWT access token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", validateDto(LoginDto), login);

export default router;
