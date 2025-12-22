"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/app/utils/api";
import { Skeleton } from "@/app/components/ui/skeleton";

interface Destination {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    price: string;
    description: string;
}

export default function PopularDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await api.travelPlans.getPopularDestinations();
                if (data && data.length > 0) {
                    setDestinations(data);
                }
            } catch (error) {
                console.error("Failed to fetch popular destinations", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-12">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-96 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (destinations.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary dark:text-white sm:text-4xl">Popular Destinations</h2>
                        <p className="mt-4 text-lg text-text-secondary dark:text-gray-400">Discover the most loved places by our community.</p>
                    </div>
                    <Link href="/explore" className="hidden sm:flex items-center gap-2 text-primary hover:text-teal-700 font-medium transition-colors">
                        View all destinations <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map((destination) => (
                        <div key={destination.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                            <Link href={`/explore?destination=${encodeURIComponent(destination.name)}`}>
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={destination.image}
                                        alt={destination.name}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        unoptimized
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-sm">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-text-primary dark:text-white">{destination.rating}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-bold text-text-primary dark:text-white group-hover:text-primary transition-colors">{destination.name}</h3>
                                    </div>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm mb-4 line-clamp-2">{destination.description}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-1 text-text-secondary dark:text-gray-400 text-sm">
                                            <MapPin size={16} />
                                            <span>{destination.reviews} reviews</span>
                                        </div>
                                        <span className="text-primary font-bold">{destination.price}<span className="text-text-tertiary dark:text-gray-500 text-xs font-normal">/trip</span></span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center sm:hidden">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-primary hover:text-teal-700 font-medium transition-colors">
                        View all destinations <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
