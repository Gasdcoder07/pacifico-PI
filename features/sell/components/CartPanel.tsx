import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

const products = [
    {
        id: "1",
        name: "Auriculares Inalámbricos",
        description:
            "Auriculares over-ear con cancelación de ruido activa y 30 horas de batería.",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    },
    {
        id: "3",
        name: "Teclado Mecánico",
        description:
            "Teclado retroiluminado RGB con switches azules para una respuesta táctil.",
        price: 85.0,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
    },
    {
        id: "5",
        name: "Cámara Réflex",
        description:
            "Cámara digital de 24MP con grabación de video en 4K y lente intercambiable.",
        price: 549.0,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    },
    {
        id: "8",
        name: "Termo de Acero",
        description:
            "Botella térmica de doble pared que mantiene tus bebidas frías por 24 horas.",
        price: 25.5,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    },
];

const CartPanel = () => {
    return (
        <section className="flex min-h-0 min-w-0 basis-1/4 flex-col rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col min-h-0 min-w-0 h-full">
                <div className="border-b border-neutral-200 p-4">
                    <h3 className="font-semibold">Detalles de la orden</h3>
                </div>

                {/* Lista de productos */}
                <div className="flex flex-col min-h-0 min-w-0 h-full p-4 overflow-y-auto gap-2">
                    {
                        products.map((product) => {
                            return (
                                <div
                                    key={product.id}
                                    className="flex flex-col rounded-lg border border-neutral-200 shadow-sm p-2 gap-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <img
                                                className="h-8 w-10 shrink-0 object-cover rounded-lg"
                                                src={product.image}
                                                alt={product.name} />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-semibold truncate">{product.name}</h3>
                                            </div>
                                        </div>

                                        <span className="text-xs shrink-0 bg-neutral-200 size-6 rounded-full flex items-center justify-center">
                                            x1
                                        </span>
                                    </div>
                                    <div className="mt-auto flex justify-between items-center gap-2">
                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20
                                                }}
                                                className="rounded-full p-1 bg-cyan-400 cursor-pointer"
                                            >
                                                <Plus className="size-3 text-white"/>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20
                                                }}
                                                className="rounded-full p-1 bg-cyan-400 cursor-pointer"
                                            >
                                                <Minus className="size-3 text-white"/>
                                            </motion.button>
                                        </div>
                                        <span className="text-xs font-bold">
                                            ${product.price}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="border-t border-neutral-200 p-4 text-xs text-neutral-400 flex flex-col gap-2">
                <p>Subtotal: </p>
                <p>IVA (16%): </p>
                <p>Total: </p>
            </div>
        </section>
    );
};

export default CartPanel;
