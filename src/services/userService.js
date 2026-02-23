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
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            return userSnap.exists() ? userSnap.data() : null;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    /**
     * Saves or overwrites the entire user profile.
     */
    saveUserProfile: async (uid, userData) => {
        try {
            const userRef = doc(db, 'users', uid);
            await setDoc(userRef, {
                ...userData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error saving user profile:", error);
            if (error.code === 'permission-denied') {
                console.error("Permission denied. check Firestore rules.");
            }
            throw error;
        }
    },

    /**
     * Updates specific fields in the user profile.
     */
    updateUserData: async (uid, data) => {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error;
        }
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
        }, (error) => {
            console.error("Firestore subscription error:", error);
            // Optionally notify the UI about the error
        });
    }
};
