"use client";

import Link from "next/link";
import { Calendar, MapPin, User, DollarSign, BadgeCheck } from "lucide-react";

interface TravelPlanCardProps {
    plan: any;
}

export default function TravelPlanCard({ plan }: TravelPlanCardProps) {
    const startDate = new Date(plan.startDate).toLocaleDateString();
    const endDate = new Date(plan.endDate).toLocaleDateString();

    return (
        <Link href={`/travel-plans/${plan.id}`} className="block group">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={plan.images?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={plan.destination}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                        {plan.travelType}
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        {plan.user?.image && (<img
                            src={plan.user?.image}
                            alt={plan.user?.name}
                            className="w-6 h-6 rounded-full object-cover"
                        />)}
                        <span className="text-xs text-text-secondary dark:text-gray-400 font-medium flex items-center gap-1">
                            {plan.user?.name}
                            {plan.user?.isVerified && <BadgeCheck size={14} className="text-blue-500 fill-blue-500/10" />}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {plan.destination}
                    </h3>

                    <div className="space-y-2 text-sm text-text-secondary dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary/70" />
                            <span>{startDate} - {endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-primary/70" />
                            <span>${plan.budget}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
