import Image from "next/image";

import { useState, useRef } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { api } from "@/app/utils/api";
import { authClient } from "@/app/utils/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/app/types";

import { toast } from "sonner";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onUpdate: (updatedUser: User) => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
    const [formData, setFormData] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
        currentLocation: user?.currentLocation || "",
        travelInterests: user?.travelInterests?.join(", ") || "",
        visitedCountries: user?.visitedCountries?.join(", ") || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Password Change State
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePasswordChange = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }

        setIsPasswordLoading(true);
        try {
            await authClient.changePassword({
                newPassword: passwordForm.newPassword,
                currentPassword: passwordForm.currentPassword,
                revokeOtherSessions: true
            }, {
                onSuccess: () => {
                    toast.success("Password updated successfully");
                    setShowChangePassword(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Failed to change password");
                }
            });
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const { imageUrl } = await api.users.uploadImage(file);
            if (user) {
                onUpdate({ ...user, image: imageUrl });
            }
            toast.success("Profile image updated");
        } catch {
            const message = "Failed to upload image";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const payload = {
                ...formData,
                travelInterests: formData.travelInterests.split(",").map((s: string) => s.trim()).filter(Boolean),
                visitedCountries: formData.visitedCountries.split(",").map((s: string) => s.trim()).filter(Boolean),
            };
            const updatedUser = await api.users.updateProfile(payload);
            onUpdate(updatedUser);
            toast.success("Profile updated successfully");
            onClose();
        } catch {
            const message = "Failed to update profile";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
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
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-text-primary dark:text-white">Edit Profile</h2>
                        <button onClick={onClose} className="text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Image Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Image
                                    src={user?.image || "https://i.pravatar.cc/150?img=68"}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-md group-hover:opacity-75 transition-opacity"
                                    unoptimized
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white drop-shadow-md" size={24} />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <p className="mt-2 text-sm text-primary font-medium cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                Change Profile Photo
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Current Location</label>
                                <input
                                    type="text"
                                    name="currentLocation"
                                    value={formData.currentLocation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                    placeholder="e.g. New York, USA"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Travel Interests (comma separated)</label>
                                <input
                                    type="text"
                                    name="travelInterests"
                                    value={formData.travelInterests}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                    placeholder="Hiking, Food, Photography"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Visited Countries (comma separated)</label>
                                <input
                                    type="text"
                                    name="visitedCountries"
                                    value={formData.visitedCountries}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                    placeholder="Japan, France, Brazil"
                                />
                            </div>

                            {/* Change Password Toggle */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePassword(!showChangePassword)}
                                    className="text-primary hover:underline text-sm font-medium"
                                >
                                    {showChangePassword ? "Cancel Change Password" : "Change Password"}
                                </button>
                            </div>

                            {showChangePassword && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 pt-2"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmNewPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handlePasswordChange}
                                            disabled={isPasswordLoading}
                                            className="px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold shadow-md disabled:opacity-50"
                                        >
                                            {isPasswordLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Password"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-text-secondary dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
