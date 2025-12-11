import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-8">Terms of Service</h1>

                    <div className="prose dark:prose-invert max-w-none text-text-secondary dark:text-gray-300">
                        <p className="mb-4">Last updated: December 2024</p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">2. User Conduct</h2>
                        <p className="mb-4">
                            You agree to use the site only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others or otherwise cause damage to the site or the Content.
                        </p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">3. Intellectual Property</h2>
                        <p className="mb-4">
                            All content included on the Site, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Site, is the property of TravelBuddy or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.
                        </p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">4. Termination</h2>
                        <p className="mb-4">
                            We may terminate your access to the Site, without cause or notice, which may result in the forfeiture and destruction of all information associated with you.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
