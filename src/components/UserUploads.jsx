import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import SwipeableMedia from "./SwipeableMedia";

const UserUploads = () => {
    const [uploads, setUploads] = useState([]);
  useEffect(() => {
    const uploadsCol = collection(db, "uploads");
    const unsubscribe = onSnapshot(uploadsCol, (snapshot) => {
        let uploadsData = snapshot.docs.map(doc => doc.data());
  
        const groupedUploads = Object.values(
          uploadsData.reduce((result, upload) => {
            if (!result[upload.description]) {
              result[upload.description] = {
                username: upload.username,
                description: upload.description,
                userProfilePic: upload.userProfilePic,
                files: [],
              };
            }
  
            result[upload.description].files.push({
              url: upload.url,
              isVideo: upload.url.includes(".mp4") || upload.url.includes(".mov") || upload.url.includes(".avi"),
            });
    
            return result;
          }, {})
        );
    
        setUploads(groupedUploads);
      });
  
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  
  return (
    <div className="flex-col border-t border-b-2 space-y-2 bg-stone-900 justify-center">
      {uploads.map((upload, index) => {
        return (
          <div key={index}>
            {upload.files && upload.files.length > 0 && (
              <div className="space-between items-center">
                <div className="justify-between bg-slate-100 flex items-center">
                  <h1 className="font-mono bg-black p-1 m-1 text-slate-50 font-extrabold ">{upload.username}</h1>
                  <Link to={`/profile/${upload.username}`}>
                  <img className="p-1 h-20 w-20 object-cover rounded-md border m-1" src={upload.userProfilePic} alt="user upload" />
                 </Link>
                </div>
                <h1 className="text-white bg-stone-800 m-2 font-mono p-1">{upload.description}</h1>
                <div className={upload.files.length === 1 ? "flex justify-center" : "grid grid-cols-2 gap-4"}>
                  {upload.files.map((file, idx) => {
                    return <SwipeableMedia key={idx} file={file} />
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserUploads;