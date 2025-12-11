"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/app/utils/api";
import { MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Skeleton } from "./Skeleton";

export default function MatchedTravelers() {
    const [matches, setMatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await api.users.getMatches();
                setMatches(data);
            } catch (error) {
                console.error("Failed to fetch matches", error);
                // Don't toast error here to avoid annoying user if just no matches or minor net glich
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (matches.length === 0) {
        return null; // Hide section if no matches found to keep dashboard clean
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} />
                <h2 className="text-xl font-bold text-text-primary dark:text-white">Recommended Travelers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.slice(0, 4).map((user) => (
                    <Link key={user.id} href={`/profile/${user.id}`} className="group block">
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={user.image || "https://i.pravatar.cc/150?img=68"}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-text-primary dark:text-white truncate max-w-[150px] group-hover:text-primary transition-colors">
                                            {user.name}
                                        </h3>
                                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {user.score}% Match
                                        </span>
                                    </div>
                                    {user.currentLocation && (
                                        <div className="flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400 mt-0.5">
                                            <MapPin size={12} />
                                            <span className="truncate">{user.currentLocation}</span>
                                        </div>
                                    )}
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {user.sharedInterests.slice(0, 2).map((interest: string, i: number) => (
                                            <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                                {interest}
                                            </span>
                                        ))}
                                        {user.sharedInterests.length > 2 && (
                                            <span className="text-[10px] text-gray-400 px-1">+{user.sharedInterests.length - 2}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
