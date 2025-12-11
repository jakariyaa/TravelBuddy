"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/utils/api";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useSession } from "@/app/utils/auth-client";
import { Loader2, Calendar, MapPin, DollarSign, Users, ArrowLeft, Trash2, Edit2, CheckCircle, Star, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import ReviewModal from "@/app/components/ReviewModal";

export default function TravelPlanDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [plan, setPlan] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoinRequesting, setIsJoinRequesting] = useState(false);
    const [participants, setParticipants] = useState<any[]>([]);
    const [existingRequest, setExistingRequest] = useState<any>(null); // Track existing request
    const [reviews, setReviews] = useState<any[]>([]); // Not directly used in the provided snippet, but added as per instruction
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReviewee, setSelectedReviewee] = useState<{ id: string; name: string } | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [error, setError] = useState("");

    const isOwner = session?.user?.id === plan?.userId;

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const planData = await api.travelPlans.getById(params.id as string);
                setPlan(planData);

                // If plan is completed, fetch participants and reviews
                if (planData.status === 'COMPLETED') {
                    // Fetch participants (approved requests)
                    // Note: Ideally we should have a dedicated endpoint for participants, 
                    // but we can use getPlanRequests if user is host, or getUserRequests if user is participant (limited)
                    // For now, let's assume we can get approved requests via getPlanRequests if we are the host.
                    // If we are a participant, we might not see other participants unless we add an endpoint.
                    // Given the constraints, let's focus on Host -> Participant and Participant -> Host reviews.

                    if (session?.user?.id === planData.userId) {
                        const requests = await api.joinRequests.getPlanRequests(planData.id);
                        const approved = requests.filter((r: any) => r.status === 'APPROVED').map((r: any) => r.user);
                        setParticipants(approved);
                    }

                    // Fetch reviews for this plan to check if we already reviewed someone
                    // This is a bit tricky without a specific endpoint, but we can check getUserReviews for the people involved.
                    // Or we can just try to submit and handle the "already reviewed" error.
                    // Better UX: Fetch reviews by me? No endpoint.
                    // Let's just handle the "already reviewed" error gracefully or check locally if we have the data.
                }
            } catch (err) {
                setError("Failed to load travel plan details");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchPlan();
        }
    }, [params.id, session?.user?.id]);

    useEffect(() => {
        const checkExistingRequest = async () => {
            if (session?.user?.id && plan && !isOwner) {
                try {
                    const myRequests = await api.joinRequests.getMyRequests();
                    const request = myRequests.find((r: any) => r.travelPlanId === plan.id);
                    setExistingRequest(request);
                } catch (error) {
                    console.error("Failed to fetch my requests", error);
                }
            }
        };

        if (session && plan && !isOwner) {
            checkExistingRequest();
        }
    }, [session, plan, isOwner]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this travel plan?")) return;

        try {
            await api.travelPlans.delete(plan.id);
            toast.success("Travel plan deleted successfully");
            router.push("/travel-plans");
        } catch (err) {
            toast.error("Failed to delete plan");
        }
    };

    const handleCompleteTrip = async () => {
        setIsCompleting(true);
        try {
            await api.travelPlans.complete(plan.id);
            setPlan({ ...plan, status: 'COMPLETED' });
            toast.success("Trip marked as completed");

            // Refresh participants if host
            if (isOwner) {
                const requests = await api.joinRequests.getPlanRequests(plan.id);
                const approved = requests.filter((r: any) => r.status === 'APPROVED').map((r: any) => r.user);
                setParticipants(approved);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to complete trip");
        } finally {
            setIsCompleting(false);
        }
    };

    const handleJoinRequest = async () => {
        if (!session) {
            toast.error("You must be logged in to send a join request.");
            router.push("/login"); // Or open login modal
            return;
        }
        setIsJoinRequesting(true);
        try {
            await api.joinRequests.create({ travelPlanId: plan.id });
            toast.success("Join request sent successfully!");
            // Optionally update UI to show request sent status
        } catch (err: any) {
            toast.error(err.message || "Failed to send join request.");
        } finally {
            setIsJoinRequesting(false);
        }
    };

    const handleCancelRequest = async () => {
        if (!existingRequest) return;
        if (!confirm("Are you sure you want to cancel your request to join?")) return;

        setIsJoinRequesting(true);
        try {
            await api.requests.delete(existingRequest.id);
            toast.success("Join request cancelled.");
            setExistingRequest(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to cancel request.");
        } finally {
            setIsJoinRequesting(false);
        }
    };

    const openReviewModal = (userId: string, userName: string) => {
        setSelectedReviewee({ id: userId, name: userName });
        setIsReviewModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </main>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Plan not found</h2>
                    <p className="text-text-secondary mb-6">{error || "The travel plan you are looking for does not exist."}</p>
                    <Link href="/travel-plans" className="text-primary font-medium hover:underline flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Plans
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Link href="/travel-plans" className="inline-flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Plans
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Hero Image */}
                    <div className="h-64 md:h-96 relative">
                        <img
                            src={plan.images?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                            alt={plan.destination}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-8 w-full">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-bold rounded-full mb-3">
                                            {plan.travelType}
                                        </span>
                                        <h1 className="text-4xl font-bold text-white mb-2">{plan.destination}</h1>
                                        <div className="flex items-center text-white/90 gap-4">
                                            <span className="flex items-center gap-1"><Calendar size={18} /> {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><DollarSign size={18} /> {plan.budgetRange}</span>
                                        </div>
                                    </div>

                                    {isOwner && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => router.push(`/travel-plans/${plan.id}/edit`)}
                                                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                                                title="Edit Plan"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600/90 transition-colors"
                                                title="Delete Plan"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto">
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-4">About the Trip</h2>
                                <p className="text-text-secondary dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {plan.description}
                                </p>
                            </div>

                            {/* Interests */}
                            {plan.interests && plan.interests.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-4">Interests</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.interests.map((interest: string, idx: number) => (
                                            <span key={idx} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-white rounded-full text-sm font-medium">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trip Participants (Owner View) */}
                            {isOwner && plan.status === 'COMPLETED' && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <h3 className="font-bold text-text-primary dark:text-white mb-4">Trip Participants</h3>
                                    {participants.length > 0 ? (
                                        <div className="space-y-4">
                                            {participants.map((participant) => (
                                                <div key={participant.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={participant.image || "https://i.pravatar.cc/150?img=68"}
                                                            alt={participant.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <span className="font-medium text-text-primary dark:text-white">{participant.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => openReviewModal(participant.id, participant.name)}
                                                        className="px-4 py-2 text-sm font-medium text-primary bg-teal-50 dark:bg-teal-900/30 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                                                    >
                                                        Review
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-text-secondary dark:text-gray-400 text-sm">No participants joined this trip.</p>
                                    )}
                                </div>
                            )}

                            {/* Additional Images Gallery */}
                            {plan.images && plan.images.length > 1 && (
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary dark:text-white mb-4">Gallery</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {plan.images.slice(1).map((img: string, idx: number) => (
                                            <img key={idx} src={img} alt={`Gallery ${idx}`} className="rounded-xl h-32 w-full object-cover" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Host Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-100 dark:border-gray-600">
                                <h3 className="font-bold text-text-primary dark:text-white mb-4">Meet the Host</h3>
                                <Link href={`/profile/${plan.user?.id}`} className="flex items-center gap-4 group">
                                    <img
                                        src={plan.user?.image || "https://i.pravatar.cc/150?img=68"}
                                        alt={plan.user?.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-primary transition-colors"
                                    />
                                    <div>
                                        <p className="font-bold text-text-primary dark:text-white group-hover:text-primary transition-colors flex items-center gap-1">
                                            {plan.user?.name}
                                            {plan.user?.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-blue-500/10" />}
                                        </p>
                                        <p className="text-sm text-text-secondary dark:text-gray-300 line-clamp-1">{plan.user?.bio || "Travel enthusiast"}</p>
                                    </div>
                                </Link>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {isOwner ? (
                                    <>
                                        {plan.status !== 'COMPLETED' && (
                                            <button
                                                onClick={handleCompleteTrip}
                                                disabled={isCompleting}
                                                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                                            >
                                                {isCompleting ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                                                Mark Trip as Completed
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {plan.status === 'COMPLETED' ? (
                                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                                                <h3 className="font-bold text-text-primary dark:text-white mb-2">Trip Completed</h3>
                                                <p className="text-text-secondary dark:text-gray-400 mb-4">How was your experience with the host?</p>
                                                <button
                                                    onClick={() => openReviewModal(plan.user.id, plan.user.name)}
                                                    className="w-full px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2"
                                                >
                                                    <Star size={18} />
                                                    Review Host
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleJoinRequest}
                                                disabled={isJoinRequesting || !session}
                                                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isJoinRequesting && <Loader2 className="animate-spin h-5 w-5" />}
                                                Request to Join Trip
                                            </button>
                                        )}
                                        {existingRequest && existingRequest.status === 'PENDING' && (
                                            <button
                                                onClick={handleCancelRequest}
                                                disabled={isJoinRequesting}
                                                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center gap-2"
                                            >
                                                {isJoinRequesting ? <Loader2 className="animate-spin h-5 w-5" /> : <Trash2 size={18} />}
                                                Cancel Request
                                            </button>
                                        )}
                                        {existingRequest && existingRequest.status === 'APPROVED' && (
                                            <div className="w-full py-3 bg-green-50 text-green-700 rounded-xl font-bold border border-green-100 flex items-center justify-center gap-2">
                                                <CheckCircle size={20} />
                                                Request Approved
                                            </div>
                                        )}
                                        {existingRequest && existingRequest.status === 'REJECTED' && (
                                            <div className="w-full py-3 bg-gray-50 text-gray-500 rounded-xl font-medium border border-gray-100 flex items-center justify-center gap-2">
                                                Request Rejected
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Trip Details Summary */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h3 className="font-bold text-text-primary dark:text-white mb-4">Trip Details</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                                        <span className="text-text-secondary dark:text-gray-400">Budget</span>
                                        <span className="font-medium text-text-primary dark:text-white">${plan.budget}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                                        <span className="text-text-secondary dark:text-gray-400">Type</span>
                                        <span className="font-medium text-text-primary dark:text-white">{plan.travelType}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                                        <span className="text-text-secondary dark:text-gray-400">Duration</span>
                                        <span className="font-medium text-text-primary dark:text-white">
                                            {Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 py-2">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${plan.status === 'COMPLETED'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                                            }`}>
                                            {plan.status === 'COMPLETED' ? 'Completed' : 'Active'}
                                        </span>
                                        <span className="px-4 py-1.5 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-sm font-medium">
                                            {plan.travelType} Trip
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {selectedReviewee && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    revieweeId={selectedReviewee.id}
                    revieweeName={selectedReviewee.name}
                    travelPlanId={plan.id}
                    onReviewSubmitted={() => {
                        toast.success("Review submitted!");
                        // Optionally refresh data
                    }}
                />
            )}
        </div>
    );
}
