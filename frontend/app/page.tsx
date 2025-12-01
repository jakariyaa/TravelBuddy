'use client';

import Link from 'next/link';
import { Plane, Users, MapPin, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center animate-fadeIn">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block gradient-text">Travel Buddy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Connect with fellow travelers, share experiences, and explore the world together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose <span className="gradient-text">TravelBuddy</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 animate-float">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Find Travel Buddies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with like-minded travelers who share your interests and travel style.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 animate-float">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Share Travel Plans</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Plan trips together, share itineraries, and make memories with your travel companions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-6 animate-float">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Build Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a vibrant community of travelers, share reviews, and get inspired for your next adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-3xl shadow-2xl">
            <Plane className="w-16 h-16 text-white mx-auto mb-6 animate-float" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of travelers finding their perfect travel companions.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
