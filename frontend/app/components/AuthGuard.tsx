"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/app/utils/auth-client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, isPending, error } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (isPending) return;

        // List of public paths that don't require verification
        const publicPaths = ["/", "/login", "/register", "/verify-email", "/terms", "/privacy"];

        // Check if the current path is public
        // We use startsWith to allow for sub-routes if needed, but for now exact match or specific prefixes
        const isPublic = publicPaths.some(path => pathname === path || pathname?.startsWith("/api"));

        if (!session) {
            // If no session, usually we let them be, unless it's a protected route.
            // But AuthGuard is 'Strict Email Verification', not 'Strict Login'.
            // Access control for login is handled by pages/middleware usually. 
            // Here we focus on: IF logged in AND NOT verified -> Redirect.
            setIsChecking(false);
            return;
        }

        // @ts-ignore - emailVerified is part of the user object in better-auth
        if (session && !session.user.emailVerified) {
            if (pathname !== "/verify-email") {
                const email = session.user.email;
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                return; // Don't stop checking, effectively keeps loading state until redirect happens
            }
        }

        setIsChecking(false);
    }, [session, isPending, pathname, router]);

    // If we are redirecting (session exists, unverified, not on verify page), we should NOT render children
    const shouldRedirect = session && !session.user.emailVerified && pathname !== "/verify-email";

    if (isPending || isChecking || shouldRedirect) {
        // Optional: Render nothing or a loading spinner while checking
        // To avoid flash of content, we can render a loading state
        // But for better UX, maybe just render children and let the effect redirect?
        // No, strict means don't show children.
        if (shouldRedirect) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
            );
        }
    }

    return <>{children}</>;
}
