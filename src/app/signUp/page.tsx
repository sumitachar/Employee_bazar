
"use client"
import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';

const page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);;

    const handleSubmit = async (event:any ) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign in');
            }

            const data = await response.json();
        console.log('Success:', data);
            // Optionally, redirect or display success message
        } catch (error) {
            console.error('Error:', error);
            setError('Sign-in failed. Please try again.');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541233349642-6e425fe6190e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
            {/* Blurred overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Sign-in Form with Backdrop Blur */}
            <div className="relative z-10 p-10 bg-white bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-4xl font-extrabold text-center text-white mb-6">Sign In</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white font-medium mb-2" htmlFor="email">Email</label>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white bg-opacity-20 backdrop-blur-md">
                            <FaUser className="text-gray-500" />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Enter your email" 
                                className="flex-1 bg-transparent outline-none px-2 text-white placeholder-gray-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2" htmlFor="password">Password</label>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white bg-opacity-20 backdrop-blur-md">
                            <FaLock className="text-gray-500" />
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Enter your password" 
                                className="flex-1 bg-transparent outline-none px-2 text-white placeholder-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 rounded-lg transition duration-300"
                    >
                        Sign In
                    </button>
                </form>

                {/* Additional Links */}
                <div className="flex justify-between items-center mt-6 text-sm">
                    <a href="#" className="text-blue-200 hover:underline">Forgot Password?</a>
                    <a href="/signup" className="text-blue-200 hover:underline">Create an Account</a>
                </div>
            </div>
        </div>
    );
    }
export default page





