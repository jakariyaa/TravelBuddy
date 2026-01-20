"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Users, Globe, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />
            <main className="grow pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                            About Travner
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            We are on a mission to connect travelers worldwide, fostering friendships and shared adventures.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center mb-24">
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Community First</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Building a safe and inclusive community for travelers of all backgrounds.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Global Reach</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Connecting explorers across continents, from local gems to world wonders.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Shared Passion</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Fueled by the love of travel and the joy of discovering new places together.
                            </p>
                        </div>
                    </div>

                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet the Creator</h2>
                        <div className="flex justify-center">
                            {[
                                { name: "Jakariya Abbas", role: "Founder & Lead Developer", image: "https://i.pravatar.cc/150?img=11" }
                            ].map((member, i) => (
                                <div key={i} className="text-center group">
                                    <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                                    <p className="text-primary font-medium">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to start your journey?</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of travelers who have found their perfect travel companions on Travner.
                        </p>
                        <a href="/register" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700 transition-colors">
                            Join Today
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
