import React, { useState } from 'react';
import Hero from './Hero';
import About from './About';
import Features from './Features';

const LandingPage = ({ onNavigate }) => {
  const [showAbout, setShowAbout] = useState(false);

  const handleLearnMore = () => {
    setShowAbout(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
  };

  return (
    <div className="min-h-screen">
      <Hero onNavigate={onNavigate} onLearnMore={handleLearnMore} />
      <About isVisible={showAbout} onClose={handleCloseAbout} />
      <Features />
    </div>
  );
};

export default LandingPage;
