"use client";
import React from "react";
import Link from "next/link";

function Page() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 text-white shadow-lg py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-yellow-400">About Us</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <section className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Welcome to Employee Bazar
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        At <span className="font-bold text-yellow-500">Employee Bazar</span>, we are dedicated to connecting talented individuals with 
                        opportunities that align with their skills and aspirations. Our mission is to create a 
                        seamless platform for employees and employers to collaborate effectively and achieve mutual success.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We believe in innovation, transparency, and fostering growth in the professional world. 
                        Our team works tirelessly to ensure the best experience for our users, whether they are 
                        seeking career advancement or looking for top talent to join their teams.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Thank you for choosing <span className="font-bold text-yellow-500">Employee Bazar</span>. Together, we can build a brighter future!
                    </p>
                </section>

                <section className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Values</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Empowerment through collaboration and opportunities.</li>
                        <li>Innovation that drives progress in the professional landscape.</li>
                        <li>Commitment to building long-lasting relationships.</li>
                    </ul>
                </section>

                <section className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h3>
                    <p className="text-gray-700">
                        Have questions or need assistance? Feel free to{" "}
                        <Link href="/pages/contact" className="text-blue-500 hover:text-blue-700">
                            Contact Us
                        </Link>
                        .
                    </p>
                </section>
            </main>
        </div>
    );
}

export default Page;
