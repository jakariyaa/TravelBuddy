"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Briefcase } from "lucide-react";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />
            <main className="grow pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Join Our Team
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            Help us shape the future of travel. We&apos;re looking for passionate individuals to join us on this adventure.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            { title: "Remote First", desc: "Work from anywhere in the world. We believe in freedom and flexibility." },
                            { title: "Travel Credits", desc: "Annual stipend to explore new destinations and use our platform." },
                            { title: "Health & Wellness", desc: "Comprehensive coverage to keep you healthy and happy." }
                        ].map((benefit, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Openings Right Now</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                            We don&apos;t have any specific roles open at the moment, but we&apos;re always looking for talented people. Check back soon!
                        </p>
                        <a href="/contact" className="inline-block px-8 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors">
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
