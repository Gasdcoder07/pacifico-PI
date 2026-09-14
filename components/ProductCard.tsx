import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product } : any) => {
    return (
        <div className="h-full w-full bg-white rounded-lg border border-neutral-200 shadow-sm p-4 flex flex-col gap-4">
            <div className="flex gap-4 items-start">
                <img
                    className="h-16 w-20 shrink-0 object-cover rounded-lg"
                    src={product.image}
                    alt={product.name} />

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                </div>
            </div>

            <div className="h-1/2 flex flex-col gap-2">
                <p className="text-xs text-neutral-600 flex-1 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold">${product.price}</span>

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
                        <Plus className="text-white"/>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
