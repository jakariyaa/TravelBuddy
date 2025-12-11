import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Briefcase } from "lucide-react";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-text-primary dark:text-white mb-6">Join Our Team</h1>
                        <p className="text-lg text-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
                            We're on a mission to bring the world closer together. If you love travel and technology, we'd love to meet you.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-4">Open Positions</h2>
                        {['Senior Frontend Engineer', 'Product Designer', 'Community Manager', 'Backend Developer'].map((role) => (
                            <div key={role} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary dark:text-white">{role}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary dark:text-gray-400">
                                        <span className="flex items-center gap-1"><Briefcase size={14} /> Full-time</span>
                                        <span>•</span>
                                        <span>Remote</span>
                                    </div>
                                </div>
                                <button className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-teal-800 transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
