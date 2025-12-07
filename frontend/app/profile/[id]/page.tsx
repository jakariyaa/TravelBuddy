"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "../../lib/auth-client";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EditProfileModal from "../../components/EditProfileModal";
import { MapPin, Calendar, Globe, Edit2, User, Mail, Star, BadgeCheck } from "lucide-react";
import ReviewList from "../../components/ReviewList";
import ReviewModal from "../../components/ReviewModal";
import { toast } from "sonner";

export default function ProfilePage() {
    const params = useParams();
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
            // Refresh reviews
            const reviewsData = await api.reviews.getUserReviews(params.id as string);
            setReviews(reviewsData.reviews);
            setReviewStats(reviewsData.stats);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete review");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3 space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-full md:w-2/3 h-96 bg-gray-200 rounded-2xl"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-text-primary dark:text-white">User not found</h2>
                        <p className="text-text-secondary dark:text-gray-400 mt-2">The user you are looking for does not exist.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow container mt-12 mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="h-48 bg-gradient-to-r from-teal-600 to-teal-400 relative">
                        {/* Cover Image Placeholder - could be added to schema later */}
                    </div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-16 mb-6">
                            <div className="relative">
                                <img
                                    src={user.image || "https://i.pravatar.cc/150?img=68"}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover bg-white dark:bg-gray-700"
                                />
                                {/* Online Status Indicator could go here */}
                            </div>

                            {isOwnProfile && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="mb-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm font-medium text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <Edit2 size={16} />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-text-primary dark:text-white flex items-center gap-2">
                                    {user.name}
                                    {user.isVerified && (
                                        <div className="relative group">
                                            <BadgeCheck className="text-primary fill-primary/10" size={24} />
                                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                Verified Traveler
                                            </div>
                                        </div>
                                    )}
                                </h1>
                                <p className="text-text-secondary dark:text-gray-400 flex items-center gap-2 mt-1">
                                    <MapPin size={16} className="text-primary" />
                                    {user.currentLocation || "Location not set"}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={`${star <= Math.round(reviewStats.averageRating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-text-secondary dark:text-gray-400">
                                        ({reviewStats.totalReviews} reviews)
                                    </span>
                                </div>
                            </div>

                            <p className="text-text-secondary dark:text-gray-400 max-w-2xl leading-relaxed">
                                {user.bio || "No bio yet."}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full">
                                    <Calendar size={16} className="text-primary" />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full">
                                    <Globe size={16} className="text-primary" />
                                    {user.visitedCountries?.length || 0} Countries Visited
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="space-y-8">
                        {/* Travel Interests */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-text-primary dark:text-white mb-4 flex items-center gap-2">
                                <User size={20} className="text-primary" />
                                Travel Interests
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.travelInterests?.length > 0 ? (
                                    user.travelInterests.map((interest: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-primary text-sm font-medium rounded-full"
                                        >
                                            {interest}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-text-tertiary dark:text-gray-500 text-sm">No interests added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Visited Countries */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-text-primary dark:text-white mb-4 flex items-center gap-2">
                                <Globe size={20} className="text-primary" />
                                Visited Countries
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.visitedCountries?.length > 0 ? (
                                    user.visitedCountries.map((country: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium rounded-full"
                                        >
                                            {country}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-text-tertiary dark:text-gray-500 text-sm">No countries added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Contact/Social - Placeholder */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-text-primary dark:text-white mb-4 flex items-center gap-2">
                                <Mail size={20} className="text-primary" />
                                Contact
                            </h3>
                            <p className="text-sm text-text-secondary dark:text-gray-400">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Content (Plans, Reviews) */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Tabs (Placeholder for now) */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="flex border-b border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveTab('plans')}
                                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'plans'
                                        ? 'text-primary border-primary bg-teal-50/50 dark:bg-teal-900/20'
                                        : 'text-text-secondary dark:text-gray-400 border-transparent hover:text-text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Upcoming Plans
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'reviews'
                                        ? 'text-primary border-primary bg-teal-50/50 dark:bg-teal-900/20'
                                        : 'text-text-secondary dark:text-gray-400 border-transparent hover:text-text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Reviews
                                </button>
                            </div>

                            <div className="p-8">
                                {activeTab === 'plans' ? (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                                            <Calendar className="text-gray-400" size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">No upcoming plans</h3>
                                        <p className="text-text-secondary dark:text-gray-400 max-w-sm mx-auto">
                                            {isOwnProfile
                                                ? "You haven't created any travel plans yet. Start planning your next adventure!"
                                                : "This user hasn't posted any upcoming travel plans yet."}
                                        </p>
                                        {isOwnProfile && (
                                            <button className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 dark:shadow-none">
                                                Create Travel Plan
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <ReviewList
                                        reviews={reviews}
                                        currentUserId={session?.user?.id}
                                        onEdit={handleEditReview}
                                        onDelete={handleDeleteReview}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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
                        // Refresh reviews
                        const reviewsData = await api.reviews.getUserReviews(params.id as string);
                        setReviews(reviewsData.reviews);
                        setReviewStats(reviewsData.stats);
                    }}
                />
            )}
        </div>
    );
}
