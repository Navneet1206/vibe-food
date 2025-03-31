import { Link } from 'react-router-dom';

const About = () => {
    const features = [
        {
            title: 'Wide Selection',
            description: 'Choose from hundreds of restaurants and thousands of dishes.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            ),
        },
        {
            title: 'Fast Delivery',
            description: 'Get your food delivered quickly and hot to your doorstep.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
        {
            title: 'Quality Food',
            description: 'Partner with the best restaurants to ensure food quality.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Easy Ordering',
            description: 'Simple and intuitive ordering process for a great experience.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-primary">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-20"
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Food background"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        About GatiyanFood
                    </h1>
                    <p className="mt-6 text-xl text-white max-w-3xl">
                        We're on a mission to make food delivery simple, fast, and enjoyable for everyone.
                        Join us in our journey to revolutionize the way people order and enjoy food.
                    </p>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
                            Why Choose Us
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            The Best Food Delivery Experience
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            We provide the best food delivery service with a focus on quality, speed, and customer satisfaction.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div key={index} className="relative">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Our Story
                            </h2>
                            <p className="mt-3 max-w-3xl text-lg text-gray-500">
                                GatiyanFood started with a simple idea: to make food delivery accessible to everyone.
                                We believe that everyone deserves to enjoy great food from their favorite restaurants
                                without the hassle of going out.
                            </p>
                            <div className="mt-8 sm:flex">
                                <div className="rounded-md shadow">
                                    <Link
                                        to="/register"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
                                    >
                                        Join Us
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link
                                        to="/contact"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                            <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                                <img
                                    className="max-h-12"
                                    src="https://tailwindui.com/img/logos/logo-1.svg"
                                    alt="Company logo"
                                />
                            </div>
                            <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                                <img
                                    className="max-h-12"
                                    src="https://tailwindui.com/img/logos/logo-2.svg"
                                    alt="Company logo"
                                />
                            </div>
                            <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                                <img
                                    className="max-h-12"
                                    src="https://tailwindui.com/img/logos/logo-3.svg"
                                    alt="Company logo"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
                            Our Team
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Meet the People Behind GatiyanFood
                        </p>
                    </div>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((member) => (
                                <div key={member} className="text-center">
                                    <div className="space-y-4">
                                        <img
                                            className="mx-auto h-20 w-20 rounded-full"
                                            src={`https://images.unsplash.com/photo-${member === 1 ? '1472099645785-5658abf4ff4e' : member === 2 ? '1438761681033-6461ffad8d80' : '1519244703995-f4e0f30006d5'}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                            alt=""
                                        />
                                        <div className="text-lg leading-6 font-medium space-y-1">
                                            <h3>Team Member {member}</h3>
                                            <p className="text-primary">Position</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 