"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TravelPlanCard from "../components/TravelPlanCard";
import { Loader2, Search, Filter, Calendar, Type, Globe, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplorePage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Search Filters
    const [destination, setDestination] = useState("");
    const [travelType, setTravelType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [interests, setInterests] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams();
            if (destination) params.append("destination", destination);
            if (travelType) params.append("travelType", travelType);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            if (interests) params.append("interests", interests);

            const queryString = params.toString();
            const data = queryString
                ? await api.travelPlans.search(queryString)
                : await api.travelPlans.getAll();

            setPlans(data);
        } catch (err) {
            setError("Failed to load travel plans");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPlans();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [destination, travelType, startDate, endDate, interests]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-24 pb-12">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-white dark:bg-gray-900 pb-16 pt-8 mb-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 opacity-70"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                    <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                                Discover the World Together
                            </span>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                                Find Your Perfect <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Travel Companion</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                                Join thousands of travelers sharing adventures. Connect, plan, and explore destinations with people who match your vibe.
                            </p>

                            {/* Search Bar - Hero Style */}
                            <div className="relative max-w-2xl mx-auto">
                                <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-gray-700 flex items-center group focus-within:ring-4 focus-within:ring-primary/20 transition-all duration-300">
                                    <div className="pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Search size={24} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Where do you want to go?"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full bg-transparent border-none focus:ring-0 text-lg py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400"
                                    />
                                    <button
                                        className="bg-primary hover:bg-teal-700 text-white p-3 rounded-full transition-colors flex-shrink-0"
                                        onClick={fetchPlans}
                                    >
                                        <Search size={24} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Filters & Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Compass className="text-primary" size={28} />
                            Explore Trips
                            <span className="text-sm font-normal text-gray-500 ml-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                {plans.length} results
                            </span>
                        </h2>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border ${showFilters
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary/50 hover:shadow-sm'
                                }`}
                        >
                            <Filter size={18} />
                            <span>Filters</span>
                            {showFilters ? (
                                <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ml-1">×</span>
                            ) : (
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs w-5 h-5 flex items-center justify-center rounded-full ml-1">+</span>
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-10"
                            >
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Type size={16} className="text-primary" /> Travel Type
                                            </label>
                                            <select
                                                value={travelType}
                                                onChange={(e) => setTravelType(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all cursor-pointer hover:bg-white"
                                            >
                                                <option value="">Any Type</option>
                                                <option value="Solo">Solo</option>
                                                <option value="Couple">Couple</option>
                                                <option value="Family">Family</option>
                                                <option value="Friends">Friends</option>
                                                <option value="Business">Business</option>
                                                <option value="Backpacking">Backpacking</option>
                                                <option value="Luxury">Luxury</option>
                                                <option value="Adventure">Adventure</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Globe size={16} className="text-primary" /> Interests
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Hiking, Food..."
                                                value={interests}
                                                onChange={(e) => setInterests(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Calendar size={16} className="text-primary" /> Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Calendar size={16} className="text-primary" /> End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setDestination("");
                                                setTravelType("");
                                                setInterests("");
                                                setStartDate("");
                                                setEndDate("");
                                            }}
                                            className="text-sm text-gray-500 hover:text-red-500 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Grid */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="animate-spin text-primary mb-4" size={48} />
                            <p className="text-gray-500 font-medium">Finding amazing trips...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
                            <p className="text-gray-500 mb-6">{error}</p>
                            <button
                                onClick={fetchPlans}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : plans.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm mx-auto max-w-2xl"
                        >
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="text-gray-300 dark:text-gray-600" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No trips found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                                We couldn't find any travel plans matching your current filters. Try adjusting your search or explore all available trips.
                            </p>
                            <button
                                onClick={() => {
                                    setDestination("");
                                    setTravelType("");
                                    setStartDate("");
                                    setEndDate("");
                                    setInterests("");
                                }}
                                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
                            >
                                Clear Filters & Show All
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {plans.map((plan) => (
                                <motion.div key={plan.id} variants={itemVariants} layout>
                                    <TravelPlanCard plan={plan} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
