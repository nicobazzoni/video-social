import React, { createContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUserID, setCurrentUserID] = useState(null);
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setCurrentUserID(user ? user.uid : null);

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }
    });

    return unsubscribe;
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ userID: currentUserID, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
