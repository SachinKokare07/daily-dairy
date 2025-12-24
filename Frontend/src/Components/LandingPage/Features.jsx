import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '📝',
      title: 'Easy Writing',
      description: 'Intuitive interface designed for seamless journaling experience',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: '🔒',
      title: 'Private & Secure',
      description: 'Your thoughts are encrypted and stored safely',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: '📊',
      title: 'Mood Tracking',
      description: 'Track your emotions and see patterns over time',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: '🎨',
      title: 'Customize',
      description: 'Personalize your diary with themes and styles',
      color: 'from-pink-400 to-pink-600',
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find any entry instantly with powerful search',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      description: 'Access your diary from anywhere, anytime',
      color: 'from-indigo-400 to-indigo-600',
    },
  ];

  return (
    <section id="features-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}Journal Better
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features to help you capture, organize, and reflect on your daily life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
