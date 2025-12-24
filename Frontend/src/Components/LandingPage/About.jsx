import React from 'react';

const About = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                About 
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {' '}Daily Diary
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Side - Image/Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-2xl p-6 shadow-xl">
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/30 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-white/40 rounded w-3/4"></div>
                        <div className="h-2 bg-white/30 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="h-2 bg-white/30 rounded w-full"></div>
                      <div className="h-2 bg-white/30 rounded w-full"></div>
                      <div className="h-2 bg-white/30 rounded w-5/6"></div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                      <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                      <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="space-y-4">
                <p className="text-base text-gray-700 leading-relaxed">
                  Daily Diary is more than just a digital notebook – it's your personal sanctuary for thoughts, memories, and self-reflection. 
                  We believe that the simple act of writing down your daily experiences can transform your life. Our platform is designed to make 
                  journaling effortless, secure, and enjoyable.
                </p>

                <p className="text-base text-gray-700 leading-relaxed">
                  Built with privacy and simplicity at its core, Daily Diary offers a seamless experience across all your devices. Your entries are 
                  encrypted and stored securely, ensuring that your personal thoughts remain truly personal. Join thousands of users worldwide 
                  who have discovered the power of daily reflection.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-full">
                    <span className="text-purple-600 font-semibold">✓</span>
                    <span className="text-gray-700 text-sm font-medium">100% Private</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-pink-50 px-3 py-2 rounded-full">
                    <span className="text-pink-600 font-semibold">✓</span>
                    <span className="text-gray-700 text-sm font-medium">Cloud Synced</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-full">
                    <span className="text-red-600 font-semibold">✓</span>
                    <span className="text-gray-700 text-sm font-medium">Ad-Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
