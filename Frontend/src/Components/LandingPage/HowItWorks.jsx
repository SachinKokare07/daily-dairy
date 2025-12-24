import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds and set up your personalized diary space',
      icon: '👤',
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: '02',
      title: 'Write Your Thoughts',
      description: 'Express yourself freely with our intuitive writing interface',
      icon: '✍️',
      color: 'from-pink-500 to-pink-600'
    },
    {
      number: '03',
      title: 'Track Your Journey',
      description: 'Review your entries and see how you grow over time',
      icon: '📈',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with your journaling journey in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200">
                {/* Number Badge */}
                <div className={`absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mt-6 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-4xl mx-auto`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
