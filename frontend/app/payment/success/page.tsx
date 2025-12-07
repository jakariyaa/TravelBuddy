"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "../../lib/auth-client";

export default function PaymentSuccessPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="relative z-10 max-w-xl w-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-10 sm:p-14 text-center"
                >
                    <div className="mx-auto w-28 h-28 bg-gradient-to-br from-green-100 to-teal-50 dark:from-green-900/40 dark:to-teal-900/20 rounded-full flex items-center justify-center mb-10 shadow-inner">
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            <Check className="text-green-600 dark:text-green-400 drop-shadow-sm" size={56} strokeWidth={3} />
                        </motion.div>
                    </div>

                    <h1 className="text-4xl xs:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 mb-6">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg leading-relaxed">
                        Welcome to the elite club of verified travelers. Your premium subscription is now active.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 mb-10 text-left border border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                            Premium Features Unlocked
                        </h3>
                        <ul className="space-y-4">
                            <motion.li
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                                className="flex items-center gap-4 text-gray-800 dark:text-gray-200"
                            >
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="font-semibold">Verified Traveler Badge</span>
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                                className="flex items-center gap-4 text-gray-800 dark:text-gray-200"
                            >
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                    <User size={20} />
                                </div>
                                <span className="font-semibold">Unlimited Join Requests</span>
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                className="flex items-center gap-4 text-gray-800 dark:text-gray-200"
                            >
                                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                                    <Check size={20} />
                                </div>
                                <span className="font-semibold">Priority Matching</span>
                            </motion.li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-teal-900/20 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Go to Dashboard
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            href={`/profile/${session?.user?.id}`}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-bold rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                        >
                            <User size={20} />
                            View Badge
                        </Link>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
