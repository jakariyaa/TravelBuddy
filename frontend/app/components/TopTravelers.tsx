"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, UserPlus, BadgeCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { api } from "@/app/utils/api";
import { useSession } from "@/app/utils/auth-client";

const defaultTravelers = [
    {
        id: "default-1",
        name: "Sarah Jenkins",
        image: "https://i.pravatar.cc/150?img=32",
        location: "New York, USA",
        trips: 45,
        rating: 4.9,
        isVerified: true,
        bio: "Adventure seeker and photography enthusiast. Always looking for the next mountain to climb."
    },
    {
        id: "default-2",
        name: "David Chen",
        image: "https://i.pravatar.cc/150?img=11",
        location: "Vancouver, Canada",
        trips: 32,
        rating: 4.8,
        bio: "Foodie traveler exploring the world one dish at a time. Let's find the best street food!"
    },
    {
        id: "default-3",
        name: "Elena Rodriguez",
        image: "https://i.pravatar.cc/150?img=5",
        location: "Barcelona, Spain",
        trips: 28,
        rating: 5.0,
        isVerified: true,
        bio: "Digital nomad loving the beach life. Expert in finding the best coworking spots with a view."
    },
    {
        id: "default-4",
        name: "Michael Chang",
        image: "https://i.pravatar.cc/150?img=59",
        location: "Singapore",
        trips: 56,
        rating: 4.7,
        bio: "History buff and architecture lover. I plan detailed itineraries for cultural immersion."
    }
];

export default function TopTravelers() {
    const { data: session } = useSession();
    const [displayTravelers, setDisplayTravelers] = useState<any[]>(defaultTravelers);
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (session?.user) {
                try {
                    const matches = await api.users.getMatches();
                    if (matches && matches.length > 0) {
                        setDisplayTravelers(matches.slice(0, 4));
                        setIsPersonalized(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch recommendations:", error);
                }
            }
        };

        fetchRecommendations();
    }, [session]);

    return (
        <section className="py-24 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-text-primary dark:text-white sm:text-4xl flex items-center justify-center gap-3">
                        {isPersonalized ? (
                            <>
                                <Sparkles className="text-primary" />
                                Recommended for You
                            </>
                        ) : (
                            "Connect with Top Travelers"
                        )}
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary dark:text-gray-400">
                        {isPersonalized
                            ? "Based on your interests and travel style, we think you'll get along great with these travelers."
                            : "Find experienced travel buddies who share your passion for exploration."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayTravelers.map((traveler) => (
                        <div key={traveler.id} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                            <div className="relative inline-block mb-4 mx-auto">
                                <img
                                    src={traveler.image || `https://i.pravatar.cc/150?u=${traveler.id}`}
                                    alt={traveler.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                                />
                                {traveler.rating && (
                                    <div className="absolute bottom-0 right-0 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                                        <Star size={10} className="fill-current" />
                                        {traveler.rating}
                                    </div>
                                )}
                                {isPersonalized && traveler.score && (
                                    <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                                        <span className="text-[10px]">Match</span>
                                        {traveler.score}%
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1 flex items-center justify-center gap-1">
                                {traveler.name}
                                {traveler.isVerified && <BadgeCheck size={18} className="text-blue-500 fill-blue-500/10" />}
                            </h3>

                            <div className="flex items-center justify-center gap-1 text-text-secondary dark:text-gray-400 text-sm mb-3">
                                <MapPin size={14} />
                                {traveler.location || traveler.currentLocation || "Location Unknown"}
                            </div>

                            {/* Bio or Interests */}
                            <div className="text-text-secondary dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
                                {isPersonalized && traveler.sharedInterests ? (
                                    <span>
                                        Shares interests in <strong className="text-primary">{traveler.sharedInterests.slice(0, 3).join(", ")}</strong>
                                    </span>
                                ) : (
                                    `"${traveler.bio || "Ready to explore the world!"}"`
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                                <span className="font-semibold text-text-primary dark:text-white">
                                    {traveler.trips || 0} <span className="font-normal text-text-secondary dark:text-gray-400">Trips</span>
                                </span>
                                <Link href={`/profile/${traveler.id}`} className="text-primary hover:text-teal-700 font-medium flex items-center gap-1 transition-colors">
                                    <UserPlus size={16} />
                                    Connect
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/explore"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-teal-800 transition-all shadow-lg shadow-teal-900/20 dark:shadow-none"
                    >
                        Find Your Buddy
                    </Link>
                </div>
            </div>
        </section>
    );
}
