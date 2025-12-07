"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Trash2, Search, User, MapPin, Calendar, Activity, TrendingUp, Users, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between"
    >
        <div>
            <p className="text-sm font-medium text-text-secondary dark:text-gray-400">{title}</p>
            <h3 className="text-3xl font-bold text-text-primary dark:text-white mt-2">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
    </motion.div>
);

// Confirmation Modal Component
const ConfirmationModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading
}: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    onClick={onCancel}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 z-50 shadow-xl border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary dark:text-white">{title}</h3>
                        </div>
                    </div>
                    <p className="text-text-secondary dark:text-gray-300 mb-6">
                        {message}
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-text-secondary bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'plans' | 'reviews' | 'requests'>('users');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        type: 'user' | 'plan' | 'review' | 'request' | null;
        id: string | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        type: null,
        id: null,
        isLoading: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, plansData, reviewsData, requestsData] = await Promise.all([
                    api.users.getAll(),
                    api.travelPlans.getAll(),
                    api.reviews.getAll(),
                    api.requests.getAll()
                ]);
                setUsers(usersData);
                setPlans(plansData);
                setReviews(reviewsData);
                setRequests(requestsData);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
                toast.error("Failed to load admin data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const confirmDelete = async () => {
        if (!deleteModal.id || !deleteModal.type) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            switch (deleteModal.type) {
                case 'user':
                    await api.users.delete(deleteModal.id);
                    setUsers(prev => prev.filter(u => u.id !== deleteModal.id));
                    toast.success("User deleted successfully");
                    break;
                case 'plan':
                    await api.travelPlans.delete(deleteModal.id);
                    setPlans(prev => prev.filter(p => p.id !== deleteModal.id));
                    toast.success("Plan deleted successfully");
                    break;
                case 'review':
                    await api.reviews.delete(deleteModal.id);
                    setReviews(prev => prev.filter(r => r.id !== deleteModal.id));
                    toast.success("Review deleted successfully");
                    break;
                case 'request':
                    await api.requests.delete(deleteModal.id);
                    setRequests(prev => prev.filter(r => r.id !== deleteModal.id));
                    toast.success("Request deleted successfully");
                    break;
            }
        } catch (error) {
            toast.error(`Failed to delete ${deleteModal.type}`);
        } finally {
            setDeleteModal({ isOpen: false, type: null, id: null, isLoading: false });
        }
    };

    const openDeleteModal = (type: 'user' | 'plan' | 'review' | 'request', id: string) => {
        setDeleteModal({
            isOpen: true,
            type,
            id,
            isLoading: false
        });
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPlans = plans.filter(p =>
        p.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredReviews = reviews.filter(r =>
        r.reviewer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reviewee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRequests = requests.filter(r =>
        r.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.travelPlan?.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.travelPlan?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>)}
            </div>
            <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
        </div>;
    }

    const tabs = [
        { id: 'users', label: `Users (${users.length})`, icon: Users },
        { id: 'plans', label: `Plans (${plans.length})`, icon: FileText },
        { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
        { id: 'requests', label: `Requests (${requests.length})`, icon: Activity },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary dark:text-white tracking-tight">Admin Dashboard</h1>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Manage users, travel plans, and platform activity.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm w-full md:w-80"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
                <StatsCard title="Active Plans" value={plans.length} icon={MapPin} color="bg-emerald-500" />
                <StatsCard title="Total Reviews" value={reviews.length} icon={MessageSquare} color="bg-amber-500" />
                <StatsCard title="Join Requests" value={requests.length} icon={Activity} color="bg-purple-500" />
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Tabs Header */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                    ? "text-primary bg-primary/5"
                                    : "text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-4 mb-1"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/50 dark:bg-gray-700/20 text-text-secondary dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                                        <tr>
                                            {activeTab === 'users' && (
                                                <>
                                                    <th className="px-6 py-4">User</th>
                                                    <th className="px-6 py-4">Role</th>
                                                    <th className="px-6 py-4">Joined</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </>
                                            )}
                                            {activeTab === 'plans' && (
                                                <>
                                                    <th className="px-6 py-4">Destination</th>
                                                    <th className="px-6 py-4">Host</th>
                                                    <th className="px-6 py-4">Dates</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </>
                                            )}
                                            {activeTab === 'reviews' && (
                                                <>
                                                    <th className="px-6 py-4">Reviewer</th>
                                                    <th className="px-6 py-4">Reviewee</th>
                                                    <th className="px-6 py-4">Rating</th>
                                                    <th className="px-6 py-4">Comment</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </>
                                            )}
                                            {activeTab === 'requests' && (
                                                <>
                                                    <th className="px-6 py-4">Requester</th>
                                                    <th className="px-6 py-4">Destination</th>
                                                    <th className="px-6 py-4">Host</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {activeTab === 'users' && filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={user.image || "https://i.pravatar.cc/150?img=68"}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                                                        />
                                                        <div>
                                                            <div className="font-semibold text-text-primary dark:text-white">{user.name}</div>
                                                            <div className="text-xs text-text-secondary dark:text-gray-400">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary dark:text-gray-400">
                                                    {new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openDeleteModal('user', user.id)}
                                                        className="text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {activeTab === 'plans' && filteredPlans.map((plan) => (
                                            <tr key={plan.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <Link href={`/travel-plans/${plan.id}`} className="font-semibold text-text-primary dark:text-white hover:text-primary transition-colors flex items-center gap-2">
                                                        <MapPin size={16} className="text-primary" />
                                                        {plan.destination}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={plan.user?.image || "https://i.pravatar.cc/150?img=68"}
                                                            alt={plan.user?.name}
                                                            className="w-8 h-8 rounded-full object-cover border border-white dark:border-gray-800 shadow-sm"
                                                        />
                                                        <span className="text-text-secondary dark:text-gray-300 text-sm">{plan.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary dark:text-gray-400 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} />
                                                        {new Date(plan.startDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${plan.status === 'COMPLETED' ? 'bg-green-100 text-green-700 bg-opacity-60 border border-green-200/50' :
                                                        plan.status === 'CANCELLED' ? 'bg-red-100 text-red-700 bg-opacity-60 border border-red-200/50' :
                                                            'bg-blue-100 text-blue-700 bg-opacity-60 border border-blue-200/50'
                                                        }`}>
                                                        {plan.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openDeleteModal('plan', plan.id)}
                                                        className="text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                                        title="Delete Plan"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {activeTab === 'reviews' && filteredReviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={review.reviewer?.image || "https://i.pravatar.cc/150?img=68"}
                                                            alt={review.reviewer?.name}
                                                            className="w-8 h-8 rounded-full object-cover border border-white dark:border-gray-800 shadow-sm"
                                                        />
                                                        <span className="font-medium text-text-primary dark:text-white">{review.reviewer?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={review.reviewee?.image || "https://i.pravatar.cc/150?img=68"}
                                                            alt={review.reviewee?.name}
                                                            className="w-8 h-8 rounded-full object-cover border border-white dark:border-gray-800 shadow-sm"
                                                        />
                                                        <span className="text-text-secondary dark:text-gray-300">{review.reviewee?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={i < review.rating ? "text-amber-400 text-lg" : "text-gray-300"}>★</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-text-secondary dark:text-gray-400 text-sm max-w-xs truncate">{review.comment}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openDeleteModal('review', review.id)}
                                                        className="text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {activeTab === 'requests' && filteredRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={request.user?.image || "https://i.pravatar.cc/150?img=68"}
                                                            alt={request.user?.name}
                                                            className="w-8 h-8 rounded-full object-cover border border-white dark:border-gray-800 shadow-sm"
                                                        />
                                                        <span className="font-medium text-text-primary dark:text-white">{request.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-text-primary dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-medium">
                                                        {request.travelPlan?.destination}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary dark:text-gray-400 text-sm">
                                                    {request.travelPlan?.user?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${request.status === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-200/50' :
                                                        request.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-200/50' :
                                                            'bg-yellow-100 text-yellow-700 border border-yellow-200/50'
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openDeleteModal('request', request.id)}
                                                        className="text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                                        title="Delete Request"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Empty States */}
                                {activeTab === 'users' && filteredUsers.length === 0 && (
                                    <div className="p-8 text-center text-text-secondary dark:text-gray-400">
                                        No users found matching your search.
                                    </div>
                                )}
                                {activeTab === 'plans' && filteredPlans.length === 0 && (
                                    <div className="p-8 text-center text-text-secondary dark:text-gray-400">
                                        No travel plans found.
                                    </div>
                                )}
                                {activeTab === 'reviews' && filteredReviews.length === 0 && (
                                    <div className="p-8 text-center text-text-secondary dark:text-gray-400">
                                        No reviews activity yet.
                                    </div>
                                )}
                                {activeTab === 'requests' && filteredRequests.length === 0 && (
                                    <div className="p-8 text-center text-text-secondary dark:text-gray-400">
                                        No join requests found.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                title={`Delete ${deleteModal.type === 'user' ? 'User' : deleteModal.type === 'plan' ? 'Travel Plan' : deleteModal.type === 'review' ? 'Review' : 'Request'}`}
                message={deleteModal.type === 'user' ? "Are you sure you want to delete this user? This action cannot be undone and will remove all their data." :
                    deleteModal.type === 'plan' ? "Are you sure you want to delete this travel plan?" :
                        deleteModal.type === 'review' ? "Are you sure you want to delete this review?" :
                            "Are you sure you want to delete this join request?"}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, type: null, id: null, isLoading: false })}
                isLoading={deleteModal.isLoading}
            />
        </div>
    );
}
