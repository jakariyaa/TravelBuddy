import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-text-primary dark:text-white mb-6">TravelBuddy Blog</h1>
                    <p className="text-lg text-text-secondary dark:text-gray-300 mb-12">
                        Tales from the road, travel tips, and community stories.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2 text-left">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                                <span className="text-primary text-sm font-bold">Travel Tips</span>
                                <h3 className="text-xl font-bold text-text-primary dark:text-white mt-2 mb-2">10 Tips for Solo Travelers</h3>
                                <p className="text-text-secondary dark:text-gray-400 mb-4">Discover how to stay safe and make friends while traveling on your own...</p>
                                <a href="#" className="text-primary hover:underline font-medium">Read more &rarr;</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
