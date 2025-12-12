"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/app/utils/api";
import { useSession } from "@/app/utils/auth-client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TravelPlanCard from "@/app/components/TravelPlanCard";
import { Loader2, Search, Filter, Calendar, Type, Globe, Compass, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TravelPlan } from "@/app/types";

export default function ExplorePage() {
    const { data: session } = useSession();

    // Main List State
    const [plans, setPlans] = useState<TravelPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Recommended List State
    const [recommendedPlans, setRecommendedPlans] = useState<TravelPlan[]>([]);

    // Search Filters
    const [destination, setDestination] = useState("");
    const [travelType, setTravelType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [interests, setInterests] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Fetch Recommended Plans
    useEffect(() => {
        const fetchRecommended = async () => {
            if (session?.user) {
                try {

                    // Get latest profile to ensure we have interests
                    const profile = await api.users.getProfile();

                    if (profile && profile.travelInterests && profile.travelInterests.length > 0) {
                        const params = new URLSearchParams();
                        params.append('interests', profile.travelInterests.join(','));
                        // keep limit for recommendations as we don't want to show ALL recommendations 
                        // (conceptually different from main list)
                        params.append('limit', '3');

                        // We use the search endpoint which supports interest matching
                        const query = params.toString();
                        const data = await api.travelPlans.search(query);
                        // Filter out plans created by the user themselves if desired, 
                        // but search endpoint might natively return them.
                        // Ideally recommendations shouldn't be your own plans. 
                        // Client-side filter for now:
                        const filtered = (data as TravelPlan[]).filter((p) => p.userId !== session.user.id && p.status !== 'COMPLETED');
                        setRecommendedPlans(filtered);
                    } else {
                        // Fallback: Fetch any plans (recent), exclude own, shuffle
                        const data = await api.travelPlans.search('');
                        const filtered = (data as TravelPlan[]).filter((p) => p.userId !== session.user.id && p.status !== 'COMPLETED');
                        // Shuffle to give "random" recommendations
                        const shuffled = filtered.sort(() => 0.5 - Math.random());
                        setRecommendedPlans(shuffled.slice(0, 3));
                    }
                } catch (e) {
                    console.error("Failed to fetch recommendations", e);
                }
            }
        };

        fetchRecommended();
    }, [session]);

    const fetchPlans = useCallback(async () => {
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

            // api.travelPlans.search handles query string appending generally
            // If queryString is empty, search endpoint will return all with defaults
            const data = await api.travelPlans.search(queryString);

            setPlans(data as TravelPlan[]);

        } catch (err) {
            setError("Failed to load travel plans");
        } finally {
            setIsLoading(false);
        }
    }, [destination, travelType, startDate, endDate, interests]); // Dependencies

    useEffect(() => {
        // Initial load
        fetchPlans();
    }, [fetchPlans]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPlans(); // Reset on filter change
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchPlans]);

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

    // Check for active filters
    const hasActiveFilters = Boolean(destination || travelType || startDate || endDate || interests);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />

            <main className="grow pt-16 pb-12">
                {/* Hero Section */}
                <div className="relative bg-white dark:bg-gray-900 pb-16 pt-8 mb-12">
                    {/* Background Elements - Clipped */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 opacity-70"></div>
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
                    </div>

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
                                <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-purple-600">Travel Companion</span>
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
                                        onChange={(e) => { 
                                            e.preventDefault();
                                            return setDestination(e.target.value) 
                                        }}
                                        className="w-full bg-transparent border-none text-lg py-2 px-4 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:outline-none ring-0 focus:ring-0 appearance-none shadow-none"
                                    />

                                    {/* Filter Toggle Button inside Search Bar */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`mr-2 p-2 rounded-full transition-colors ${showFilters
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        title="Filters"
                                    >
                                        <Filter size={20} />
                                    </button>

                                    <button
                                        className="bg-primary hover:bg-teal-700 text-white p-3 rounded-full transition-colors shrink-0"
                                        onClick={() => fetchPlans()}
                                    >
                                        <Search size={24} />
                                    </button>
                                </div>

                                {/* Filter Popover */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 text-left"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                        <Type size={16} className="text-primary" /> Travel Type
                                                    </label>
                                                    <select
                                                        value={travelType}
                                                        onChange={(e) => setTravelType(e.target.value)}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all cursor-pointer hover:bg-white"
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
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all outline-none focus:outline-none appearance-none shadow-none"
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
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all outline-none focus:outline-none appearance-none shadow-none"
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
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white transition-all outline-none focus:outline-none appearance-none shadow-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <button
                                                    onClick={() => {
                                                        setDestination("");
                                                        setTravelType("");
                                                        setInterests("");
                                                        setStartDate("");
                                                        setEndDate("");
                                                        setShowFilters(false);
                                                    }}
                                                    className="text-sm text-gray-500 hover:text-red-500 font-medium px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                    {/* Recommended Section (Logged-in only) - Hides on search */}
                    <AnimatePresence>
                        {session?.user && recommendedPlans.length > 0 && !hasActiveFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-16 border-b border-gray-200 dark:border-gray-800 pb-12 overflow-hidden"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Sparkles className="text-amber-500" size={24} />
                                    Recommended for You
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recommendedPlans.map((plan) => (
                                        <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <TravelPlanCard plan={plan} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filters & Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Compass className="text-primary" size={28} />
                            Explore Trips
                        </h2>
                    </div>



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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong.</h3>
                            <p className="text-gray-500 mb-6">{error}</p>
                            <button
                                onClick={() => fetchPlans()}
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
                                We couldn&apos;t find any travel plans matching your current filters. Try adjusting your search or explore all available trips.
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
                        <>
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
                            <div className="h-8"></div>
                        </>
                    )}
                </div>
            </main >
            <Footer />
        </div >
    );
}
