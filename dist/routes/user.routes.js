import { Router } from 'express';
import { listProducts, addPaymentMethod } from '../controllers/user.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router = Router();
router.get('/products', authenticateJWT, listProducts);
router.post('/me/payment-methods', authenticateJWT, addPaymentMethod);
export default router;
//# sourceMappingURL=user.routes.js.map