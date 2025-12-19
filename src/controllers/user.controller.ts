import type { Request, Response } from "express";
import prisma from "../config/db.js";
import { stripe } from "../config/stripe.js";
import { AddPaymentMethodDto } from "../dtos/add-payment-method.dto.js";
import { CreateOrderDto, OrderItemDto } from "../dtos/create-order.dto.js";
import { Stripe } from "stripe";
import { PaginationDto } from "../dtos/pagination.dto.js";

export const listProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.send(products);
};

export const addPaymentMethod = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { paymentMethodId } = req.body as AddPaymentMethodDto;

  try {
    // 1️⃣ get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // 2️⃣ create Stripe customer if not exists
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: String(user.id) },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // 3️⃣ attach payment method
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    // 4️⃣ save in DB
    await prisma.paymentMethod.create({
      data: {
        userId,
        stripeId: paymentMethod.id,
      },
    });

    res.status(201).send({
      message: "Payment method added successfully",
    });
  } catch (err: any) {
    console.error("ADD PAYMENT METHOD ERROR:", err);
    res.status(400).send({ error: err.message });
  }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const paymentMethodId = req.params.id;

  try {
    // 1️⃣ get payment method from DB
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: Number(paymentMethodId) },
    });

    if (!paymentMethod) {
      return res.status(404).send({ message: "Payment method not found" });
    }

    // 2️⃣ ensure ownership
    if (paymentMethod.userId !== userId) {
      return res.status(403).send({ message: "Forbidden" });
    }

    // 3️⃣ detach from Stripe
    await stripe.paymentMethods.detach(paymentMethod.stripeId);

    // 4️⃣ delete from DB
    await prisma.paymentMethod.delete({
      where: { id: paymentMethod.id },
    });

    res.send({ message: "Payment method deleted successfully" });
  } catch (err: any) {
    console.error("DELETE PAYMENT METHOD ERROR:", err);
    res.status(400).send({ error: err.message });
  }
};

export const createOrder = async (
  req: Request<{}, {}, CreateOrderDto>,
  res: Response
) => {
  const userId = req.user!.userId;
  const { items } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      return res.status(400).send({
        message: "User has no payment method",
      });
    }

    const productIds = items.map((item: OrderItemDto) => item.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return res.status(400).send({
        message: "One or more products not found",
      });
    }

    let total = 0;

    const orderItems = items.map((item: OrderItemDto) => {
      const product = products.find((p) => p.id === item.productId)!;

      total += product.price * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
      };
    });

    // 1️⃣ Get Stripe customer
    const customer = (await stripe.customers.retrieve(
      user.stripeCustomerId!
    )) as Stripe.Customer;

    // 2️⃣ Ensure default payment method exists
    const defaultPaymentMethod =
      customer.invoice_settings?.default_payment_method;

    if (!defaultPaymentMethod) {
      return res.status(400).send({
        message: "No default payment method found",
      });
    }

    // 3️⃣ Create PaymentIntent WITH payment_method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      customer: user.stripeCustomerId!,
      payment_method: defaultPaymentMethod as string,
      confirm: true,

      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
        },
      });

      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          ...item,
          orderId: createdOrder.id,
        })),
      });

      return createdOrder;
    });

    res.status(201).send({
      message: "Order placed successfully",
      orderId: order.id,
      total,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err: any) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(400).send({ error: err.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { page = 1, limit = 10 } = res.locals.query as PaginationDto;

  const skip = (page - 1) * limit;

  try {
    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({
        where: { userId },
      }),
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
