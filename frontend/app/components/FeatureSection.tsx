"use client";

import { UserPlus, Map, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/app/utils/auth-client";

export default function FeatureSection() {
    const { data: session } = useSession();
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-4xl font-bold text-text-primary dark:text-white tracking-tight mb-6">
                        Start your shared adventure.<br />
                        <span className="text-primary opacity-80">Simple. Secure. Social.</span>
                    </h2>
                    <p className="text-xl text-text-secondary dark:text-gray-400">
                        We've reimagined how travelers connect. No more solo trips unless you want them.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                    {/* Large Featured Block */}
                    <div className="md:col-span-2 row-span-1 md:row-span-2 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 dark:to-gray-800 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group border border-primary/10">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
                            <Map size={240} />
                        </div>

                        <div className="relative z-10 w-fit p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm mb-6">
                            <Map className="h-8 w-8 text-primary" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-text-primary dark:text-white mb-4">Plan Your Trip</h3>
                            <p className="text-text-secondary dark:text-gray-300 text-lg mb-8 max-w-md">
                                Post your upcoming travel plans with detailed interest tags. Specify dates, destination, and what kind of buddy you're looking for.
                            </p>
                            <Link href={session?.user ? "/travel-plans/add" : "/login"} className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                                Create a Plan <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Secondary Block 1 */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                        <div className="absolute top-6 right-6 p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <UserPlus className="h-6 w-6 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">Create Profile</h3>
                        <p className="text-text-secondary dark:text-gray-400">
                            Build a profile that showcases your travel style and past adventures.
                        </p>
                    </div>

                    {/* Secondary Block 2 */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                        <div className="absolute top-6 right-6 p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Users className="h-6 w-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">Find a Buddy</h3>
                        <p className="text-text-secondary dark:text-gray-400">
                            Browse matched travelers heading to the same place. Connect instantly.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
