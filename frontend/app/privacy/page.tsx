import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-8">Privacy Policy</h1>

                    <div className="prose dark:prose-invert max-w-none text-text-secondary dark:text-gray-300">
                        <p className="mb-4">Last updated: December 2024</p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to TravelBuddy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">2. The Data We Collect</h2>
                        <p className="mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Identity Data details including first name, last name, username or similar identifier.</li>
                            <li>Contact Data includes email address and telephone numbers.</li>
                            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
                            <li>Profile Data includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                        </ul>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">3. How We Use Your Data</h2>
                        <p className="mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
