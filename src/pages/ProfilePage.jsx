import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { AuthContext } from '../components/AuthContext'; 
import { useContext } from 'react';


const ProfilePage = () => {
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
    const navigate = useNavigate();
    const { userData } = useContext(AuthContext); 
    const [ bio, setBio ] = useState("");
  
  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsCol = collection(db, "uploads");
      const q = query(postsCol, where("username", "==", username));
      const userPostsSnapshot = await getDocs(q);
      const userPostsData = userPostsSnapshot.docs.map(doc => doc.data());

      const groupedUserPosts = Object.values(
        userPostsData.reduce((result, post) => {
          if (!result[post.description]) {
            result[post.description] = {
              username: post.username,
              description: post.description,
              userProfilePic: post.userProfilePic,
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
    const handleBioSubmit = async (e) => {
        e.preventDefault();
      
        if (!userData || !userData.uid) {
          console.error('userData or userData.uid is undefined');
          return;
        }
      
        try {
          const userDocRef = doc(db, "users", userData.uid);
          await setDoc(userDocRef, { bio: bio }, { merge: true });
          alert("Bio updated successfully.");
        } catch (error) {
          console.error("Error updating bio: ", error);
        }
      };
      
        const handleBioChange = (e) => {
        setBio(e.target.value);
        };
        



  return (
    <div className="flex-col border-t border-b-2 space-y-2 bg-stone-900 justify-center">
        {userPosts.map((post, index) => (
          <div key={index}>
            <div className="justify-between bg-stone-900 flex items-center">
              <h1 className="font-mono bg-slate-900 p-1 m-1 text-slate-50 font-extrabold ">{post.username}'s <span className="bg-slate-100 text-black p-1">page</span></h1>
              <img className="p-1 h-20 w-20 object-cover rounded-md border m-1" src={post.userProfilePic} alt="user post" />
              <button onClick={goHome} className="px-4 mt-4 py-2 bg-black text-white font-mono border rounded p-1 m-2">Home</button>
            </div>
            <div>
            {userData && userData.username === username && (
        <form onSubmit={handleBioSubmit}>
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" value={bio} onChange={handleBioChange} />
          <button type="submit">Update Bio</button>
        </form>
      )}
            </div>
            <h1 className="text-white bg-stone-800 m-2 font-mono p-1">{post.description}</h1>
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
