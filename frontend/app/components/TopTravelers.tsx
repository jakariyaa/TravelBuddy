"use client";

import { useEffect, useState } from "react";
import { Star, UserPlus, BadgeCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/app/utils/api";
import { useSession } from "@/app/utils/auth-client";

interface Traveler {
    id: string;
    name: string;
    image?: string;
    location?: string;
    trips: number;
    rating?: number;
    isVerified?: boolean;
    bio?: string;
    score?: number;
    sharedInterests?: string[];
    currentLocation?: string;
}

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
    const [displayTravelers, setDisplayTravelers] = useState<Traveler[]>(defaultTravelers);
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (session?.user) {
                try {
                    const matches = await api.users.getMatches();
                    if (matches && matches.length > 0) {
                        const mappedTravelers: Traveler[] = matches.slice(0, 4).map(m => ({
                            id: m.id,
                            name: m.name,
                            image: m.image,
                            location: m.currentLocation || "Unknown",
                            trips: m.travelPlans?.length || 0,
                            rating: 0, // MatchedUser doesn't have rating yet in this context
                            isVerified: m.isVerified,
                            bio: m.bio,
                            score: m.matchPercentage,
                            sharedInterests: m.sharedInterests,
                            currentLocation: m.currentLocation
                        }));
                        setDisplayTravelers(mappedTravelers);
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
        <section className="py-20 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayTravelers.map((traveler) => (
                        <div key={traveler.id} className="group bg-white dark:bg-gray-900 rounded-2xl p-5 hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full relative">
                            {/* Header: Photo & Match Indicator */}
                            <div className="flex flex-col items-center mb-3 relative">
                                <div className="relative">
                                    <Image
                                        src={traveler.image || `https://i.pravatar.cc/150?u=${traveler.id}`}
                                        alt={traveler.name}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0"
                                        unoptimized
                                    />
                                    {/* Match Badge for Personalized View */}
                                    {/* Match Badge for Personalized View */}
                                    {isPersonalized && (traveler.score || 0) > 0 && (
                                        <div className="absolute -bottom-2 -right-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[8px] font-bold px-1 rounded-full shadow-sm flex items-center gap-0.5 z-10 whitespace-nowrap">
                                            {traveler.score}%
                                        </div>
                                    )}
                                    {/* Rating for Default View */}
                                    {!isPersonalized && traveler.rating && (
                                        <div className="absolute -right-1 bottom-0 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm border border-white dark:border-gray-800">
                                            <Star size={8} className="fill-current" />
                                            {traveler.rating}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Body: Name, Location, Interests */}
                            <div className="text-center flex-grow flex flex-col items-center">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight flex items-center justify-center gap-1 mb-1">
                                    {traveler.name}
                                    {traveler.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-blue-500/10" />}
                                </h3>

                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                                    {traveler.location || traveler.currentLocation || "Location Unknown"}
                                </div>

                                {/* Interest Chips or Bio */}
                                <div className="w-full mb-4">
                                    {isPersonalized && traveler.sharedInterests ? (
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {traveler.sharedInterests.slice(0, 3).map((interest: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className={`
                                                        px-2.5 py-1 rounded-full text-[11px] font-medium 
                                                        ${['nature', 'hiking', 'outdoors'].some(k => interest.toLowerCase().includes(k))
                                                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                                            : ['beach', 'sea', 'ocean'].some(k => interest.toLowerCase().includes(k))
                                                                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300'
                                                                : 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                                                        }
                                                    `}
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 px-2">
                                            &quot;{traveler.bio || "Ready to explore the world!"}&quot;
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer: Action */}
                            <div className="pt-3 mt-1 border-t border-gray-100 dark:border-gray-800 w-full flex items-center justify-between">
                                {/* Hide Trips if 0 or irrelevant in personalized view unless user wants it. 
                                    User said "Hide '0 Trips' unless meaningful". 
                                    Let's show it only if > 0.
                                */}
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {traveler.trips > 0 && (
                                        <span>{traveler.trips} Trips</span>
                                    )}
                                </div>

                                <Link
                                    href={isPersonalized ? `/profile/${traveler.id}` : `/login`}
                                    className="text-sm font-semibold text-primary hover:text-teal-700 flex items-center gap-1.5 transition-colors ml-auto"
                                >
                                    <UserPlus size={14} />
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
