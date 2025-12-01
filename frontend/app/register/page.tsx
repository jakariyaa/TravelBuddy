'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Link from 'next/link';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { email, password, name });
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Register</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded text-black"
                    required
                />
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
                    Register
                </button>
            </form>
            <p className="mt-4">
                Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
            </p>
        </div>
    );
}
