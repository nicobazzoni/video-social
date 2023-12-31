import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import SwipeableMedia from '../components/SwipeableMedia';
import { format } from "date-fns";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { doc } from "firebase/firestore";
import { storage } from "../firebase";


const ProfilePage = () => {
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);  // Added this line
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log(`Fetching profile for username: ${username}`);  // Log the username we're fetching
      const userSnapshot = await getDocs(query(collection(db, "users"), where("username", "==", username)));
      console.log(`Found ${userSnapshot.size} user(s) with username: ${username}`);  // Log the number of users found
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        console.log(`User data: ${JSON.stringify(userData)}`);  // Log the user data
        setProfileData(userData);
      } else {
        console.log(`No user found with username: ${username}`);  // Log when no user is found
      }
    };

    fetchUserProfile();
  }, [username]);


  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsCol = collection(db, "uploads");
      const q = query(postsCol, where("username", "==", username));
      const userPostsSnapshot = await getDocs(q);
      const userPostsData = userPostsSnapshot.docs.map(doc => doc.data());
      console.log(userPostsData, "userProfilePic");
    

      // Set the profile picture from the first post
      if (userPostsData.length > 0) {
        setUserProfilePic(userPostsData[0].userProfilePic);
      }

      const groupedUserPosts = Object.values(
          userPostsData.reduce((result, post) => {
              console.log(post);
              if (!result[post.description]) {
                  result[post.description] = {
                      username: post.username,
                      description: post.description,
                      bio: post.bio,
                      location: post.location,
                      profilePicture: post.profilePicture,
                      timestamp: post.timestamp.toDate(),
                    files: [],
                      
                  };
              }

              result[post.description].files.push({
                  url: post.url,
                  isVideo: post.url.includes(".mp4") || post.url.includes(".mov") || post.url.includes(".avi"),
              });

              return result;
          }, {})
      );

      setUserPosts(groupedUserPosts);
    };

    fetchUserPosts();
  }, [username]);

  const goHome = () => {
    navigate("/");
  };


  const deletePost = async (post) => {
    const storage = getStorage();
    const fileRef = storageRef(storage, post.storageRef);
    await deleteObject(fileRef);
    const docRef = doc(db, "uploads", post.id);
    await docRef.delete();
    setUserPosts(userPosts.filter((p) => p.id !== post.id));
  };
  



  return (
    <div className="mx-auto flex space-y-4 mt-1 flex-col items-center h-screen bg-gradient-to-br from-slate-900 via-black to-stone-900">
      <div className=" flex flex-col justify-center space-y-4 items-center font-mono bg-stone-900 text-white">
        <button onClick={goHome} className=" text-xs  h-10 w-10 bg-black text-white font-mono border-stone-900 rounded p-1 m-2">Home</button>
        <h1 className="font-mono bg-slate-900 p-1 m-1 text-slate-50 font-extrabold ">{username}'s <span className="bg-slate-100 text-black p-1">page</span></h1>
        {userProfilePic ? <img className=" h-26  w-36 rounded-full object-cover shadow-xl shadow-black " src={userProfilePic} alt="User Profile" /> : "Loading Picture"}
  
        {profileData ? (
          <div className=" space-y-2 m-1">
            <span className="bg-stone-900 p-1">{profileData.bio}</span>
            <span className="bg-cyan-200 text-black p-1">{profileData.location}</span>
          </div>
        ) : "Bio and Location loading..."}
      </div>
        
      {userData && userData.username === username && (
          <div>
            <Link to="/edit-bio">Edit Bio</Link>
          </div>
      )}
      {userPosts?.map((post, index) => (
               <div key={index} className="mx-auto flex-col items-center h-screen  space-y-2 bg-stone-900 justify-center">
              <h1 className="   text-white bg-stone-900 font-mono p-1">{post.description}</h1>
              <p className="text-white text-xs bg-stone-950 font-mono p-1">
      Posted on: {post.timestamp.toLocaleDateString()} at {post.timestamp.toLocaleTimeString()}
    </p>
               
              <div className={post.files.length === 1 ? "  bg-black flex flex-col justify-center" : " bg-black grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 ml-2 mr-2"}>
                {post.files.map((file, idx) => {
                  return <SwipeableMedia key={idx} file={file} />;
                })}
              </div>
                {userData && userData.username === username && (
                    <div>
                        <button onClick={() => deletePost(post)} className="text-xs border  h-10 w-14 bg-black mb-2 shadow-md shadow-white text-white font-mono border-stone-900 rounded p-1 m-2">Delete</button>
                        </div>
                )}
          </div>
      ))}
    </div>
  );
};


export default ProfilePage;
