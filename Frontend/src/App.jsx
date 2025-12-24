import React, { useState, useEffect } from 'react';
import { onAuthChange, logoutUser, getCurrentUser } from './firebase/authService';
import { getUserProfileData } from './firebase/userProfileService';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import LandingPage from './components/LandingPage';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  // Load additional user profile data from Firestore
  const loadUserProfile = async (userId) => {
    const result = await getUserProfileData(userId);
    if (result.success && result.profile) {
      setUserProfile(result.profile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setCurrentPage('dashboard');
        loadUserProfile(user.uid);
      } else {
        setCurrentPage('landing');
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfileUpdate = async () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Reload user to get updated photoURL and displayName
      await currentUser.reload();
      // Force React to re-render with fresh user data
      setUser(getCurrentUser());
      await loadUserProfile(currentUser.uid);
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
      setCurrentPage('landing');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        isAuthenticated={!!user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        userData={{
          userId: user?.uid,
          name: user?.displayName || 'User',
          email: user?.email || '',
          profilePicture: user?.photoURL,
          dateOfBirth: userProfile?.dateOfBirth || '',
          place: userProfile?.place || '',
          memberSince: user?.metadata?.creationTime 
            ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Recently',
          onProfileUpdate: handleProfileUpdate
        }}
      />
      
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <Login onLogin={() => setCurrentPage('dashboard')} onNavigate={handleNavigate} />}
      {currentPage === 'dashboard' && user && <Dashboard user={user} />}
    </div>
  );
}

export default App;