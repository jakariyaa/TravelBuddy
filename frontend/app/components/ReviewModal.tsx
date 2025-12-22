"use client";

import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/app/utils/api";
import { toast } from "sonner";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    revieweeId: string;
    revieweeName: string;
    travelPlanId?: string;
    initialData?: {
        id: string;
        rating: number;
        comment: string;
    };
    onReviewSubmitted: () => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    revieweeId,
    revieweeName,
    travelPlanId,
    initialData,
    onReviewSubmitted,
}: ReviewModalProps) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [comment, setComment] = useState(initialData?.comment || "");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            if (initialData) {
                await api.reviews.update(initialData.id, {
                    rating,
                    comment,
                });
                toast.success("Review updated successfully");
            } else {
                if (!travelPlanId) throw new Error("Travel Plan ID is required for new reviews");
                await api.reviews.create({
                    revieweeId,
                    travelPlanId,
                    rating,
                    comment,
                });
                toast.success("Review submitted successfully");
            }
            onReviewSubmitted();
            onClose();
            // Reset form if not editing (or close handles unmount)
            if (!initialData) {
                setRating(0);
                setComment("");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-text-primary dark:text-white">
                            {initialData ? "Edit Review" : `Review ${revieweeName}`}
                        </h2>
                        <button onClick={onClose} className="text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-gray-400">Rate your experience</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={32}
                                            className={`${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                                Write a review
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none dark:placeholder-gray-400"
                                placeholder="Share your experience traveling with this person..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-text-secondary dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
                                {initialData ? "Update Review" : "Submit Review"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
