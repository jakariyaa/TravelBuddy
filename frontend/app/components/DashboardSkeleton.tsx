import { Skeleton } from "./Skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section Skeleton */}
            <Skeleton className="h-32 w-full rounded-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column (Matched Travelers) */}
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

                {/* Right Column (Plans & Requests) */}
                <div className="space-y-8">
                    {/* Upcoming Plans */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <Skeleton key={i} className="h-28 w-full" />
                            ))}
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48" />
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
