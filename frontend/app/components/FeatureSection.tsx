"use client";

import { UserPlus, Map, Users } from "lucide-react";

const features = [
    {
        name: "Create Profile",
        description: "Sign up and build your traveler profile. Share your interests, travel style, and past adventures.",
        icon: UserPlus,
    },
    {
        name: "Plan Your Trip",
        description: "Post your upcoming travel plans. Specify dates, destination, and what kind of buddy you're looking for.",
        icon: Map,
    },
    {
        name: "Find a Buddy",
        description: "Browse matched travelers heading to the same place. Connect, chat, and start your journey together.",
        icon: Users,
    },
];

export default function FeatureSection() {
    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-primary tracking-wide uppercase">How It Works</h2>
                    <p className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
                        Start your shared adventure in 3 simple steps
                    </p>
                    <p className="mt-4 text-xl text-text-secondary">
                        We make it easy to find compatible travel companions for your next trip.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div key={feature.name} className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-teal-50 to-orange-50 dark:from-teal-900/20 dark:to-orange-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex flex-col items-center text-center">
                                <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="h-10 w-10" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.name}</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    {feature.description}
                                </p>

                                {index < features.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10 transform translate-x-1/2">
                                        <div className="absolute right-0 -top-1 h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
