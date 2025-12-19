import prisma from "../config/db.js";
import { stripe } from "../config/stripe.js";
export const listProducts = async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
};
export const addPaymentMethod = async (req, res) => {
    const userId = req.user.userId;
    const { paymentMethodId } = req.body;
    try {
        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: `cus_${userId}`, // replace with real Stripe customer
        });
        await prisma.paymentMethod.create({
            data: {
                userId,
                stripeId: paymentMethod.id,
            },
        });
        res.json({ message: 'Payment method added' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
//# sourceMappingURL=user.controller.js.map