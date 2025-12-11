"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { emailOtp, useSession } from "@/app/utils/auth-client";
import { Loader2, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { toast } from "sonner";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession(); // Use session as fallback

    // Get email from params OR session
    const email = searchParams.get("email") || (session?.user as any)?.email || "";

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(0);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email not found");
            return;
        }
        setIsLoading(true);

        try {
            await emailOtp.verifyEmail({
                email,
                otp,
            }, {
                onSuccess: () => {
                    toast.success("Email verified successfully!");
                    // Refresh session to update emailVerified status
                    window.location.href = "/";
                },
                onError: (ctx: any) => {
                    toast.error(ctx.error.message || "Invalid OTP");
                    setIsLoading(false);
                }
            });
        } catch (err) {
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setIsResending(true);
        try {
            await emailOtp.sendVerificationOtp({
                email,
                type: "email-verification"
            }, {
                onSuccess: () => {
                    toast.success("Verification code sent!");
                    setTimer(60); // 60 seconds cooldown
                    setIsResending(false);
                },
                onError: (ctx: any) => {
                    toast.error(ctx.error.message || "Failed to send code");
                    setIsResending(false);
                }
            });
        } catch (error) {
            toast.error("Failed to resend code");
            setIsResending(false);
        }
    };

    if (!email) {
        return (
            <div className="text-center">
                <p className="text-red-500">No email provided for verification.</p>
                <Link href="/register" className="text-primary hover:underline">Go to Register</Link>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-700 w-full max-w-md">
            <div className="text-center mb-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    We sent a verification code to <br />
                    <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-text-primary">
                        Verification Code
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white tracking-widest text-center text-lg placeholder-gray-400"
                            placeholder="123456"
                            maxLength={6}
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
                                Verify Email
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={timer > 0 || isResending}
                        className="text-sm text-primary hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isResending ? (
                            <Loader2 className="animate-spin h-4 w-4 inline mr-2" />
                        ) : timer > 0 ? (
                            `Resend code in ${timer}s`
                        ) : (
                            "Resend Code"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
                <Suspense fallback={<Loader2 className="animate-spin text-primary" />}>
                    <VerifyEmailContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
