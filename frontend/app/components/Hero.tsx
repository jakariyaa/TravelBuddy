"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { api } from "@/app/utils/api";

export default function Hero() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        newTripsCount: 0,
        recentUsers: [] as string[]
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.users.getSystemStats();
                if (data) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch system stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                            Connect with {stats.totalUsers > 0 ? stats.totalUsers : "thousands of"} travelers
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-text-primary dark:text-white leading-[1.1] mb-6 tracking-tight">
                            Find Your Perfect <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
                                Travel Buddy
                            </span>
                        </h1>

                        <p className="text-xl text-text-secondary dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
                            Don&apos;t travel solo if you don&apos;t want to. Match with travelers heading to your destination and create shared memories.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/find-buddy"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-primary hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20 hover:shadow-xl hover:shadow-teal-900/30 transform hover:-translate-y-1 active:scale-95 duration-200"
                            >
                                Find Travel Buddies
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/explore"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-text-primary dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-sm transform hover:-translate-y-0.5 active:scale-95 duration-200"
                            >
                                Explore Destinations
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-4 text-sm text-text-secondary dark:text-gray-400">
                            <div className="flex -space-x-4">
                                {stats.recentUsers.length > 0 ? (
                                    stats.recentUsers.slice(0, 4).map((img, i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 overflow-hidden transform hover:scale-105 hover:z-10 transition-transform cursor-pointer">
                                            <Image
                                                src={img || `https://i.pravatar.cc/100?img=${i + 10}`}
                                                alt="User"
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ))
                                ) : (
                                    [1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 overflow-hidden transform hover:scale-105 hover:z-10 transition-transform cursor-pointer">
                                            <Image
                                                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                                alt="User"
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ))
                                )}
                                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 transform hover:scale-105 hover:z-10 transition-transform cursor-pointer">
                                    {stats.totalUsers > 4 ? `+${stats.totalUsers - 4}` : "+2k"}
                                </div>
                            </div>
                            <p className="font-medium">Join our growing community</p>
                        </div>
                    </motion.div>

                    {/* Image/Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 grid grid-cols-2 gap-6 perspective-1000">
                            <div className="space-y-6 mt-16">
                                {/* Paris Card - Could be dynamic later, keep static for now as illustrative */}
                                <motion.div
                                    whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none transform rotate-[-3deg] transition-all duration-300 cursor-pointer"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Paris"
                                        width={400}
                                        height={192}
                                        className="w-full h-48 object-cover rounded-2xl mb-4"
                                        unoptimized
                                    />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-text-primary dark:text-white text-lg">Paris, France</h3>
                                            <p className="text-sm text-text-secondary dark:text-gray-400">Dec 12 - 20</p>
                                        </div>
                                        <div className="bg-teal-50 dark:bg-teal-900/30 p-2.5 rounded-full text-primary">
                                            <MapPin size={20} />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* User Card - Keep static illustrative or fetch one random */}
                                <motion.div
                                    whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none transform rotate-[2deg] transition-all duration-300 cursor-pointer"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Venice"
                                        width={400}
                                        height={128}
                                        className="w-full h-32 object-cover rounded-2xl mb-4"
                                        unoptimized
                                    />
                                    <div className="flex items-center gap-3">
                                        <Image src="https://i.pravatar.cc/100?img=32" alt="User" width={40} height={40} className="rounded-full border-2 border-white dark:border-gray-700" unoptimized />
                                        <div>
                                            <h3 className="text-base font-bold text-text-primary dark:text-white">Sarah, 24</h3>
                                            <p className="text-xs text-text-secondary dark:text-gray-400 font-medium">Traveling Solo</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="space-y-6">
                                <motion.div
                                    whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none transform rotate-[3deg] transition-all duration-300 cursor-pointer"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Travel"
                                        width={400}
                                        height={176}
                                        className="w-full h-44 object-cover rounded-2xl mb-4"
                                        unoptimized
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider rounded-full">Match Found</span>
                                        <div className="flex -space-x-3">
                                            <Image src="https://i.pravatar.cc/100?img=12" alt="User" width={32} height={32} className="rounded-full border-2 border-white dark:border-gray-800 ring-2 ring-transparent group-hover:ring-orange-200 transition-all" unoptimized />
                                            <Image src="https://i.pravatar.cc/100?img=45" alt="User" width={32} height={32} className="rounded-full border-2 border-white dark:border-gray-800" unoptimized />
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ rotate: 0, scale: 1.05 }}
                                    className="bg-gradient-to-br from-primary to-teal-700 p-8 rounded-3xl shadow-xl shadow-teal-900/20 dark:shadow-none transform rotate-[-2deg] transition-all duration-300 text-white cursor-pointer relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    <h3 className="text-4xl font-black mb-2 relative z-10">{stats.newTripsCount > 0 ? stats.newTripsCount : "500"}+</h3>
                                    <p className="text-teal-100 text-sm font-medium relative z-10 leading-snug">New trips created this week.<br />Join the adventure!</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
