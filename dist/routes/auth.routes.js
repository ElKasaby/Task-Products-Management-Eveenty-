import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { validateDto } from "../middlewares/validate.js";
import { SignupDto, LoginDto } from "../dtos/auth.dto.js";
const router = Router();
router.post("/signup", validateDto(SignupDto), signup);
router.post("/login", validateDto(LoginDto), login);
export default router;
//# sourceMappingURL=auth.routes.js.map