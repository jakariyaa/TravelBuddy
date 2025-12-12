import { toast } from "sonner";
import { authClient } from "./auth-client";
import { User, Review } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & {
    headers?: Record<string, string>;
};

async function fetchWithAuth(url: string, options: RequestOptions = {}) {
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
            } catch (_e) {
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

async function uploadWithAuth(url: string, formData: FormData, method: string = "POST") {
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
        getAll: () => fetchWithAuth("/users"),
        getProfile: () => fetchWithAuth("/users/profile"),
        getById: (id: string) => fetchWithAuth(`/users/${id}`),
        updateProfile: (data: Partial<User>) => fetchWithAuth("/users/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        uploadImage: (file: File) => {
            const formData = new FormData();
            formData.append("image", file);
            return uploadWithAuth("/users/profile/image", formData);
        },
        delete: (id: string) => fetchWithAuth(`/users/${id}`, { method: "DELETE" }),
        update: (id: string, data: Partial<User>) => fetchWithAuth(`/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        search: (query: string, interests?: string[]) => {
            const params = new URLSearchParams();
            if (query) params.append('query', query);
            if (interests && interests.length > 0) params.append('interests', interests.join(','));
            return fetchWithAuth(`/users/search?${params.toString()}`);
        },
        getMatches: () => fetchWithAuth('/users/matches'),
    },
    travelPlans: {
        getAll: () => fetchWithAuth("/travel-plans"),
        getMyPlans: () => fetchWithAuth("/travel-plans/my-plans"),
        getById: (id: string) => fetchWithAuth(`/travel-plans/${id}`),
        create: (data: FormData) => uploadWithAuth("/travel-plans", data),
        update: (id: string, data: FormData) => uploadWithAuth(`/travel-plans/${id}`, data, "PUT"),
        delete: (id: string) => fetchWithAuth(`/travel-plans/${id}`, { method: "DELETE" }),
        search: (query: string) => fetchWithAuth(`/travel-plans/search?${query}`),
        complete: (id: string) => fetchWithAuth(`/travel-plans/${id}/complete`, { method: "PATCH" }),
    },
    reviews: {
        create: (data: Partial<Review>) => fetchWithAuth("/reviews", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        getAll: () => fetchWithAuth("/reviews"),
        getUserReviews: (userId: string, page: number = 1, limit: number = 10) => fetchWithAuth(`/reviews/user/${userId}?page=${page}&limit=${limit}`),
        update: (id: string, data: Partial<Review>) => fetchWithAuth(`/reviews/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
        delete: (id: string) => fetchWithAuth(`/reviews/${id}`, { method: "DELETE" }),
    },
    requests: {
        getAll: () => fetchWithAuth("/join-requests"),
        delete: (id: string) => fetchWithAuth(`/join-requests/${id}`, { method: "DELETE" }),
    },
    joinRequests: {
        create: (data: { travelPlanId: string }) => fetchWithAuth("/join-requests", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        getPlanRequests: (planId: string) => fetchWithAuth(`/join-requests/plan/${planId}`),
        getRequestsForUserPlans: () => fetchWithAuth("/join-requests/my-received-requests"),
        respond: (requestId: string, status: string) => fetchWithAuth(`/join-requests/${requestId}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),
        getMyRequests: () => fetchWithAuth("/join-requests/my-requests"),
    },
    payments: {
        createCheckoutSession: (plan: 'monthly' | 'yearly') => fetchWithAuth("/payments/create-checkout-session", {
            method: "POST",
            body: JSON.stringify({ plan }),
        }),
    },
};
