"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TravelPlanCard from "../components/TravelPlanCard";
import { Loader2, Plus, Search, Filter } from "lucide-react";
import { useSession } from "../lib/auth-client";

export default function TravelPlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { data: session } = useSession();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await api.travelPlans.getMyPlans();
                setPlans(data);
            } catch (err) {
                setError("Failed to load your travel plans");
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchPlans();
        } else {
            setIsLoading(false);
        }
    }, [session]);

    if (!session) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-4">My Travel Plans</h1>
                    <p className="text-text-secondary dark:text-gray-400 mb-6">Please login to view your travel plans.</p>
                    <Link href="/login" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-teal-800 transition-colors">
                        Login
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary dark:text-white">My Travel Plans</h1>
                        <p className="text-text-secondary dark:text-gray-400 mt-1">Manage your upcoming adventures</p>
                    </div>

                    <Link
                        href="/travel-plans/add"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 dark:shadow-none"
                    >
                        <Plus size={20} className="mr-2" />
                        Create Plan
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : plans.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-text-secondary dark:text-gray-400 text-lg mb-4">You haven't created any travel plans yet.</p>
                        <Link href="/travel-plans/add" className="text-primary font-bold hover:underline inline-block">
                            Start planning your first trip!
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <TravelPlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
