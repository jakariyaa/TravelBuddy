"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth + 100 : current.offsetWidth - 100;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <section className="py-24 bg-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-12">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                    <div className="flex gap-6 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-[400px] w-[300px] md:w-[400px] rounded-3xl flex-shrink-0" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (destinations.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden group/section">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-text-primary dark:text-white tracking-tight">Popular Destinations</h2>
                        <p className="mt-4 text-lg text-text-secondary dark:text-gray-400">Curated spots for your next adventure.</p>
                    </div>
                    <div className="hidden sm:flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:-mx-8 lg:px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {destinations.map((destination) => (
                        <Link
                            href={`/explore?destination=${encodeURIComponent(destination.name)}`}
                            key={destination.id}
                            className="relative flex-none w-[280px] sm:w-[350px] aspect-[3/4] rounded-3xl overflow-hidden snap-start group focus:outline-none focus:ring-4 focus:ring-primary/20"
                        >
                            <Image
                                src={destination.image}
                                alt={destination.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                unoptimized
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium text-white shadow-lg">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span>{destination.rating}</span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
                                <div className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                                    <MapPin size={14} />
                                    <span>{destination.reviews} reviews</span>
                                </div>
                                <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    {destination.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-bold text-lg">{destination.price}</span>
                                    <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Explore
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
