"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "../../lib/auth-client";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EditProfileModal from "../../components/EditProfileModal";
import { MapPin, Calendar, Globe, Edit2, User, Mail, Star, BadgeCheck, Briefcase } from "lucide-react";
import TravelPlanCard from "../../components/TravelPlanCard";
import ReviewList from "../../components/ReviewList";
import ReviewModal from "../../components/ReviewModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [activeTab, setActiveTab] = useState<'plans' | 'reviews'>('plans');
    const [editingReview, setEditingReview] = useState<any>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [error, setError] = useState("");

    const isOwnProfile = session?.user?.id === user?.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await api.users.getById(params.id as string);
                setUser(userData);

                const reviewsData = await api.reviews.getUserReviews(params.id as string);
                setReviews(reviewsData.reviews);
                setReviewStats(reviewsData.stats);
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchUser();
        }
    }, [params.id]);

    const handleEditReview = (review: any) => {
        setEditingReview(review);
        setIsReviewModalOpen(true);
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            await api.reviews.delete(reviewId);
            toast.success("Review deleted successfully");
            const reviewsData = await api.reviews.getUserReviews(params.id as string);
            setReviews(reviewsData.reviews);
            setReviewStats(reviewsData.stats);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete review");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
                        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem] w-full"></div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3 space-y-4">
                                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
                            </div>
                            <div className="w-full md:w-2/3 h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User not found</h2>
                        <p className="text-gray-500 dark:text-gray-400">The user you are looking for does not exist or may have been removed.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 pt-24 pb-8 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* Profile Hero Card */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden border border-gray-100 dark:border-gray-800 relative">
                        {/* Decorative Background */}
                        <div className="h-64 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-teal-500 to-emerald-500 opacity-90"></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>
                        </div>

                        <div className="px-8 sm:px-12 pb-10">
                            <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-12 mb-8 gap-6">
                                <div className="relative">
                                    <div className="relative inline-block">
                                        <div className="w-40 h-40 rounded-[2rem] border-[6px] border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                                            <img
                                                src={user.image || "https://i.pravatar.cc/150?img=68"}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-grow pb-2 md:pb-4 text-center md:text-left w-full md:w-auto">
                                    <div className="flex flex-col md:flex-row items-center md:items-start md:justify-start gap-2 md:gap-3 mb-2">
                                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                            {user.name}
                                        </h1>
                                        {user.isVerified && (
                                            <div className="relative group cursor-help mt-1 md:mt-0">
                                                <BadgeCheck className="text-blue-500 fill-blue-500/10" size={28} />
                                                <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-gray-700">
                                                    Verified Traveler
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-gray-500 dark:text-gray-400 font-medium justify-center md:justify-start">
                                        <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                                            <MapPin size={16} className="text-primary" />
                                            {user.currentLocation || "Location not set"}
                                        </span>
                                        <span className="hidden md:inline text-gray-300">•</span>
                                        <span className="flex items-center gap-1.5 text-sm">
                                            <Calendar size={16} className="text-primary/70" />
                                            Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {isOwnProfile && (
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="mb-4 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                    >
                                        <Edit2 size={18} />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="space-y-8">
                                <div className="relative bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                                    <p className="text-gray-600 dark:text-gray-300 max-w-4xl text-lg leading-relaxed italic">
                                        "{user.bio || "No bio yet."}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{reviewStats.totalReviews}</span>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reviews</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                                            {reviewStats.averageRating.toFixed(1)} <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                        </span>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rating</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.visitedCountries?.length || 0}</span>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Countries</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{/* Placeholder for Trips */}0</span>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Trips</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Info Cards */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            {/* Travel Interests */}
                            <div className="bg-white dark:bg-gray-900 p-7 rounded-[2rem] shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-lg">
                                    <div className="p-2.5 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400">
                                        <User size={22} />
                                    </div>
                                    Travel Interests
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {user.travelInterests?.length > 0 ? (
                                        user.travelInterests.map((interest: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl border border-gray-100 dark:border-gray-700"
                                            >
                                                {interest}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No interests added yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Visited Countries */}
                            <div className="bg-white dark:bg-gray-900 p-7 rounded-[2rem] shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-lg">
                                    <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                                        <Globe size={22} />
                                    </div>
                                    Visited Countries
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {user.visitedCountries?.length > 0 ? (
                                        user.visitedCountries.map((country: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl border border-gray-100 dark:border-gray-700"
                                            >
                                                {country}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No countries added yet.</p>
                                    )}
                                </div>
                            </div>

                        </motion.div>

                        {/* Right Column: Content Tabs */}
                        <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="flex border-b border-gray-100 dark:border-gray-800 px-2 overflow-x-auto">
                                    <button
                                        onClick={() => setActiveTab('plans')}
                                        className={`px-8 py-5 text-sm font-bold border-b-2 transition-all relative ${activeTab === 'plans'
                                            ? 'text-primary border-primary'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent'
                                            }`}
                                    >
                                        Upcoming Plans
                                        {activeTab === 'plans' && (
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`px-8 py-5 text-sm font-bold border-b-2 transition-all relative ${activeTab === 'reviews'
                                            ? 'text-primary border-primary'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent'
                                            }`}
                                    >
                                        Reviews
                                        {activeTab === 'reviews' && (
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                        )}
                                    </button>
                                </div>

                                <div className="p-8 sm:p-10 min-h-[400px]">
                                    {activeTab === 'plans' ? (
                                        user.travelPlans && user.travelPlans.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                                {user.travelPlans.map((plan: any) => (
                                                    <TravelPlanCard key={plan.id} plan={{ ...plan, user: user }} />
                                                ))}
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="h-full flex flex-col items-center justify-center text-center py-12"
                                            >
                                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full mb-6">
                                                    <Calendar className="text-gray-300 dark:text-gray-600" size={48} />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No upcoming plans</h3>
                                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                                                    {isOwnProfile
                                                        ? "You haven't created any travel plans yet. Start planning your next adventure today!"
                                                        : "This user hasn't posted any upcoming travel plans yet."}
                                                </p>
                                                {isOwnProfile && (
                                                    <button onClick={() => router.push('/travel-plans/add')} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1">
                                                        Create Travel Plan
                                                    </button>
                                                )}
                                            </motion.div>
                                        )
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ReviewList
                                                reviews={reviews}
                                                currentUserId={session?.user?.id}
                                                onEdit={handleEditReview}
                                                onDelete={handleDeleteReview}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            <Footer />

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onUpdate={(updatedUser) => setUser(updatedUser)}
            />
            {editingReview && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => {
                        setIsReviewModalOpen(false);
                        setEditingReview(null);
                    }}
                    revieweeId={user.id}
                    revieweeName={user.name}
                    initialData={{
                        id: editingReview.id,
                        rating: editingReview.rating,
                        comment: editingReview.comment
                    }}
                    onReviewSubmitted={async () => {
                        const reviewsData = await api.reviews.getUserReviews(params.id as string);
                        setReviews(reviewsData.reviews);
                        setReviewStats(reviewsData.stats);
                    }}
                />
            )}
        </div>
    );
}
