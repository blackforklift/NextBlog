import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from "./cover.module.css";
import { app } from "../../utils/firebase";

function Cover({ onImageUrlChange }) {
  const [file, setFile] = useState();
  const storage = getStorage(app);

  function handleChange(e) {
    const imageFile = e.target.files[0];
 
 
    const storageRef = ref(storage, `images/${imageFile.name}`); // Provide a path where you want to store the file
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // Pass imageFile directly

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress
      },
      (error) => {
        // Handle errors
        console.error(error);
      },
      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUrlChange(downloadURL)
          setFile(downloadURL)
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  return (
    <div  className={styles.cover}>
      <p>Upload a cover :</p>
      <input className={styles.input}  type="file" onChange={handleChange} />
      {/* <img src={file} alt="Uploaded"/> */}
      {file && <img src={file} alt="Uploaded" />}
    </div>
  );
}

export default Cover;
