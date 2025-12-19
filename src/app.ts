import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { setupSwagger } from "./swagger.js";

dotenv.config();
const app = express();
app.use(express.json());

// Swagger
setupSwagger(app);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("Server running"));
export default app;
