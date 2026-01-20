"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Map, Compass } from "lucide-react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200); // Slightly longer than animation to ensure full view

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-950"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className="relative flex flex-col items-center">
                        {/* Animated Icons Container */}
                        <div className="relative w-32 h-32 mb-8">
                            {/* Background decoration */}
                            <motion.div
                                className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />

                            {/* Main Logo Construction */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center text-primary"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    duration: 1.5
                                }}
                            >
                                <Plane size={64} className="transform -rotate-45" />
                            </motion.div>

                            {/* Orbiting Elements */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-teal-500">
                                    <Compass size={24} />
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute inset-0"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 text-purple-500">
                                    <Map size={20} />
                                </div>
                            </motion.div>
                        </div>

                        {/* Text Reveal */}
                        <div className="overflow-hidden">
                            <motion.h1
                                className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                            >
                                TRAVNER
                            </motion.h1>
                        </div>

                        <motion.p
                            className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium tracking-wide uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            Explore Together
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
