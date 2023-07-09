import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import UserUploads from "../components/UserUploads";
import { AuthContext } from "../components/AuthContext";

const HomePage = () => {
    const { userData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(getAuth());
            console.log("User signed out!");
            navigate('/signin')
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mx-auto flex-col items-center h-screen bg-gradient-to-br from-slate-900 via-black to-stone-900">
            {userData && (
            <div className="flex flex-col items-center space-x-3 font-mono text-center  justify-center">
            <div className="flex justify-center items-center space-between w-full">
                <h2 className="font-mono bg-blue-200 font-extrabold rounded-md m-1 text-black p-1">{userData.username}</h2>
                <Link to={`/profile/${userData.username}`} className="mr-6">
                    <img className="h-20 w-20 border object-cover rounded-full m-1" src={userData.profilePicture} alt="Profile" />
                </Link>
                <button
                    onClick={handleSignOut}
                    className=" px-1 m-1 text-sm h-10 w-10 bg-red-500 text-white rounded-md text-center"
                >
                    Sign Out
                </button>
            </div>
            <div className="flex flex-col space-y-3 text-xs items-center space-x-3 h-20 ">
                <h1 className="text-white p-2 bg-stone-850 w-fit">{userData.bio} * {userData.location}</h1>
            </div>
        </div>
            )}
            <div className="mb-4">
                {userData ? (
                    <Link to="/video" className="px-4 mt-4 py-2 bg-black text-white font-mono border rounded p-1 m-2">Upload</Link>
                ) : (
                    <p className="text-center">Please sign in.</p>
                )}
            </div>
            <div className="">
                {userData ? <UserUploads /> : <p className="text-center">Please sign in.</p>}
            </div>
            {!userData && (
                <div className="fixed inset-x-0 bottom-0 flex justify-center items-center">
                    <Link to="/signin" className="px-4 py-2 bg-black text-white rounded mr-2">Sign In</Link>
                    <Link to="/signup" className="px-4 py-2 bg-black text-white rounded">Sign Up</Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;
