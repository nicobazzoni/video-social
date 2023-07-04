import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate} from "react-router-dom";

import UserUploads from "../components/UserUploads";
import { AuthContext } from "../components/AuthContext";
import Dropzone from "../components/DropZone";

function HomePage() {
  const { userData } = useContext(AuthContext);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out!");
      navigate('/signin')
    } catch (error) {
      console.error(error);
    }
  };

  const goToUpload = () => {
    navigate('/video')
    }


  return (
    <div  className=" mx-auto m-2 flex flex-col items-center items-cemter  bg-gradient-to-br h-screen  from-slate-900 via-black to-stone-900">
    
      { userData && (
        <div className=" flex items-center font-mono text-center m-1 justify-between ">
          <h2 className="text-black p-2 bg-slate-100 w-fit">Welcome back, <span className="font-mono bg-blue-200 font-extrabold  text-black p-1">{userData.username}</span> !</h2>
          <Link to={`/profile/${userData.username}`}>
          <img className="h-20 w-20 border object-cover rounded m-1" src={userData.profilePicture} alt="Profile" /></Link>
        </div>
      )}
      <div className=" z-10 ">
        {userData ? (
           <button onClick={goToUpload} className="px-4 mt-4 py-2 bg-black text-white font-mono border rounded p-1 m-2">Upload</button>
           
        ) : (
            <p className="text-center">Please sign in.</p>
        )}
        
      </div>
      <div>
        {userData ? (
            
            <UserUploads /> 
        ) : (
            <p className="text-center">Please sign in.</p>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 flex justify-center items-center">
        {userData ? (
          <button 
            onClick={handleSignOut} 
            className="px-4 mt-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link 
              to="/signin" 
              className="px-4 py-2 bg-black text-white rounded mr-2"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-black text-white rounded"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
