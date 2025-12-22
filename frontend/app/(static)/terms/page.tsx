"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />
            <main className="grow pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Terms of Service</h1>

                    <div className="prose prose-lg dark:prose-invert">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Last updated: December 20, 2025
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            TravelBuddy provides a platform for travelers to connect, share travel plans, and find companions for their trips. You understand and agree that the Service may include advertisements and that these advertisements are necessary for TravelBuddy to provide the Service.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Conduct</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You agree to not use the Service to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Upload, post, email, transmit or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of anothers privacy, hateful, or racially, ethnically or otherwise objectionable.</li>
                            <li>Harm minors in any way.</li>
                            <li>Impersonate any person or entity, including, but not limited to, a TravelBuddy official, forum leader, guide or host.</li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
