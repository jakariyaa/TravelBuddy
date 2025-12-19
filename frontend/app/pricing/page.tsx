"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { api } from "@/app/utils/api";
import { useSession } from "@/app/utils/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { createCheckoutSessionSchema } from "@/app/schemas/paymentSchemas";

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<'monthly' | 'yearly' | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
        if (!session) {
            router.push("/login?redirect=/pricing");
            return;
        }

        // Zod Validation
        const result = createCheckoutSessionSchema.safeParse({ plan });
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        setIsLoading(plan);
        try {
            const { url } = await api.payments.createCheckoutSession(plan);
            if (url) {
                window.location.href = url;
            } else {
                toast.error("Failed to start checkout");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to create checkout session");
        } finally {
            setIsLoading(null);
        }
    };

    const features = [
        "Verified Traveler Badge",
        "Unlimited Join Requests",
        "Priority Matching",
        "Access to Premium Trips",
        "Ad-free Experience"
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4 inline-block">
                                Premium Membership
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Elevate Your Travel Experience
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Get verified, find better matches, and unlock exclusive features with TravelBuddy Premium.
                            </p>
                        </motion.div>

                        <div className="mt-8 flex justify-center items-center gap-4">
                            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${billingCycle === 'yearly' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`} />
                            </button>
                            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                Yearly <span className="text-primary text-xs ml-1 font-bold">SAVE 20%</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Essential features to get started.</p>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <Check size={20} className="text-primary" />
                                    <span>Basic Profile</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <Check size={20} className="text-primary" />
                                    <span>3 Active Join Requests</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <Check size={20} className="text-primary" />
                                    <span>View Public Trips</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => router.push('/register')}
                                className="w-full py-3 px-6 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors mt-auto"
                            >
                                Get Started
                            </button>
                        </motion.div>

                        {/* Premium Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col h-full bg-yellow-50 dark:bg-black rounded-3xl p-8 shadow-xl relative overflow-hidden border border-gray-200 dark:border-gray-800"
                        >
                            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Premium</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">For the serious traveler.</p>
                            <div className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                                ${billingCycle === 'monthly' ? '9.99' : '99.00'}
                                <span className="text-lg text-gray-500 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="bg-primary/20 p-1 rounded-full">
                                            <Check size={14} className="text-primary" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSubscribe(billingCycle)}
                                disabled={isLoading !== null}
                                className="mt-auto w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading === billingCycle ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    "Subscribe Now"
                                )}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
