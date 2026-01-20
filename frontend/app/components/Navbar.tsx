"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Compass, UserPlus, Map, LogOut, LayoutDashboard, CreditCard, Plane } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "@/app/utils/auth-client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { User } from "@/app/types";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/");
        router.refresh();
    };

    const user = session?.user as unknown as User | undefined;
    const isAdmin = user?.role === "ADMIN";

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-3 group-hover:rotate-0 transition-all duration-300">
                                <Plane className="text-white transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" size={24} />
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-teal-600 dark:from-white dark:via-primary dark:to-teal-400 tracking-tight">
                                Travner
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {!user && (
                            <>
                                <Link href="/explore" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <Compass size={18} />
                                    Explore Travelers
                                </Link>
                                <Link href="/find-buddy" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <UserPlus size={18} />
                                    Find Travner
                                </Link>
                                <Link href="/pricing" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <CreditCard size={18} />
                                    Pricing
                                </Link>
                            </>
                        )}

                        {user && !isAdmin && (
                            <>
                                <Link href="/dashboard" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <Link href="/explore" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <Compass size={18} />
                                    Explore Travelers
                                </Link>
                                <Link href="/travel-plans" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <Map size={18} />
                                    My Travel Plans
                                </Link>
                                <Link href="/pricing" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <CreditCard size={18} />
                                    Pricing
                                </Link>
                            </>
                        )}

                        {user && isAdmin && (
                            <>
                                <Link href="/dashboard" className="text-text-secondary dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <LayoutDashboard size={18} />
                                    Admin Dashboard
                                </Link>
                            </>
                        )}

                        {/* Theme Toggle & Auth Buttons / Profile */}
                        <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <ThemeToggle />
                            {!user ? (
                                <>
                                    <Link href="/login" className="text-text-primary dark:text-white font-medium hover:text-primary transition-colors">
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/20 dark:shadow-none"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={`/profile/${user.id}`}
                                        className="flex items-center gap-2 text-text-secondary dark:text-gray-300 hover:text-primary transition-colors"
                                    >
                                        <Image
                                            src={user.image || "https://i.pravatar.cc/150?img=68"}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                                            unoptimized
                                        />
                                        <span className="font-medium">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-text-secondary dark:text-gray-300 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {!user && (
                                <>
                                    <Link
                                        href="/explore"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Explore Travelers
                                    </Link>
                                    <Link
                                        href="/find-buddy"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Find Travner
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Pricing
                                    </Link>
                                </>
                            )}

                            {user && !isAdmin && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/explore"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Explore Travelers
                                    </Link>
                                    <Link
                                        href="/travel-plans"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        My Travel Plans
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Pricing
                                    </Link>
                                </>
                            )}

                            {user && isAdmin && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                </>
                            )}

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 flex justify-between items-center px-3">
                                <span className="text-text-secondary dark:text-gray-300 font-medium">Theme</span>
                                <ThemeToggle />
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                                {!user ? (
                                    <div className="flex flex-col space-y-3">
                                        <Link
                                            href="/login"
                                            className="block text-center px-3 py-2 rounded-md text-base font-medium text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="block text-center px-3 py-2 rounded-full text-base font-medium bg-primary text-white hover:bg-teal-800"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href={`/profile/${user.id}`}
                                            className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Image
                                                src={user.image || "https://i.pravatar.cc/150?img=68"}
                                                alt={user.name}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                                unoptimized
                                            />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <LogOut size={20} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
