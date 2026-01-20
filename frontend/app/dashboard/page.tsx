"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/utils/auth-client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import UserDashboard from "@/app/components/UserDashboard";
import AdminDashboard from "@/app/components/AdminDashboard";
import DashboardSkeleton from "@/app/components/DashboardSkeleton";
import { api } from "@/app/utils/api";
import { User, TravelPlan, JoinRequest } from "@/app/types";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [dashboardData, setDashboardData] = useState<{
        plans: TravelPlan[];
        requests: JoinRequest[];
        mySentRequests: JoinRequest[];
    } | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        } else if (session?.user?.id) {
            const fetchProfile = async () => {
                try {
                    const [profile, dashDataResult] = await Promise.all([
                        api.users.getProfile(),
                        Promise.all([
                            api.travelPlans.getMyPlans(),
                            api.joinRequests.getRequestsForUserPlans(),
                            api.joinRequests.getMyRequests()
                        ]).then(([plans, requests, mySentRequests]) => ({ plans, requests, mySentRequests }))
                            .catch(err => {
                                console.warn("Optimistic fetch failed", err);
                                return null;
                            })
                    ]);

                    setUserProfile(profile);
                    setDashboardData(dashDataResult);
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                } finally {
                    setIsLoadingProfile(false);
                }
            };
            fetchProfile();
        }
    }, [session, isPending, router]);

    if (isPending || isLoadingProfile) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow container mt-16 mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <DashboardSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    if (!session || !userProfile) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow container mt-16 mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {userProfile.role === 'ADMIN' ? (
                    <AdminDashboard />
                ) : (
                    <UserDashboard user={userProfile} initialData={dashboardData || undefined} />
                )}
            </main>
            <Footer />
        </div>
    );
}
