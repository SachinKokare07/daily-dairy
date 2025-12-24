import React, { useState } from 'react';
import Toast from '../Toast/Toast';
import { updateUserProfile } from '../../firebase/authService';
import { updateUserProfileData } from '../../firebase/userProfileService';

const ProfileModal = ({ isOpen, onClose, userData, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [editData, setEditData] = useState({
    name: userData.name || '',
    dateOfBirth: userData.dateOfBirth || '',
    place: userData.place || ''
  });
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    onClose();
    if (onLogout) onLogout();
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditData({
        name: userData.name || '',
        dateOfBirth: userData.dateOfBirth || '',
        place: userData.place || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!userData.userId) {
      console.error('No userId found:', userData);
      setToast({ message: 'User not found', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      console.log('Starting profile update...');
      console.log('User ID:', userData.userId);
      console.log('Edit data:', editData);
      
      // Update Firebase Auth profile (displayName only)
      console.log('Updating Firebase Auth profile...');
      const authResult = await updateUserProfile(editData.name, null);
      
      console.log('Auth update result:', authResult);
      
      if (!authResult.success) {
        console.error('Auth update failed:', authResult.error);
        setToast({ message: `Failed: ${authResult.error || 'Unknown error'}`, type: 'error' });
        setSaving(false);
        return;
      }

      console.log('Auth update successful, now updating Firestore...');
      
      // Update additional profile data in Firestore
      const firestoreResult = await updateUserProfileData(userData.userId, {
        dateOfBirth: editData.dateOfBirth,
        place: editData.place,
        name: editData.name
      });

      console.log('Firestore update result:', firestoreResult);

      if (firestoreResult.success) {
        console.log('Both updates successful! Refreshing user data...');
        setToast({ message: 'Profile updated successfully', type: 'success' });
        setIsEditing(false);
        
        // Notify parent to refresh user data
        if (userData.onProfileUpdate) {
          console.log('Calling onProfileUpdate...');
          await userData.onProfileUpdate();
          console.log('onProfileUpdate completed');
        }
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          console.log('Closing modal...');
          onClose();
        }, 1500);
      } else {
        console.warn('Firestore update failed:', firestoreResult.error);
        setToast({ message: 'Auth updated, but failed to save additional data', type: 'warning' });
        setIsEditing(false);
        if (userData.onProfileUpdate) {
          await userData.onProfileUpdate();
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white p-1 shadow-2xl mb-3">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                  {(isEditing ? editData.name : userData.name)?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">{isEditing ? editData.name || 'Your Name' : userData.name}</h2>
              <p className="text-white/80 text-xs mt-1">Daily Diary Member</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="px-6 py-4 space-y-3">
            {isEditing ? (
              <>
                <EditField 
                  icon="👤" 
                  label="Name" 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  placeholder="Enter your name"
                />
                <EditField 
                  icon="🎂" 
                  label="Date of Birth" 
                  type="date"
                  value={editData.dateOfBirth}
                  onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                />
                <EditField 
                  icon="📍" 
                  label="Location" 
                  value={editData.place}
                  onChange={(e) => setEditData({...editData, place: e.target.value})}
                  placeholder="City, Country"
                />
              </>
            ) : (
              <>
                <ProfileField 
                  icon="📧" 
                  label="Email" 
                  value={userData.email} 
                />
                <ProfileField 
                  icon="🎂" 
                  label="Date of Birth" 
                  value={userData.dateOfBirth || 'Not set'} 
                />
                <ProfileField 
                  icon="📍" 
                  label="Location" 
                  value={userData.place || 'Not set'} 
                />
                <ProfileField 
                  icon="📅" 
                  label="Member Since" 
                  value={userData.memberSince || 'January 2024'} 
                />
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-4 space-y-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button 
                  onClick={handleEditToggle}
                  disabled={saving}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleEditToggle}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <span className="text-xl">{icon}</span>
    <div className="flex-1">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-gray-900 font-semibold text-sm">{value}</p>
    </div>
  </div>
);

const EditField = ({ icon, label, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
    <span className="text-xl mt-1">{icon}</span>
    <div className="flex-1">
      <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
      />
    </div>
  </div>
);

export default ProfileModal;
