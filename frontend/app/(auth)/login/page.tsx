"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/utils/auth-client";
import { Loader2, Mail, Lock, ArrowRight, Github } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        await signIn.email({
            email,
            password,
        }, {
            onSuccess: () => {
                toast.success("Logged in successfully");
                router.push("/");
                router.refresh();
            },
            onError: (ctx) => {
                setError(ctx.error.message);
                toast.error(ctx.error.message || "Failed to login");
                setIsLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-text-secondary">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-medium text-teal-600 hover:text-teal-800 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <Card className="shadow-xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-gray-700">
                        <CardContent className="pt-6">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="remember-me" />
                                        <Label htmlFor="remember-me" className="text-sm text-text-secondary font-normal cursor-pointer">
                                            Remember me
                                        </Label>
                                    </div>

                                    <div className="text-sm">
                                        <Link href="/forgot-password" className="font-medium text-teal-600 hover:text-teal-800">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-teal-600 hover:bg-teal-800 text-white rounded-full font-bold shadow-lg shadow-teal-900/10"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin h-5 w-5" />
                                        ) : (
                                            <>
                                                Sign in
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={async () => {
                                            setIsLoading(true);
                                            await signIn.email({
                                                email: "demo1@mail.com",
                                                password: "demo1@mail.com",
                                            }, {
                                                onSuccess: () => {
                                                    toast.success("Logged in as Demo User");
                                                    router.push("/");
                                                    router.refresh();
                                                },
                                                onError: (ctx) => {
                                                    setError(ctx.error.message);
                                                    toast.error(ctx.error.message || "Failed to login");
                                                    setIsLoading(false);
                                                }
                                            });
                                        }}
                                        className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                                    >
                                        Demo User
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={async () => {
                                            setIsLoading(true);
                                            await signIn.email({
                                                email: "superadmin@mail.com",
                                                password: "superadmin@mail.com",
                                            }, {
                                                onSuccess: () => {
                                                    toast.success("Logged in as Admin");
                                                    router.push("/");
                                                    router.refresh();
                                                },
                                                onError: (ctx) => {
                                                    setError(ctx.error.message);
                                                    toast.error(ctx.error.message || "Failed to login");
                                                    setIsLoading(false);
                                                }
                                            });
                                        }}
                                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                                    >
                                        Demo Admin
                                    </Button>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-800 text-text-tertiary">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={async () => {
                                            await signIn.social({
                                                provider: "google",
                                                callbackURL: "/",
                                            });
                                        }}
                                        className="w-full"
                                    >
                                        <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                        </svg>
                                        Google
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={async () => {
                                            await signIn.social({
                                                provider: "github",
                                                callbackURL: "/",
                                            });
                                        }}
                                        className="w-full"
                                    >
                                        <Github className="h-5 w-5 mr-2" />
                                        Github
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
