export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
    bio?: string;
    currentLocation?: string;
    travelInterests?: string[];
    visitedCountries?: string[];
    isVerified?: boolean;
    createdAt: string;
    updatedAt: string;
    travelPlans?: TravelPlan[];
    reviews?: Review[];
}

export interface TravelPlan {
    id: string;
    userId: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: number;
    budgetRange?: string; // calculated field often returned
    travelType: 'Solo' | 'Couple' | 'Family' | 'Friends';
    description: string;
    interests: string[];
    images: string[];
    status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    user?: User;
    createdAt?: string;
    updatedAt?: string;
}

export interface Review {
    id: string;
    reviewerId: string;
    revieweeId: string;
    travelPlanId?: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer?: User;
    reviewee?: User;
    travelPlan?: {
        id: string;
        destination: string;
    };
}

export interface JoinRequest {
    id: string;
    userId: string;
    travelPlanId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    message?: string;
    createdAt: string;
    user?: User;
    travelPlan?: TravelPlan;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
}

export interface UserReviewData {
    reviews: Review[];
    stats: ReviewStats;
}
