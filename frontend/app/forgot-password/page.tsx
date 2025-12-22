"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { emailOtp } from "@/app/utils/auth-client";
import { Loader2, Mail, ArrowRight, Lock } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);

        try {
            await emailOtp.sendVerificationOtp({
                email,
                type: "forget-password",
            }, {
                onSuccess: () => {
                    toast.success("Reset code sent to your email");
                    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
                },
                onError: (ctx: { error: { message: string } }) => {
                    toast.error(ctx.error.message || "Failed to send code");
                    setIsLoading(false);
                }
            });
        } catch {
            toast.error("Failed to send reset email");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-700 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white placeholder-gray-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-lg shadow-teal-900/10 text-sm font-bold text-white bg-primary hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        Send Reset Code
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>

                            <div className="text-sm">
                                <Link href="/login" className="font-medium text-primary hover:text-teal-700 dark:hover:text-teal-400">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
