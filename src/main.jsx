import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './App.css'




function Main() {
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        setUserData(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);  // Empty dependencies array


  return (
    <Router>
      <AuthContext.Provider value={{ userData }}>
        <App />
      </AuthContext.Provider>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
