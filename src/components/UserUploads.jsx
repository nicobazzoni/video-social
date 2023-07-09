import { useState, useEffect } from "react";
import { collection, getDocs,serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import SwipeableMedia from "./SwipeableMedia";
import { format } from "date-fns";

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
                bio: upload.bio, 
                location: upload.location,
                timestamp: upload.timestamp,

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
    <div className="flex-col  border-t border-b-2 space-y-2 bg-stone-900 justify-center">
      {uploads.map((upload, index) => {
         const timestamp = format(upload.timestamp, "dd*MM*yyy  hh:mm a");
        console.log(upload.timestamp, 'timestamp');
        return (
          <div key={index}>
            {upload.files && upload.files.length > 0 && (
              <div className=" items-center ">

                <div className=" bg-slate-100 justify-between flex items-center">
                  <h1 className="font-mono bg-stone-200 p-1 m-1 shadow-lg shadow-stone-400  text-slate-500 font-extrabold ">
                    {upload.username}
                    </h1>
                    
                  <div className="">                   
                     <h1 className="font-mono bg-stone-200 w-full h-8 p-1 m-1 text-stone-600 tracking-wide shadow-lg text-xs   font-extrabold ">
                        {upload.bio} 
                      
                       </h1></div>
                  <Link className="p-1" to={`/profile/${upload.username}`}>
                  <img className="p-1 h-16 w-16 object-cover shadow-lg shadow-gray-400  rounded-md   mr-2" src={upload.userProfilePic} alt="user upload" />
                 </Link>
                 
                </div>
                <div className="bg-white p-1 flex flex-col">
                    <h1 className="text-black tracking-widest text-xs">{upload.location}</h1>

                </div>
                <h1 className="text-stone-800 bg-stone-200 m-2 font-mono p-1">{upload.description}</h1>
                <div className={upload.files.length === 1 ? " flex flex-col justify-center" : "  grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 mr-4"}>
                  {upload.files.map((file, idx) => {
                    return <SwipeableMedia key={idx} file={file} />
                  })}
                </div>
                <h1 className="text-stone-800 bg-stone-200 m-2 tracking-widest p-1 text-xs">{timestamp}</h1>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserUploads;