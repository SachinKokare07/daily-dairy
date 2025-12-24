import React from 'react';

const Stats = () => {
  const stats = [
    { number: '10,000+', label: 'Active Users', icon: '👥' },
    { number: '500K+', label: 'Entries Written', icon: '📝' },
    { number: '4.9/5', label: 'User Rating', icon: '⭐' },
    { number: '150+', label: 'Countries', icon: '🌍' }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl mb-3">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-white/90 text-lg font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
