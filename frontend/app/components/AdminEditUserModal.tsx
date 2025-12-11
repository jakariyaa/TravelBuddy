"use client";

import { useState, useEffect } from "react";
import { X, Loader2, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/app/utils/api";
import { toast } from "sonner";

interface AdminEditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUserUpdated: () => void;
}

export default function AdminEditUserModal({
    isOpen,
    onClose,
    user,
    onUserUpdated,
}: AdminEditUserModalProps) {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [role, setRole] = useState("USER");
    const [isVerified, setIsVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setBio(user.bio || "");
            setRole(user.role || "USER");
            setIsVerified(user.isVerified || false);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.users.update(user.id, {
                name,
                bio,
                role,
                isVerified
            });
            toast.success("User updated successfully");
            onUserUpdated();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update user");
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
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-text-primary dark:text-white flex items-center gap-2">
                            <User size={20} className="text-primary" /> Edit User
                        </h2>
                        <button onClick={onClose} className="text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                            <input
                                type="checkbox"
                                id="isVerified"
                                checked={isVerified}
                                onChange={(e) => setIsVerified(e.target.checked)}
                                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <label htmlFor="isVerified" className="text-sm font-medium text-text-primary dark:text-white cursor-pointer select-none">
                                Verified User
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-text-secondary dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
