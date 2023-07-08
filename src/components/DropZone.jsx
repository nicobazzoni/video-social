import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "./AuthContext";
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from "../firebase";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import  { useNavigate} from "react-router-dom";

const MAX_FILES = 4;

const Dropzone = () => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const { userData } = useContext(AuthContext);
  const auth = getAuth();
    const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (files.length + acceptedFiles.length > MAX_FILES) {
      alert('You can only upload up to 4 files at a time.');
      return;
    }
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*,video/*' });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const uploadFiles = async () => {
    for (const file of files) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

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
          console.log('File available at', downloadURL);
          await addDoc(collection(db, "uploads"), {
            url: downloadURL,
            description,
            username: userData.username,
            userProfilePic: userData.profilePicture,
            bio: userData.bio,
            timestamp: new Date(upload.timestamp.seconds * 1000),
            location: userData.location,
          });
        }
      );
    }
    setFiles([]);
    setDescription("");
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
    };

  return (
    <div className="container mx-auto px-4">
      <div className=" text-center m-1 justify-between align-items-center">
        <h2 className="text-white font-mono text-bold bg-blue-300 p-1">Uploading as, <span className="font-mono bg-yellow-200 text-black p-1">{userData.username}</span></h2>

      </div>
      <div className="flex justify-center">
        <div className="border-dashed border-2 border-gray-400 py-8 px-4" {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p className="text-center text-white">Drop the files here ...</p> :
              <p className="text-center text-white">Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      </div>
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {files.map((file, index) => (
          <li key={index} className="w-32">
            <img src={file.preview} alt={file.name} className="w-full h-auto"/>
            <p className="text-center text-xs">{file.name}</p>
            <button onClick={() => removeFile(file)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <textarea
          placeholder="Enter a description for your files..."
          value={description}
          onChange={handleDescriptionChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className=" flex justify-between items-center">
      <button className="bg-blue-200 border rounded-md p-1" onClick={uploadFiles}>Upload</button>
        <button className="bg-rose-200 border rounded-md p-1"  onClick={goHome}>Cancel</button>
        </div>
    </div>
  );
};

export default Dropzone;
