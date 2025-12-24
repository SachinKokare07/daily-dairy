import React, { useState } from 'react';
import ProfileModal from '../Profile/ProfileModal';
import logo from '../../assets/logo.png';

const Header = ({ isAuthenticated = false, onLogout, onNavigate, userData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              onClick={() => handleNavigation(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md transform group-hover:scale-110 transition-transform duration-200">
                <img src={logo} alt="Daily Diary Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-200">
                Daily Diary
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  {/* Account Button */}
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                  >
                    <span className="text-xl">👤</span>
                    <span>Account</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink onClick={scrollToTop}>Home</NavLink>
                  <NavLink onClick={scrollToFeatures}>Features</NavLink>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-purple-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <MobileNavLink onClick={() => { setIsProfileModalOpen(true); setIsMobileMenuOpen(false); }}>Profile</MobileNavLink>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <MobileNavLink onClick={scrollToTop}>Home</MobileNavLink>
                  <MobileNavLink onClick={scrollToFeatures}>Features</MobileNavLink>
                  <MobileNavLink onClick={() => handleNavigation('login')}>Login</MobileNavLink>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={onLogout}
        userData={userData || {
          name: 'John Doe',
          email: 'john.doe@example.com',
          dateOfBirth: 'January 15, 1990',
          place: 'New York, USA',
          memberSince: 'January 2024',
          profilePicture: null
        }}
      />
    </>
  );
};

const NavLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
  >
    {children}
  </button>
);

const MobileNavLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
  >
    {children}
  </button>
);

export default Header;
