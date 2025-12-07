"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#1e293b] dark:to-[#0f172a] rounded-[2.5rem] p-12 md:p-20 overflow-hidden shadow-2xl text-center">

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="40" />
                        </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 opacity-10 rotate-180">
                        <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="50" y="50" width="100" height="100" stroke="white" strokeWidth="20" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-teal-300 font-medium text-sm backdrop-blur-sm border border-white/5"
                        >
                            <Sparkles size={16} />
                            <span>Start Your Journey Today</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
                        >
                            Find your perfect travel <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">companion today.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto"
                        >
                            Join thousands of travelers who have already found their travel buddies.
                            Create your profile in minutes and start exploring the world together.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                        >
                            <Link
                                href="/register"
                                className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-[#0F172A] bg-teal-400 hover:bg-teal-300 transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(45,212,191,0.5)]"
                            >
                                Get Started for Free
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/explore"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-white/10 border border-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:-translate-y-1"
                            >
                                Explore Destinations
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
