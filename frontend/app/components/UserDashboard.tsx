"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/app/utils/api";
import { Calendar, Users, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { User, TravelPlan, JoinRequest } from "@/app/types";
import { toast } from "sonner";
import MatchedTravelers from "./MatchedTravelers";
import { Skeleton } from "./ui/skeleton";

interface UserDashboardProps {
    user: User;
    initialData?: {
        plans: TravelPlan[];
        requests: JoinRequest[];
        mySentRequests: JoinRequest[];
    };
}

export default function UserDashboard({ user, initialData }: UserDashboardProps) {
    const [upcomingPlans, setUpcomingPlans] = useState<TravelPlan[]>([]);
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
    const [myRequests, setMyRequests] = useState<JoinRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let plans, allRequests, mySentRequests;

                if (initialData) {
                    plans = initialData.plans;
                    allRequests = initialData.requests;
                    mySentRequests = initialData.mySentRequests;
                } else {
                    // Fetch all data in parallel
                    [plans, allRequests, mySentRequests] = await Promise.all([
                        api.travelPlans.getMyPlans(),
                        api.joinRequests.getRequestsForUserPlans(),
                        api.joinRequests.getMyRequests()
                    ]);
                }

                // Filter upcoming plans
                const upcoming = plans.filter((p: TravelPlan) => p.status === 'ACTIVE');
                setUpcomingPlans(upcoming);

                // Filter pending requests matching upcoming plans (logic moved to backend efficiently, but ensuring status here)
                const pendingRequests = allRequests.filter((r: JoinRequest) => r.status === 'PENDING');
                setJoinRequests(pendingRequests);

                setMyRequests(mySentRequests);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [initialData]);

    const handleRequestAction = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.joinRequests.respond(requestId, status);
            toast.success(`Request ${status.toLowerCase()}`);
            // Remove from list
            setJoinRequests(prev => prev.filter(r => r.id !== requestId));
        } catch {
            toast.error("Failed to update request");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-32 w-full rounded-3xl" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-8 w-48" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-8 w-40" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-teal-600 rounded-3xl p-8 text-white shadow-lg shadow-teal-900/20">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-teal-100">Ready for your next adventure?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <MatchedTravelers />
                </div>

                {/* Upcoming Plans */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-primary dark:text-white">Upcoming Plans</h2>
                        <Link href="/travel-plans/add" className="text-primary font-medium hover:underline text-sm">
                            + Create New
                        </Link>
                    </div>

                    {upcomingPlans.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingPlans.map((plan) => (
                                <Link key={plan.id} href={`/travel-plans/${plan.id}`} className="block group">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex gap-4">
                                        <Image
                                            src={plan.images?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                                            alt={plan.destination}
                                            width={96}
                                            height={96}
                                            className="rounded-xl object-cover"
                                            unoptimized
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-text-primary dark:text-white group-hover:text-primary transition-colors">{plan.destination}</h3>
                                            <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 mt-1">
                                                <Calendar size={14} />
                                                {new Date(plan.startDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 mt-1">
                                                <Users size={14} />
                                                {plan.travelType}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-text-secondary dark:text-gray-400 mb-4">No upcoming plans yet.</p>
                            <Link href="/travel-plans/add" className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                Start Planning
                            </Link>
                        </div>
                    )}
                </div>

                {/* Received Requests */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-text-primary dark:text-white">Pending Requests</h2>
                    {joinRequests.length > 0 ? (
                        <div className="space-y-3">
                            {joinRequests.map((request) => (
                                <div key={request.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={request.user?.image || "https://i.pravatar.cc/150?img=68"}
                                                alt={request.user?.name || "User"}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full object-cover shrink-0"
                                                unoptimized
                                            />
                                            <div>
                                                <p className="font-bold text-sm text-text-primary dark:text-white">{request.user?.name || "Unknown User"}</p>
                                                <p className="text-xs text-text-secondary dark:text-gray-400">wants to join {request.travelPlan?.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRequestAction(request.id, 'APPROVED')}
                                            className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleRequestAction(request.id, 'REJECTED')}
                                            className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} /> Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-secondary dark:text-gray-400 text-sm">No pending requests.</p>
                    )}
                </div>

                {/* My Sent Requests */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-text-primary dark:text-white">My Sent Requests</h2>
                    {myRequests.length > 0 ? (
                        <div className="space-y-3">
                            {myRequests.map((request) => (
                                <div key={request.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm text-text-primary dark:text-white">{request.travelPlan?.destination || "Unknown Destination"}</p>
                                        <p className="text-xs text-text-secondary dark:text-gray-400">
                                            Status: <span className={`font-medium ${request.status === 'APPROVED' ? 'text-green-500' :
                                                request.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'
                                                }`}>{request.status}</span>
                                        </p>
                                    </div>
                                    <Link href={`/travel-plans/${request.travelPlanId}`} className="p-2 text-text-secondary hover:text-primary transition-colors">
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-secondary dark:text-gray-400 text-sm">You haven&apos;t sent any requests.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
