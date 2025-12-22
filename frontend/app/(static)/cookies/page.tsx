"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />
            <main className="grow pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Cookie Policy</h1>

                    <div className="prose prose-lg dark:prose-invert">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Last updated: December 20, 2025
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. What Are Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Disabling Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
