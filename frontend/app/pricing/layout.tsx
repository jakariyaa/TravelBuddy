import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing - TravelBuddy",
    description: "Choose the perfect plan for your travel needs.",
};

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
