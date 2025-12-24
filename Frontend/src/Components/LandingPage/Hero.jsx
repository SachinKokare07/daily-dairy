import React from 'react';

const Hero = ({ onNavigate, onLearnMore }) => {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 overflow-hidden pt-16">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              Your Daily Thoughts,
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Beautifully Captured
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Document your journey, reflect on your experiences, and watch your story unfold
              one day at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300"
              >
                Start Writing Today
              </button>
              <button
                onClick={onLearnMore}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Floating diary illustration */}
          <div className="mt-16">
            <div className="inline-block">
              <div className="w-64 h-80 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/30">
                <div className="space-y-3">
                  <div className="h-4 bg-white/40 rounded w-3/4"></div>
                  <div className="h-4 bg-white/30 rounded w-full"></div>
                  <div className="h-4 bg-white/30 rounded w-5/6"></div>
                  <div className="mt-6 space-y-2">
                    <div className="h-3 bg-white/20 rounded w-full"></div>
                    <div className="h-3 bg-white/20 rounded w-full"></div>
                    <div className="h-3 bg-white/20 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
