import { HTMLAttributes } from "react";

export function Skeleton({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 ${className}`}
            {...props}
        />
    );
}
