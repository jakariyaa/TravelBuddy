import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore - Travner",
    description: "Find your perfect travel companion and explore amazing destinations.",
};

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
