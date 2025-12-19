import prisma from "../config/db.js";
export const createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const product = await prisma.product.create({
        data: { name, description, price: parseFloat(price) },
    });
    res.json(product);
};
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid product id" });
    }
    const { name, description, price } = req.body;
    const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
            name,
            description,
            price: Number(price),
        },
    });
    res.json(product);
};
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid product id" });
    }
    await prisma.product.delete({
        where: { id: Number(id) },
    });
    res.json({ message: "Product deleted" });
};
//# sourceMappingURL=admin.controller.js.map