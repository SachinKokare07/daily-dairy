import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

// Register new user
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.code, errorMessage: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.code, errorMessage: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Update user profile
export const updateUserProfile = async (displayName, photoURL) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    await updateProfile(user, {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL
    });

    return { success: true, user: auth.currentUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
