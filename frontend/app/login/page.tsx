'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            // In a real app, you'd update global auth state here
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded text-black"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded text-black"
                    required
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Login
                </button>
            </form>
            <p className="mt-4">
                Don't have an account? <Link href="/register" className="text-blue-500">Register</Link>
            </p>
        </div>
    );
}
