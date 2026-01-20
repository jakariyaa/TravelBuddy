"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { api } from "@/app/utils/api";
import { Skeleton } from "@/app/components/ui/skeleton";
import { motion } from "framer-motion";

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
                    // Duplicate for seamless loop if needed, but marquee usually handles it
                    setTestimonials([...formatted, ...formatted]);
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
            <section className="py-24 bg-background overflow-hidden border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="flex gap-8 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-64 w-[400px] flex-shrink-0 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Gradient Masks for Marquee fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 relative z-20">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-text-primary dark:text-white tracking-tight">
                        Loved by Travelers
                    </h2>
                    <p className="mt-4 text-xl text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
                        Real stories from our community of explorers.
                    </p>
                </div>
            </div>

            <div className="relative flex overflow-hidden group">
                <motion.div
                    className="flex gap-8 py-4"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 40,
                            ease: "linear",
                        },
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={`${testimonial.id}-${index}`}
                            className="flex-shrink-0 w-[400px] bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm backdrop-blur-sm"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-text-secondary dark:text-gray-300 mb-8 text-lg leading-relaxed italic">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    width={56}
                                    height={56}
                                    className="rounded-full object-cover w-14 h-14 border-2 border-white dark:border-gray-700 shadow-sm"
                                    unoptimized
                                />
                                <div>
                                    <h4 className="font-bold text-text-primary dark:text-white text-lg">{testimonial.author}</h4>
                                    <p className="text-primary text-sm font-medium">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
