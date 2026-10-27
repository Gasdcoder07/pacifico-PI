import { Variants } from "framer-motion";

export const menuVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.5,
        y: -10,
        x: 10,
        transition: {
            type: "spring",
            bounce: 0,
            duration: 0.2,
        },
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 0.6,
            delayChildren: 0.05,
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.15,
            ease: "easeOut",
        },
    },
};

export const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 10,
        scale: 0.5,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.3,
        },
    },
};