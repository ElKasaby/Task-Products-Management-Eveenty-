import type { Request, Response } from "express";
import prisma from "../config/db.js";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { Role } from "@prisma/client";

import { hashPassword, comparePassword } from "../utils/password.js";
import { SignupDto, LoginDto } from "../dtos/auth.dto.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (
  req: Request<{}, {}, SignupDto>,
  res: Response
) => {
  const { email, password } = req.body;
  const existUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if(existUser) return res.status(409).send({message:"User already exists"})
  const hashedPassword = await hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: Role.USER },
    });
    res.status(201).send({
      message: "User created",
      userId: user.id,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).send({
          message: "User already exists",
        });
      }
    }

    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

export const signupAdmin = async (
  req: Request<{}, {}, SignupDto>,
  res: Response
) => {
  const { email, password } = req.body;
  const existUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if(existUser) return res.status(409).send({message:"User already exists"})
  const hashedPassword = await hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: Role.ADMIN },
    });
    res.status(201).send({
      message: "User created",
      userId: user.id,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).send({
          message: "User already exists",
        });
      }
    }

    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request<{}, {}, LoginDto>, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  res.send({ token });
};
