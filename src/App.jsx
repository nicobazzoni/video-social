import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './pages/SignInPage' // make sure to import your SignIn component
import HomePage from "./pages/Home"; // make sure to import your HomePage component
import SignUp from "./pages/SignUp";
import DropZone from "./components/DropZone";
import UploadForm from "./pages/UploadForm";
import ProfilePage from "./pages/ProfilePage";
import { db } from "./firebase";

export default function App() {
  return (
   
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/video" element={<DropZone/>} />
        <Route path="/profile/:username" element={<ProfilePage/>} />
      </Routes>
 
  );
}
