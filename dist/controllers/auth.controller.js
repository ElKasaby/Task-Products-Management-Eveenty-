import prisma from "../config/db.js";
import jwt from "jsonwebtoken";
// import { Role } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/password.js";
import dotenv from "dotenv";
dotenv.config();
export const signup = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    console.log(email);
    console.log(hashPassword);
    try {
        console.log("in try");
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, role: "ADMIN" },
        });
        res.status(201).json({
            message: "User created",
            userId: user.id,
        });
    }
    catch (err) {
        res.status(409).json({ message: "User already exists" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
};
//# sourceMappingURL=auth.controller.js.map