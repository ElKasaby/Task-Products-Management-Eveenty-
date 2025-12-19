import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/admin.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
const router = Router();
router.post('/products', authenticateJWT, authorizeRole('admin'), createProduct);
router.put('/products/:id', authenticateJWT, authorizeRole('admin'), updateProduct);
router.delete('/products/:id', authenticateJWT, authorizeRole('admin'), deleteProduct);
export default router;
//# sourceMappingURL=admin.routes.js.map