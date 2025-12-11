"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/utils/api";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Loader2, Upload, Calendar, MapPin, DollarSign, Type, Users } from "lucide-react";

import { toast } from "sonner";

export default function AddTravelPlanPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [travelType, setTravelType] = useState("Solo");
    const [description, setDescription] = useState("");
    const [interests, setInterests] = useState("");
    const [images, setImages] = useState<File[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("destination", destination);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("budget", budget);
            formData.append("travelType", travelType);
            formData.append("description", description);
            formData.append("interests", interests); // Send as comma-separated string

            images.forEach((image) => {
                formData.append("images", image);
            });

            await api.travelPlans.create(formData);
            toast.success("Travel plan created successfully!");
            router.push("/travel-plans");
        } catch (err: any) {
            toast.error(err.message || "Failed to create travel plan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-6">Create New Travel Plan</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:placeholder-gray-400"
                                    placeholder="e.g. Paris, France"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Budget ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:placeholder-gray-400"
                                        placeholder="e.g. 2000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Travel Type</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        value={travelType}
                                        onChange={(e) => setTravelType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
                                    >
                                        <option value="Solo">Solo</option>
                                        <option value="Couple">Couple</option>
                                        <option value="Family">Family</option>
                                        <option value="Friends">Friends</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Interests</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:placeholder-gray-400"
                                    placeholder="e.g. Hiking, Food, Photography (comma separated)"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none dark:placeholder-gray-400"
                                placeholder="Tell us about your trip..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Images (Max 5)</label>
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                <p className="text-sm text-text-secondary dark:text-gray-400">
                                    {images.length > 0 ? `${images.length} files selected` : "Click to upload images"}
                                </p>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {images.map((file, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${idx}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
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
                                Create Plan
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
