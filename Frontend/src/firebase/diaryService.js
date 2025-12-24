import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const ENTRIES_COLLECTION = 'diaryEntries';

// Create a new diary entry
export const createEntry = async (userId, entryData) => {
  try {
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      ...entryData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating entry:', error);
    return { success: false, error: error.message };
  }
};

// Get all entries for a user
export const getUserEntries = async (userId) => {
  try {
    // First try to get all entries without ordering
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const entries = [];
    
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by date in JavaScript instead of Firestore
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return { success: true, entries };
  } catch (error) {
    console.error('Error getting entries:', error);
    // If no entries exist yet, return empty array
    if (error.code === 'permission-denied') {
      console.error('Permission denied. Check Firestore rules.');
      return { success: false, error: 'Permission denied. Please check your Firestore security rules.' };
    }
    return { success: false, error: error.message };
  }
};

// Update an entry
export const updateEntry = async (entryId, updates) => {
  try {
    const entryRef = doc(db, ENTRIES_COLLECTION, entryId);
    await updateDoc(entryRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating entry:', error);
    return { success: false, error: error.message };
  }
};

// Delete an entry
export const deleteEntry = async (entryId) => {
  try {
    await deleteDoc(doc(db, ENTRIES_COLLECTION, entryId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting entry:', error);
    return { success: false, error: error.message };
  }
};

// Toggle favorite status
export const toggleFavorite = async (entryId, currentStatus) => {
  try {
    const entryRef = doc(db, ENTRIES_COLLECTION, entryId);
    await updateDoc(entryRef, {
      isFavorite: !currentStatus,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: error.message };
  }
};
