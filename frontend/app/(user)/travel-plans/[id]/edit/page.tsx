"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/app/utils/api";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Loader2, Upload, Calendar, MapPin, DollarSign, Type } from "lucide-react";
import { toast } from "sonner";
import { TravelPlan } from "@/app/types";

export default function EditTravelPlanPage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [travelType, setTravelType] = useState("Solo");
    const [description, setDescription] = useState("");
    const [interests, setInterests] = useState("");

    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const data = (await api.travelPlans.getById(params.id as string)) as TravelPlan;
                setDestination(data.destination);
                setStartDate(new Date(data.startDate).toISOString().split('T')[0]);
                setEndDate(new Date(data.endDate).toISOString().split('T')[0]);
                setBudget(data.budget.toString());
                setTravelType(data.travelType);
                setDescription(data.description || "");
                setInterests(data.interests ? data.interests.join(", ") : "");
                setExistingImages(data.images || []);
            } catch {
                toast.error("Failed to load travel plan");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchPlan();
        }
    }, [params.id]);



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const removeNewImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageToRemove: string) => {
        setExistingImages(existingImages.filter((img) => img !== imageToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("destination", destination);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("budget", budget);
            formData.append("travelType", travelType);
            formData.append("description", description);
            formData.append("interests", interests); // Append interests

            existingImages.forEach((img) => {
                formData.append("existingImages", img);
            });

            images.forEach((image) => {
                formData.append("images", image);
            });

            await api.travelPlans.update(params.id as string, formData);
            toast.success("Travel plan updated successfully");
            router.push(`/travel-plans/${params.id}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to update travel plan";
            setError(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
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

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                    <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-6">Edit Travel Plan</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="destination"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                    placeholder="e.g. Paris, France"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Budget ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="budget"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                        placeholder="e.g. 1500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Travel Type</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="travelType"
                                        value={travelType}
                                        onChange={(e) => setTravelType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
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
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Interests</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="interests"
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                    placeholder="e.g. Hiking, Food, Photography (comma separated)"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Description</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:placeholder-gray-400"
                                placeholder="Describe your trip plans..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-white mb-1">Images</label>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2 uppercase tracking-wider">Existing Images</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {existingImages.map((img, idx) => (
                                            <div key={`existing-${idx}`} className="relative group">
                                                <div className="relative w-full h-24">
                                                    <Image src={img} alt={`Existing ${idx}`} fill className="object-cover rounded-lg border border-gray-200 dark:border-gray-600" unoptimized />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(img)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images Upload */}
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
                                    {images.length > 0 ? `${images.length} new files selected` : "Click to upload new images"}
                                </p>
                            </div>

                            {/* New Images Preview */}
                            {images.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2 uppercase tracking-wider">New Images</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {images.map((file, idx) => (
                                            <div key={`new-${idx}`} className="relative group">
                                                <div className="relative w-full h-24">
                                                    <Image
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${idx}`}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                        unoptimized
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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
                                disabled={isSaving}
                                className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="animate-spin h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
