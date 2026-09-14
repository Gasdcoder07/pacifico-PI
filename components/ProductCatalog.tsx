import ProductCard from "./ProductCard";

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
        id: "2",
        name: "Reloj Inteligente",
        description:
            "Monitor de ritmo cardíaco, GPS integrado y resistencia al agua IP68.",
        price: 199.5,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
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
        id: "4",
        name: "Gafas de Sol Clásicas",
        description:
            "Lentes polarizados con protección UV400 y armazón de acetato ligero.",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
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
        id: "6",
        name: "Mochila Antirrobo",
        description:
            'Mochila impermeable con puerto de carga USB y compartimento para laptop de 15".',
        price: 65.0,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    },
    {
        id: "7",
        name: "Altavoz Bluetooth",
        description:
            "Sonido envolvente 360°, graves profundos y diseño portátil resistente al agua.",
        price: 55.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
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

const scrollbarStyles = "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

const ProductCatalog = () => {
    return (
        <section className="flex min-h-0 min-w-0 basis-3/4 flex-col gap-4">
            <div className={`min-h-0 flex-1 overflow-y-auto pr-4 ${scrollbarStyles}`}>
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => {
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}/>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductCatalog;
