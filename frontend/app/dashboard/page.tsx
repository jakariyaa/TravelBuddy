"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../lib/auth-client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import { Loader2 } from "lucide-react";
import { api } from "../lib/api";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        } else if (session?.user?.id) {
            // Fetch full profile to get role if not in session (though session usually has it)
            // But let's fetch profile to be sure and get latest data
            const fetchProfile = async () => {
                try {
                    const profile = await api.users.getProfile();
                    setUserProfile(profile);
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
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </main>
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
                    <UserDashboard user={userProfile} />
                )}
            </main>
            <Footer />
        </div>
    );
}
