import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Writer',
      image: '👩',
      text: 'Daily Diary has transformed how I reflect on my day. The interface is beautiful and the mood tracking helps me understand my patterns better.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      image: '👨',
      text: 'I love the simplicity and security. My thoughts are private and the app makes it easy to write consistently every day.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Teacher',
      image: '👩‍🏫',
      text: 'The perfect journaling companion! I can access my entries from anywhere and the search feature makes finding old memories so easy.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy users who have made Daily Diary part of their daily routine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6 font-medium">Trusted by over 10,000+ users worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">🔒</span>
              <span className="font-semibold">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">⚡</span>
              <span className="font-semibold">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
