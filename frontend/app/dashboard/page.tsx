"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/utils/auth-client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import UserDashboard from "@/app/components/UserDashboard";
import AdminDashboard from "@/app/components/AdminDashboard";
import DashboardSkeleton from "@/app/components/DashboardSkeleton";
import { Loader2 } from "lucide-react";
import { api } from "@/app/utils/api";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        } else if (session?.user?.id) {
            // Fetch full profile to get role if not in session (though session usually has it)
            // But let's fetch profile to be sure and get latest data
            const fetchProfile = async () => {
                try {
                    // Fetch profile and potential user dashboard data in parallel
                    // We optimistically fetch user dashboard data. If user is ADMIN, we just ignore it.
                    // If fetching dashboard data fails (e.g. 403), we ignore it here and let UserDashboard handle or retry (or just have null)

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
                    <UserDashboard user={userProfile} initialData={dashboardData} />
                )}
            </main>
            <Footer />
        </div>
    );
}
