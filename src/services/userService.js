import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

/**
 * Service to handle user-related data operations in Firestore.
 */
export const userService = {
    /**
     * Gets or creates a user document in Firestore.
     */
    getUserProfile: async (uid) => {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data() : null;
    },

    /**
     * Saves or overwrites the entire user profile.
     */
    saveUserProfile: async (uid, userData) => {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
            ...userData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    },

    /**
     * Updates specific fields in the user profile.
     */
    updateUserData: async (uid, data) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
    },

    /**
     * Real-time listener for user data changes.
     */
    subscribeToUser: (uid, callback) => {
        const userRef = doc(db, 'users', uid);
        return onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            } else {
                callback(null);
            }
        });
    }
};
