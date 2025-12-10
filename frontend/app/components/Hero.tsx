"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-primary text-sm font-medium mb-6 border border-teal-100 dark:border-teal-800">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                            Connect with 10,000+ travelers
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
                            Find Your Perfect <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
                                Travel Buddy
                            </span>
                        </h1>

                        <p className="text-xl text-text-secondary mb-8 leading-relaxed max-w-lg">
                            Don't travel solo if you don't want to. Match with travelers heading to your destination and create shared memories.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/find-buddy"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-primary hover:bg-teal-800 transition-all shadow-lg shadow-teal-900/20 hover:shadow-teal-900/30 transform hover:-translate-y-1"
                            >
                                Find Travel Buddies
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/explore"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-text-primary bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                Explore Destinations
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center gap-4 text-sm text-text-secondary">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden">
                                        <img
                                            src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                    +2k
                                </div>
                            </div>
                            <p>Join our growing community</p>
                        </div>
                    </motion.div>

                    {/* Image/Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="space-y-4 mt-12">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
                                    <img
                                        src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Paris"
                                        className="w-full h-48 object-cover rounded-xl mb-3"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-text-primary">Paris, France</h3>
                                            <p className="text-xs text-text-secondary">Dec 12 - 20</p>
                                        </div>
                                        <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-full text-primary">
                                            <MapPin size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none transform rotate-[2deg] hover:rotate-0 transition-transform duration-300">
                                    <img
                                        src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Venice"
                                        className="w-full h-32 object-cover rounded-xl mb-3"
                                    />
                                    <div className="flex items-center gap-2">
                                        <img src="https://i.pravatar.cc/100?img=32" alt="User" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <h3 className="text-sm font-bold text-text-primary">Sarah, 24</h3>
                                            <p className="text-xs text-text-secondary">Traveling Solo</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none transform rotate-[3deg] hover:rotate-0 transition-transform duration-300">
                                    <img
                                        src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Travel"
                                        className="w-full h-40 object-cover rounded-xl mb-3"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">Match Found!</span>
                                        <div className="flex -space-x-2">
                                            <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-6 h-6 rounded-full border border-white dark:border-gray-800" />
                                            <img src="https://i.pravatar.cc/100?img=45" alt="User" className="w-6 h-6 rounded-full border border-white dark:border-gray-800" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-teal-900/20 dark:shadow-none transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300 text-white">
                                    <h3 className="text-2xl font-bold mb-2">500+</h3>
                                    <p className="text-teal-100 text-sm">New trips created this week. Join the adventure!</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
