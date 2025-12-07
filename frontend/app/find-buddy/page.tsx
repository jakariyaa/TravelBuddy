"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import { Search, MapPin, Filter, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FindBuddyPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const commonInterests = ["Hiking", "Food", "Photography", "History", "Beach", "Nightlife", "Nature", "Art"];

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await api.users.search(searchQuery, selectedInterests);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedInterests]);

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <Navbar />

            {/* Header & Search */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-24 pb-12 px-4 shadow-sm">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-white mb-4">Find Your Travel Buddy</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-lg">Connect with travelers heading your way or sharing your passions.</p>
                    </div>

                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, location, or bio..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg transition-all"
                        />
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isFilterOpen ? 'text-primary bg-primary/10' : 'text-gray-500'}`}
                        >
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Filters */}
                    <motion.div
                        initial={false}
                        animate={{ height: isFilterOpen ? 'auto' : 0, opacity: isFilterOpen ? 1 : 0 }}
                        className="overflow-hidden max-w-2xl mx-auto"
                    >
                        <div className="pt-2 pb-4">
                            <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-3">Filter by Interests:</p>
                            <div className="flex flex-wrap gap-2">
                                {commonInterests.map((interest) => (
                                    <button
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedInterests.includes(interest)
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-white dark:bg-gray-700 text-text-secondary dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-primary/50'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <Link key={user.id} href={`/profile/${user.id}`} className="group">
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
                                >
                                    <div className="relative h-32 bg-gradient-to-r from-primary/10 to-teal-500/10 dark:from-gray-700 dark:to-gray-600">
                                        <div className="absolute -bottom-10 left-6">
                                            <img
                                                src={user.image || "https://i.pravatar.cc/150?img=68"}
                                                alt={user.name}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-text-primary dark:text-white group-hover:text-primary transition-colors">{user.name}</h3>
                                                {user.isVerified && (
                                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">Verified Traveler</span>
                                                )}
                                            </div>
                                        </div>

                                        {user.currentLocation && (
                                            <div className="flex items-center gap-1.5 text-text-secondary dark:text-gray-400 text-sm mb-4">
                                                <MapPin size={14} className="text-primary" />
                                                {user.currentLocation}
                                            </div>
                                        )}

                                        <p className="text-text-secondary dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
                                            {user.bio || "No bio yet."}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5">
                                            {user.travelInterests?.slice(0, 3).map((interest: string, i: number) => (
                                                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                                                    {interest}
                                                </span>
                                            ))}
                                            {user.travelInterests?.length > 3 && (
                                                <span className="text-xs px-2 py-1 text-gray-400">+{user.travelInterests.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">No travelers found</h3>
                        <p className="text-text-secondary dark:text-gray-400">Try adjusting your search or filters to find more people.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
