"use client";

import { MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const destinations = [
    {
        id: 1,
        name: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviews: 1240,
        price: "$800",
        description: "Tropical paradise with beautiful beaches and vibrant culture."
    },
    {
        id: 2,
        name: "Kyoto, Japan",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviews: 850,
        price: "$1200",
        description: "Ancient temples, traditional tea houses, and stunning gardens."
    },
    {
        id: 3,
        name: "Santorini, Greece",
        image: "https://cdn.sanity.io/images/nxpteyfv/goguides/9ca4581e7f31535984243dfa9c08c12c8a30ffeb-1600x1066.jpg",
        rating: 4.7,
        reviews: 980,
        price: "$1500",
        description: "Iconic white buildings with blue domes overlooking the sea."
    },
    {
        id: 4,
        name: "Machu Picchu, Peru",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviews: 2100,
        price: "$1100",
        description: "Incan citadel set high in the Andes Mountains."
    }
];

export default function PopularDestinations() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
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
