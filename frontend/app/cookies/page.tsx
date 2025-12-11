import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-8">Cookie Policy</h1>

                    <div className="prose dark:prose-invert max-w-none text-text-secondary dark:text-gray-300">
                        <p className="mb-4">Last updated: December 2024</p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">What Are Cookies</h2>
                        <p className="mb-4">
                            As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.
                        </p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">How We Use Cookies</h2>
                        <p className="mb-4">
                            We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
                        </p>

                        <h2 className="text-xl font-bold text-text-primary dark:text-white mt-8 mb-4">Disabling Cookies</h2>
                        <p className="mb-4">
                            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
