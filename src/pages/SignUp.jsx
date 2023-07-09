import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/dalle.png';  // Adjust the path as necessary

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        // Upload profile picture
        const storageRef = ref(storage, 'profiles/' + profilePic.name);
        const uploadTask = uploadBytesResumable(storageRef, profilePic);
      
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Handle progress
          }, 
          (error) => {
            // Handle error
            console.log(error);
          }, 
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Once the upload is complete, create a Firestore document for the user
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { 
              username: username,
              bio: bio,
              location: location,
              profilePicture: downloadURL
            });

            console.log("User signed up and document created!");
            navigate('/');  // Redirect to home page
          }
        );
    } catch (error) {
      console.error(error);
    }    
  };
  

  return (
    <div className="min-h-screen flex  items-center justify-center  bg-gradient-to-br from-pink-100 via-stone-900  to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full  space-y-8">
      
        <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white flex flex-col items-center justify-center">
            <img src={logo} alt="Logo" className="h-20 w-auto mb-2" />  {/* Adjust size as necessary */}
                    Sign up for a new account
                      </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="profile-pic" className="sr-only">
                Profile Picture
              </label>
              <input
                id="profile-pic"
                name="profile-pic"
                type="file"
                onChange={handleImageChange}
                className="w-full py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
  <label htmlFor="bio" className="sr-only">
    Biography
  </label>
  <input
    id="bio"
    name="bio"
    type="text"
    required
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    placeholder="Tell us about yourself"
  />
</div>
<div>
  <label htmlFor="location" className="sr-only">
    Location
  </label>
  <input
    id="location"
    name="location"
    type="text"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    placeholder="Where are you from?"
  />
</div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
