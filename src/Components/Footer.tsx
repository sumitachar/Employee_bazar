import React from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
                {/* Brand */}
                <div className="mb-4 md:mb-0">
                    <Link href="/" className="text-2xl font-bold hover:text-yellow-400">
                        Employee Bazar
                    </Link>
                    <p className="text-gray-400 mt-2">
                        Empowering employees with the best platform.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col md:flex-row md:space-x-6 mb-4 md:mb-0">
                    <Link href="/" className="hover:text-yellow-400 mb-2 md:mb-0">Home</Link>
                    <Link href="/pages/about" className="hover:text-yellow-400 mb-2 md:mb-0">About Us</Link>
                    <Link href="/pages/contact" className="hover:text-yellow-400 mb-2 md:mb-0">Contact Us</Link>
                    <Link href="/pages/privacyPolicy" className="hover:text-yellow-400">Privacy Policy</Link>
                </div>

                {/* Social Media */}
                <div className="flex space-x-4">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-400"
                    >
                        <FaFacebook size={20} />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-400"
                    >
                        <FaTwitter size={20} />
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-400"
                    >
                        <FaInstagram size={20} />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-400"
                    >
                        <FaLinkedin size={20} />
                    </a>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-6">
                <p className="text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Employee Bazar. All Rights Reserved.
                </p>
                <p className="text-center text-gray-400 py-4 text-sm">
                    Built with ❤️ by the Employee Bazar team.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
