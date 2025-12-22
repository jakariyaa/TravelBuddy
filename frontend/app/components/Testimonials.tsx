"use client";

import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        content: "I was planning a solo trip to Japan but was nervous about the language barrier. I found Kenji on TravelBuddy, and we had an amazing time exploring Tokyo together!",
        author: "Sarah Jenkins",
        role: "Solo Traveler",
        image: "https://i.pravatar.cc/100?img=5",
        location: "Trip to Japan",
    },
    {
        content: "Found a group of hikers for my Patagonia trek. It turned out to be the best adventure of my life. Highly recommend for anyone looking for adventure buddies.",
        author: "Marcus Chen",
        role: "Adventure Seeker",
        image: "https://i.pravatar.cc/100?img=11",
        location: "Trip to Patagonia",
    },
    {
        content: "Great platform! Connected with a fellow digital nomad in Bali. We shared a villa and coworking space, which saved costs and made the trip so much more fun.",
        author: "Elena Rodriguez",
        role: "Digital Nomad",
        image: "https://i.pravatar.cc/100?img=9",
        location: "Trip to Bali",
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
                        Travelers Love Us
                    </h2>
                    <p className="mt-4 text-xl text-text-secondary">
                        See what our community has to say about their experiences.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex gap-1 text-yellow-400 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-text-secondary mb-8 leading-relaxed">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                    unoptimized
                                />
                                <div>
                                    <h4 className="font-bold text-text-primary">{testimonial.author}</h4>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
