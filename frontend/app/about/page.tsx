import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-text-primary dark:text-white mb-6">About TravelBuddy</h1>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg text-text-secondary dark:text-gray-300 mb-6">
                            TravelBuddy is the world's leading platform for connecting travelers. We believe that the best journeys are the ones shared with others.
                        </p>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-white mt-8 mb-4">Our Mission</h2>
                        <p className="text-text-secondary dark:text-gray-300 mb-6">
                            To make the world feel smaller and friendlier by connecting travelers with compatible companions for safer, more enjoyable, and cost-effective trips.
                        </p>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-white mt-8 mb-4">Our Story</h2>
                        <p className="text-text-secondary dark:text-gray-300 mb-6">
                            Founded in 2024, TravelBuddy started with a simple idea: traveling solo shouldn't mean being alone. Since then, we've helped thousands of travelers find their perfect travel partners.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
