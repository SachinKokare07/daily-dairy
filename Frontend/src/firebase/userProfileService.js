import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Update user profile in Firestore
export const updateUserProfileData = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'userProfiles', userId);
    
    await setDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Get user profile from Firestore
export const getUserProfileData = async (userId) => {
  try {
    const userRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() };
    } else {
      return { success: true, profile: null };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};
