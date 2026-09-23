"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const AddProductButton = () => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                duration: 0.2,
                ease: "easeInOut"
            }}
            className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer">
            <Plus size={20} className="shrink-0"/>
            <span>Agregar Producto</span>
        </motion.button>
    );
};

export default AddProductButton;
