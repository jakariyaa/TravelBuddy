"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TravelPlanCard from "../components/TravelPlanCard";
import { Loader2, Search, Filter, MapPin, Calendar, Type } from "lucide-react";
import { useSession } from "../lib/auth-client";

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
        // Initial fetch
        fetchPlans();
    }, []);

    // Debounced search for destination and interests
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPlans();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [destination, travelType, startDate, endDate, interests]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-text-primary dark:text-white mb-4">Explore Travelers</h1>
                    <p className="text-text-secondary dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover amazing trips, find your perfect travel buddy, and explore the world together.
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Where do you want to go?"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center px-6 py-3 border rounded-xl font-medium transition-colors ${showFilters ? 'bg-primary/5 border-primary text-primary dark:bg-primary/20' : 'border-gray-200 dark:border-gray-700 text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <Filter size={20} className="mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">Travel Type</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        value={travelType}
                                        onChange={(e) => setTravelType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white dark:bg-gray-900 dark:text-white"
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">Interests</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. hiking, food"
                                        value={interests}
                                        onChange={(e) => setInterests(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">Start Date (After)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">End Date (Before)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : plans.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-text-secondary dark:text-gray-400 text-lg mb-4">No travel plans found matching your criteria.</p>
                        <button
                            onClick={() => {
                                setDestination("");
                                setTravelType("");
                                setStartDate("");
                                setEndDate("");
                            }}
                            className="text-primary font-bold hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <TravelPlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
