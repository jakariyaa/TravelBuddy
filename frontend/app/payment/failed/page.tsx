"use client";

import Link from "next/link";
import { RefreshCw, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PaymentFailedPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="relative z-10 max-w-lg w-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-10 sm:p-14 text-center"
                >
                    <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-8 shadow-inner">
                        <motion.div
                            initial={{ scale: 0, rotate: 45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <XCircle className="text-red-500 dark:text-red-400" size={48} strokeWidth={2.5} />
                        </motion.div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Payment Failed</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        We couldn&apos;t process your payment. Please try again or use a different payment method.
                    </p>

                    <div className="flex flex-col gap-4">
                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-900/20 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <RefreshCw size={20} />
                            Try Again
                        </Link>
                        <div className="flex gap-4">
                            <Link
                                href="/contact"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                            >
                                Contact Support
                            </Link>
                            <Link
                                href="/dashboard"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold rounded-2xl border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
