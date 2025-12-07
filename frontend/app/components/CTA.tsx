"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary dark:bg-teal-900 rounded-3xl overflow-hidden shadow-2xl shadow-teal-900/20 dark:shadow-none relative">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />

                    <div className="relative px-8 py-16 md:py-20 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to find your travel buddy?
                        </h2>
                        <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                            Join thousands of travelers who are exploring the world together. Create your profile today and start planning your next adventure.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-primary dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg"
                            >
                                Get Started for Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white border-2 border-white/30 hover:bg-white/10 transition-all"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
