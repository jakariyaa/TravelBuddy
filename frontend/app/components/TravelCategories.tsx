"use client";

import { Mountain, Palmtree, Building2, Tent, Camera, Utensils, Globe } from "lucide-react";
import Link from "next/link";

const categories = [
    { name: "All", icon: Globe, count: "1000+" },
    { name: "Adventure", icon: Mountain, count: "250+" },
    { name: "Beach", icon: Palmtree, count: "180+" },
    { name: "City Break", icon: Building2, count: "320+" },
    { name: "Camping", icon: Tent, count: "120+" },
    { name: "Photography", icon: Camera, count: "90+" },
    { name: "Foodie", icon: Utensils, count: "200+" },
];

export default function TravelCategories() {
    return (
        <section className="py-12 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <span className="text-sm font-bold text-text-secondary dark:text-gray-400 whitespace-nowrap uppercase tracking-wider mr-4">
                        Browse by Interest:
                    </span>
                    {categories.map((category) => (
                        <Link
                            href={`/explore?category=${category.name === "All" ? "" : category.name}`}
                            key={category.name}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary transition-colors whitespace-nowrap shadow-sm"
                        >
                            <category.icon size={18} />
                            <span className="font-medium text-sm">{category.name}</span>
                            <span className="text-xs text-text-tertiary dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                {category.count}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
