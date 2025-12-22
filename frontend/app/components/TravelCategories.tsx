"use client";

import { Mountain, Palmtree, Building2, Tent, Camera, Utensils } from "lucide-react";
import Link from "next/link";

const categories = [
    {
        name: "Adventure",
        icon: Mountain,
        count: "250+ trips",
        color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
    {
        name: "Beach",
        icon: Palmtree,
        count: "180+ trips",
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
        name: "City Break",
        icon: Building2,
        count: "320+ trips",
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
        name: "Camping",
        icon: Tent,
        count: "120+ trips",
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
        name: "Photography",
        icon: Camera,
        count: "90+ trips",
        color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    },
    {
        name: "Foodie",
        icon: Utensils,
        count: "200+ trips",
        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
];

export default function TravelCategories() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-text-primary dark:text-white sm:text-4xl">Browse by Category</h2>
                    <p className="mt-4 text-lg text-text-secondary dark:text-gray-400">
                        Find the perfect trip based on your interests and travel style.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category) => (
                        <Link
                            href={`/explore?category=${category.name}`}
                            key={category.name}
                            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
                        >
                            <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${category.color}`}>
                                <category.icon className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-text-primary dark:text-white mb-1">{category.name}</h3>
                            <p className="text-xs text-text-secondary dark:text-gray-400">{category.count}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
