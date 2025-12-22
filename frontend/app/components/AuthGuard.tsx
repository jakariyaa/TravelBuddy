"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/app/utils/auth-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isPending) return;

        if (session && !session.user.emailVerified) {
            if (pathname !== "/verify-email") {
                const email = session.user.email;
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            }
        }
    }, [session, isPending, pathname, router]);

    // If we are redirecting (session exists, unverified, not on verify page), we should NOT render children
    const shouldRedirect = session && !session.user.emailVerified && pathname !== "/verify-email";

    if (isPending || shouldRedirect) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return <>{children}</>;
}
