"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />
            <main className="grow pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg dark:prose-invert">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Last updated: December 20, 2025
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Welcome to Travner. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Data We Collect</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                            <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Data</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
