"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { api } from "@/app/utils/api";
import { Skeleton } from "@/app/components/ui/skeleton";

interface Testimonial {
    id: string;
    content: string;
    author: string;
    role: string;
    image: string;
    location: string;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await api.reviews.getFeatured();
                if (data && data.length > 0) {
                    const formatted = data.map((review: any) => ({
                        id: review.id,
                        content: review.comment,
                        author: review.reviewer.name,
                        role: review.reviewer.isVerified ? "Verified Traveler" : "Traveler",
                        image: review.reviewer.image || "https://i.pravatar.cc/150",
                        location: `Trip to ${review.travelPlan?.destination || "Unknown"}`,
                    }));
                    setTestimonials(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch featured reviews", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-text-primary dark:text-white sm:text-4xl">
                        Travelers Love Us
                    </h2>
                    <p className="mt-4 text-xl text-text-secondary dark:text-gray-400">
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
                            <p className="text-text-secondary dark:text-gray-400 mb-8 leading-relaxed">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover w-12 h-12"
                                    unoptimized
                                />
                                <div>
                                    <h4 className="font-bold text-text-primary dark:text-white">{testimonial.author}</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
