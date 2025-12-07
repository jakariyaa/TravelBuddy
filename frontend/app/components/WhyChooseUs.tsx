"use client";

import { Shield, Users, Globe, Heart } from "lucide-react";

const features = [
    {
        name: "Verified Community",
        description: "Every member is verified to ensure a safe and trusted environment for all travelers.",
        icon: Shield,
    },
    {
        name: "Smart Matching",
        description: "Our algorithm connects you with travelers who share your interests and travel style.",
        icon: Users,
    },
    {
        name: "Global Reach",
        description: "Find travel buddies for destinations all around the world, from local trips to international adventures.",
        icon: Globe,
    },
    {
        name: "Shared Experiences",
        description: "Create unforgettable memories with like-minded people and make lifelong friends.",
        icon: Heart,
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-text-primary dark:text-white sm:text-4xl">Why Choose TravelBuddy?</h2>
                    <p className="mt-4 text-lg text-text-secondary dark:text-gray-400">
                        We make it easy to find the perfect companion for your next adventure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-primary mb-6">
                                <feature.icon className="h-8 w-8" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary dark:text-white mb-3">{feature.name}</h3>
                            <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
