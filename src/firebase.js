// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTngVpOsAhmBrlGLAmJdkiZK2th2JYteA",
  authDomain: "video-social-c5383.firebaseapp.com",
  projectId: "video-social-c5383",
  storageBucket: "video-social-c5383.appspot.com",
  messagingSenderId: "249506999795",
  appId: "1:249506999795:web:539fbb9881879111e53686"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { storage, ref, uploadBytesResumable, getDownloadURL, db, auth };
