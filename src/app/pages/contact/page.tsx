"use client";
import React, { useState } from "react";

function page() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for actual API integration
        console.log("Form Submitted", formData);
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 text-white shadow-lg py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-yellow-400">Contact Us</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <section className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">We'd love to hear from you!</h2>
                    <p className="text-gray-700 mb-6">
                        Whether you have a question about our platform, need assistance, or just want to share feedback, 
                        feel free to reach out to us using the form below.
                    </p>

                    {isSubmitted && (
                        <div className="text-green-600 mb-4 font-medium">
                            Thank you for contacting us! We'll get back to you shortly.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
                        >
                            Send Message
                        </button>
                    </form>
                </section>
            </main>

        </div>
    );
}

export default page;
