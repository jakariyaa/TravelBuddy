"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, DollarSign, BadgeCheck, CheckCircle } from "lucide-react";
import { TravelPlan } from "@/app/types";

interface TravelPlanCardProps {
    plan: TravelPlan;
}

export default function TravelPlanCard({ plan }: TravelPlanCardProps) {
    const startDate = new Date(plan.startDate).toLocaleDateString();
    const endDate = new Date(plan.endDate).toLocaleDateString();

    return (
        <Link href={`/travel-plans/${plan.id}`} className="block group h-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden shrink-0">
                    <Image
                        src={plan.images?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={plan.destination}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${plan.status === 'COMPLETED' ? 'grayscale' : ''}`}
                        unoptimized
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                        {plan.travelType}
                    </div>
                    {plan.status === 'COMPLETED' && (
                        <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle size={12} />
                            Completed
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        {plan.user?.image && (<Image
                            src={plan.user?.image}
                            alt={plan.user?.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                            unoptimized
                        />)}
                        <span className="text-xs text-text-secondary dark:text-gray-400 font-medium flex items-center gap-1">
                            {plan.user?.name}
                            {plan.user?.isVerified && <BadgeCheck size={14} className="text-blue-500 fill-blue-500/10" />}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {plan.destination}
                    </h3>

                    <div className="space-y-2 text-sm text-text-secondary dark:text-gray-400 mt-auto pt-4">
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
