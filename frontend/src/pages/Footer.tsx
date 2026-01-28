
export default function Footer() {


    return (
        <div className=" ">

            {/* Newsletter Section */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl  mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stay Updated</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Subscribe to our newsletter and be the first to know about new products and exclusive deals
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-colors duration-300"
                            />
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

