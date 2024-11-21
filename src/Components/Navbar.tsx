"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaSignInAlt, FaSignOutAlt, FaUserCircle, FaUserShield } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface User {
    email: string;
}

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
    const [isAdmin, setIsAdmin] = useState(false); 
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
        const storedIsAdmin = localStorage.getItem("isAdmin") === "true";

        if (storedUser && storedIsLoggedIn === "true") {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
            setIsAdmin(storedIsAdmin); // Set admin state from localStorage
        }
        setIsLoading(false); // Update loading state
    }, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleCreateAccount = (e: any) => {
        e.preventDefault();
        setShowModal(false);
        router.push("/pages/register");
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            if (email === "admin@gmail.com" && password === "admin@123") {
                // Admin credentials
                setIsLoggedIn(true);
                setIsAdmin(true);
                setUser({ email });
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("user", JSON.stringify({ email }));
                localStorage.setItem("isAdmin", "true");
                setShowModal(false);
            } else {
                // Regular user login
                const response = await fetch('/api/signIn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok && data.user) {
                    setIsLoggedIn(true);
                    setIsAdmin(false); // Regular user
                    setUser(data.user);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("isAdmin", "false");
                    setShowModal(false);
                } else {
                    alert('Invalid credentials');
                }
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/signOut', { method: 'POST' });
            if (response.ok) {
                setIsLoggedIn(false);
                setIsAdmin(false); 
                setUser(null);
                setShowDropdown(false);
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user");
                localStorage.removeItem("isAdmin");
                router.push(`/`);
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (isLoading) return null; 

    return (
        <>
            <nav className="bg-gray-800 text-white shadow-lg fixed top-0 w-full z-50 flex flex-col">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold hover:text-yellow-400">
                        Employee Bazar
                    </Link>
                    <button
                        className="md:hidden text-yellow-500 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>

                    <div className="hidden md:flex space-x-6 items-center">
                        <Link href="/" className="hover:text-yellow-400">Home</Link>
                        <Link href="/pages/about" className="hover:text-yellow-400">About</Link>
                        <Link href="/pages/contact" className="hover:text-yellow-400">Contact Us</Link>
                        {isLoggedIn ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="rounded-full text-yellow-500 focus:outline-none"
                                >
                                    <FaUserCircle size={28} />
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                                        {isAdmin ? (
                                            <>
                                                <button
                                                    onClick={() => router.push("/pages/admin")}
                                                    className=" inline-flex flex-col  w-full text-left px-4 py-2 hover:bg-gray-100 items-center"
                                                >
                                                    {/* <FaUserShield className="mr-2" /> */}
                                                    Admin Panel
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        ) :
                                            <>

                                                <button
                                                    onClick={() => router.push(`/pages/profile`)}
                                                    className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Profile
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={toggleModal}
                                className="bg-yellow-500 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 flex items-center space-x-2"
                            >
                                <FaSignInAlt />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden bg-gray-700 pb-4 flex flex-col items-center">
                        <Link href="/" className="block px-4 py-2 text-center hover:bg-gray-600">Home</Link>
                        <Link href="/pages/about" className="block px-4 py-2 text-center hover:bg-gray-600">About</Link>
                        <Link href="/pages/contact" className="block px-4 py-2 text-center hover:bg-gray-600">Contact Us</Link>
                        {isLoggedIn ?(
                            <div className="flex flex-col items-center space-y-2">
                                {isAdmin ? (
                                    <>
                                        <button
                                            onClick={() => router.push("/pages/admin")}
                                            className="inline-flex flex-col w-full text-left px-4 py-2 hover:bg-gray-100 items-center"
                                        >
                                            Admin Panel
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => router.push(`/pages/profile/${user?.email}`)}
                                            className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        ):<button
                        onClick={toggleModal}
                        className="bg-yellow-500 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 flex items-center space-x-2"
                    >
                        <FaSignInAlt />
                        <span>Sign In</span>
                    </button>}
                    </div>
                )}

            </nav>

            {/* Sign In Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sign In</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-700"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-700"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 rounded-lg"
                            >
                                Sign In
                            </button>
                        </form>
                        <p className="text-center mt-4 text-gray-700">
                            Don't have an account?{" "}
                            <button onClick={handleCreateAccount} className="text-blue-500 hover:text-blue-700">
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
