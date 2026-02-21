import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        let unsubscribeUser = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Subscribe to Firestore user document
                unsubscribeUser = userService.subscribeToUser(user.uid, (data) => {
                    setUserData(data);
                    setLoading(false);
                });
            } else {
                setUserData(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUser) unsubscribeUser();
        };
    }, []);

    const value = {
        currentUser,
        userData,
        login,
        signup,
        logout,
        loginWithGoogle
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
