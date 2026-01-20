"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
                            Travner
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">
                            Connect with travelers, share adventures, and explore the world together. Your journey starts here.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-text-primary mb-4">Platform</h3>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/explore" className="hover:text-primary transition-colors">Explore Travelers</Link></li>
                            <li><Link href="/find-buddy" className="hover:text-primary transition-colors">Find a Buddy</Link></li>
                            <li><Link href="/explore" className="hover:text-primary transition-colors">Destinations</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-text-primary mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-text-primary mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-text-tertiary">
                        &copy; {new Date().getFullYear()} Travner. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm text-text-secondary">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
