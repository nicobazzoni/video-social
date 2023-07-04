import React from 'react'
import Dropzone from '../components/DropZone'
import { AuthContext } from '../components/AuthContext';
import { getAuth } from 'firebase/auth';
import { useContext } from 'react';


const UploadForm = () => {
    const { userData } = useContext(AuthContext);
    const auth = getAuth();
  return (
    
        <Dropzone />
   
  )
}

export default UploadForm