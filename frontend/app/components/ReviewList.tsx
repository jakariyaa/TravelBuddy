"use client";

import { Star, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { Review } from "@/app/types";

interface ReviewListProps {
    reviews: Review[];
    currentUserId?: string;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: string) => void;
}

export default function ReviewList({ reviews, currentUserId, onEdit, onDelete }: ReviewListProps) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-text-secondary dark:text-gray-400">No reviews yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src={review.reviewer?.image || "https://i.pravatar.cc/150?img=68"}
                                alt={review.reviewer?.name || "Anonymous"}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700 shrink-0"
                                unoptimized
                            />
                            <div>
                                <h4 className="font-bold text-text-primary dark:text-white text-sm">
                                    {review.reviewer?.name || "Anonymous"}
                                </h4>
                                <p className="text-xs text-text-secondary dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                    {review.travelPlan && (
                                        <span className="ml-1">
                                            • Trip to {review.travelPlan.destination}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    className={`${star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-200 dark:text-gray-700"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-text-secondary dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {review.comment}
                    </p>

                    {currentUserId === review.reviewer?.id && (
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 dark:border-gray-700">
                            <button
                                onClick={() => onEdit?.(review)}
                                className="p-2 text-text-secondary hover:text-primary hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full transition-colors"
                                title="Edit Review"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => onDelete?.(review.id)}
                                className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                title="Delete Review"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
