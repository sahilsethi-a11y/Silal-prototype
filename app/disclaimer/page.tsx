export default function page() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-8 text-brand-blue text-center">Disclaimer</h1>

                <div className="space-y-8 text-gray-600">
                    <section>
                        <p className="text-sm text-gray-500 mb-4">Last Updated: December 2024</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">General Information</h2>
                        <p className="leading-relaxed">
                            This product marketplace platform is operated by Silal Marketplace. The information provided on this website is for general informational purposes only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Warranty</h2>
                        <p className="leading-relaxed">
                            The platform and all information, content, materials, and services are provided "as is" without warranties of any kind, either express or implied. While we strive to ensure accuracy, we do not warrant that the information is complete, reliable, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
                        <p className="leading-relaxed">
                            Silal Marketplace shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this platform or any transactions conducted through it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Content</h2>
                        <p className="leading-relaxed">
                            Our marketplace may contain links to third-party websites or services. We are not responsible for the content, accuracy, or practices of these external sites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibility</h2>
                        <p className="mb-4">Users are responsible for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Verifying all information before making transactions</li>
                            <li>Conducting their own due diligence on products and services</li>
                            <li>Complying with all applicable laws and regulations</li>
                            <li>Maintaining the confidentiality of their account credentials</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Modifications</h2>
                        <p className="leading-relaxed">
                            We reserve the right to modify, suspend, or discontinue any aspect of the platform at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
                        <p className="leading-relaxed">
                            This disclaimer is governed by the laws of the United Arab Emirates and the Emirate of Abu Dhabi.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <p className="leading-relaxed mb-2">For questions regarding this disclaimer, please contact:</p>
                        <p className="leading-relaxed">
                            <strong>Silal Marketplace</strong><br />
                            Email: <a href="mailto:support@silal.ae" className="text-brand-blue hover:underline">support@silal.ae</a><br />
                            Website: <a href="https://www.silal.ae" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">www.silal.ae</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
