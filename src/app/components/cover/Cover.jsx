import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from "./cover.module.css";
import { app } from "../../utils/firebase";
import Image from "next/image";

function Cover({ onImageUrlChange }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // for loading state
  const storage = getStorage(app);

  function handleChange(e) {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setLoading(true); 
    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
    
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload Progress: ${progress}%`);
      },
      (error) => {
        console.error(error);
        setLoading(false); 
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUrlChange(downloadURL);
          setFile(downloadURL);
          setLoading(false); 
          console.log("File available at", downloadURL);
        });
      }
    );
  }

  return (
    <div className={styles.cover}>
      <p>Upload a cover :</p>
      <input className={styles.input} type="file" onChange={handleChange} />

      <div className={styles.imageContainer}>
        {loading ? (
          <p>Uploading...</p> 
        ) : (
          <Image
            src={file || "/default.png"} 
            width={200}
            height={120}
            alt="Uploaded"
          />
        )}
      </div>
    </div>
  );
}

export default Cover;
