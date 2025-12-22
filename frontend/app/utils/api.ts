import { toast } from "sonner";
import { authClient } from "./auth-client";
import { User, Review, TravelPlan, JoinRequest, MatchedUser, UserReviewData } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & {
    headers?: Record<string, string>;
};

async function fetchWithAuth<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    await authClient.getSession();

    const headers = {
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            credentials: "include",
        });

        if (!response.ok) {
            const rawText = await response.text();

            let errorMessage = "Request failed";
            try {
                const errorData = JSON.parse(rawText);
                errorMessage = errorData.message || errorMessage;
            } catch {
                if (rawText.length < 100) errorMessage = rawText;
                else errorMessage = "An error occurred (Non-JSON response)";
            }

            toast.error(errorMessage);

            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Failed to fetch") {
            toast.error("Network error. Please check your connection.");
        }
        throw error;
    }
}

async function uploadWithAuth<T = unknown>(url: string, formData: FormData, method: string = "POST"): Promise<T> {
    await authClient.getSession();

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method,
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
            const errorMessage = errorData.message || "Upload failed";

            toast.error(errorMessage);

            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Failed to fetch") {
            toast.error("Network error. Please check your connection.");
        }
        throw error;
    }
}

export { fetchWithAuth, uploadWithAuth };

export const api = {
    users: {
        getAll: () => fetchWithAuth<User[]>("/users"),
        getProfile: () => fetchWithAuth<User>("/users/profile"),
        getById: (id: string) => fetchWithAuth<User>(`/users/${id}`),
        updateProfile: (data: Partial<User>) => fetchWithAuth<User>("/users/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        uploadImage: (file: File) => {
            const formData = new FormData();
            formData.append("image", file);
            return uploadWithAuth<{ imageUrl: string }>("/users/profile/image", formData);
        },
        delete: (id: string) => fetchWithAuth<void>(`/users/${id}`, { method: "DELETE" }),
        update: (id: string, data: Partial<User>) => fetchWithAuth<User>(`/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        search: (query: string, interests?: string[]) => {
            const params = new URLSearchParams();
            if (query) params.append('query', query);
            if (interests && interests.length > 0) params.append('interests', interests.join(','));
            return fetchWithAuth<User[]>(`/users/search?${params.toString()}`);
        },
        getMatches: () => fetchWithAuth<MatchedUser[]>('/users/matches'),
    },
    travelPlans: {
        getAll: () => fetchWithAuth<TravelPlan[]>("/travel-plans"),
        getMyPlans: () => fetchWithAuth<TravelPlan[]>("/travel-plans/my-plans"),
        getById: (id: string) => fetchWithAuth<TravelPlan>(`/travel-plans/${id}`),
        create: (data: FormData) => uploadWithAuth<TravelPlan>("/travel-plans", data),
        update: (id: string, data: FormData) => uploadWithAuth<TravelPlan>(`/travel-plans/${id}`, data, "PUT"),
        delete: (id: string) => fetchWithAuth<void>(`/travel-plans/${id}`, { method: "DELETE" }),
        search: (query: string) => fetchWithAuth<TravelPlan[]>(`/travel-plans/search?${query}`),
        complete: (id: string) => fetchWithAuth<TravelPlan>(`/travel-plans/${id}/complete`, { method: "PATCH" }),
    },
    reviews: {
        create: (data: Partial<Review>) => fetchWithAuth<Review>("/reviews", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        getAll: () => fetchWithAuth<Review[]>("/reviews"),
        getUserReviews: (userId: string, page: number = 1, limit: number = 10) => fetchWithAuth<UserReviewData>(`/reviews/user/${userId}?page=${page}&limit=${limit}`),
        update: (id: string, data: Partial<Review>) => fetchWithAuth<Review>(`/reviews/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        delete: (id: string) => fetchWithAuth<void>(`/reviews/${id}`, { method: "DELETE" }),
    },
    requests: {
        getAll: () => fetchWithAuth<JoinRequest[]>("/join-requests"),
        delete: (id: string) => fetchWithAuth<void>(`/join-requests/${id}`, { method: "DELETE" }),
    },
    joinRequests: {
        create: (data: { travelPlanId: string }) => fetchWithAuth<JoinRequest>("/join-requests", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        getPlanRequests: (planId: string) => fetchWithAuth<JoinRequest[]>(`/join-requests/plan/${planId}`),
        getRequestsForUserPlans: () => fetchWithAuth<JoinRequest[]>("/join-requests/my-received-requests"),
        respond: (requestId: string, status: string) => fetchWithAuth<JoinRequest>(`/join-requests/${requestId}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),
        getMyRequests: () => fetchWithAuth<JoinRequest[]>("/join-requests/my-requests"),
    },
    payments: {
        createCheckoutSession: (plan: 'monthly' | 'yearly') => fetchWithAuth<{ url: string }>("/payments/create-checkout-session", {
            method: "POST",
            body: JSON.stringify({ plan }),
        }),
        verifySession: (sessionId: string) => fetchWithAuth<{ status: string; verified: boolean }>("/payments/verify-session", {
            method: "POST",
            body: JSON.stringify({ sessionId }),
        }),
    },
};
