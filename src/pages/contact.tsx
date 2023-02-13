import React from 'react';

const Contact: React.FC = () => {
    return (
        <div className="bg-gray-900 min-h-screen p-10">
            <h1 className="text-white text-4xl font-bold mb-6 sm:text-5xl text-center">Contact Us</h1>
            <form className="bg-white p-6 rounded-lg shadow-xl sm:w-2/3 sm:mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="w-full border border-gray-400 px-4 py-2 rounded-full outline-none"
                        type="text"
                        id="name"
                        name="name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full border border-gray-400 px-4 py-2 rounded-full outline-none"
                        type="email"
                        id="email"
                        name="email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        className="w-full border border-gray-400 px-4 py-2 rounded-xl outline-none"
                        id="message"
                        name="message"
                        rows={5}
                        required
                    />
                </div>
                <button
                    className="bg-orange-500 w-full text-white py-2 px-4 rounded-full hover:bg-orange-600"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Contact;
