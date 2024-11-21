"use client";
import React from "react";

function page() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 text-white shadow-lg py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-yellow-400">Privacy Policy</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <section className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Your Privacy Matters
                    </h2>
                    <p className="text-gray-700 mb-4">
                        At <strong>Employee Bazar</strong>, we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
                    </p>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">1. Information We Collect</h3>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Personal details (e.g., name, email, phone number) when you register or contact us.</li>
                        <li>Usage data, such as IP address, browser type, and pages visited.</li>
                        <li>Optional feedback or other information you provide through forms.</li>
                    </ul>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">2. How We Use Your Information</h3>
                    <p className="text-gray-700 mb-4">
                        We use the information collected to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Respond to your queries or feedback.</li>
                        <li>Improve our platform and user experience.</li>
                        <li>Send updates, newsletters, or promotional content (only if you opt-in).</li>
                    </ul>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">3. Data Sharing and Security</h3>
                    <p className="text-gray-700 mb-4">
                        We do not sell or share your personal information with third parties except:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>When required by law or legal proceedings.</li>
                        <li>To trusted partners who assist in operating our website (under strict confidentiality agreements).</li>
                    </ul>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">4. Cookies and Tracking</h3>
                    <p className="text-gray-700 mb-4">
                        We use cookies and similar tracking technologies to enhance your browsing experience. You can disable cookies through your browser settings, but some features of the website may be affected.
                    </p>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">5. Your Rights</h3>
                    <p className="text-gray-700 mb-4">
                        You have the right to access, update, or delete your personal data. To make such a request, please contact us at <strong>sumitachar1997@gmail.com</strong>.
                    </p>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">6. Updates to This Policy</h3>
                    <p className="text-gray-700 mb-4">
                        We may update this Privacy Policy periodically. Any changes will be reflected on this page, so please check back regularly.
                    </p>

                    <h3 className="text-xl font-medium text-gray-800 mb-2">7. Contact Us</h3>
                    <p className="text-gray-700">
                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Email: <strong>sumitachar1997@gmail.com</strong></li>
                        <li>Phone: <strong>8348580207</strong></li>
                    </ul>
                </section>
            </main>

        </div>
    );
}

export default page;
