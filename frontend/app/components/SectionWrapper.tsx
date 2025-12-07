"use client";

import { motion } from "framer-motion";
import React from "react";

export default function SectionWrapper({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}
