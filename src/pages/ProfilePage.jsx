import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

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
            <div className="mx-auto flex-col items-center" key={index}>
                <h1 className="   text-white bg-stone-800 font-mono p-1">{post.description}</h1>
                <div className={post.files.length === 1 ? "flex justify-center" : "grid grid-cols-2 gap-4"}>
                    {post.files.map((file, idx) => {
                        const isVideo = file.url.includes(".mp4") || file.url.includes(".mov") || file.url.includes(".avi");
                        return isVideo ? (
                            <video className="p-1 h-96 w-full border rounded m-2" key={idx} src={file.url} width="380" height="240" controls>
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img key={idx} src={file.url} alt="user post" className="object-cover h-96 w-full overflow-hidden border-2 m-2"/>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>
  );
};


export default ProfilePage;
