"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../utils/firebase";
import ReactQuill from "react-quill";

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState([]);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");



useEffect(() => {
    // import Quill 
    import("react-quill").then((Quill) => {
      import("react-quill/dist/quill.bubble.css");

    });
  }, []);
  useEffect(() => {
    const storage = getStorage(app);
    const upload = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");         
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia((prevMedia) => [...prevMedia, downloadURL]);
          });
        }
      );
    };

    file && upload();
  }, [file]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }
  {media && (
    <div className={styles.mediaPreview}>
      <img src={media[0]} alt="Uploaded Media" className={styles.mediaPreviewImage} />
    </div>
  )}
  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        slug: slugify(title),
        catSlug: catSlug || "coding", //If not selected, choose the general category
      }),
      
    });

    if (res.status === 200) {
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
     
            <input
        type="text"
        className={styles.select}
        onChange={(e) => setCatSlug(e.target.value)}
        placeholder="Enter category"
      />

      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <button className={styles.addButton}>
              <label htmlFor="image">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>

          </div>
        )}
        <ReactQuill
          className={styles.textArea}
       
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell me...."
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};




// "use client";

// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.bubble.css"; // Import Quill styles
// import { useRouter } from "next/navigation";
// import styles from "./writePage.module.css";
// import { useEffect, useState } from "react";

// const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

// function WritePage() {
//   const [content, setContent] = useState("");
//   const [catSlug, setCatSlug] = useState("");
//   const [file, setFile] = useState(null);
//   const [media, setMedia] = useState([]);
//   const router = useRouter();

//   const [title, setTitle] = useState("");

//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image"],
//       [{ align: [] }],
//       [{ color: [] }],
//       ["code-block"],
//       ["clean"],
//     ],
//   };

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "link",
//     "image",
//     "align",
//     "color",
//     "code-block",
//   ];
//   const slugify = (str) =>
//   str
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/[\s_-]+/g, "-")
//     .replace(/^-+|-+$/g, "");


    
//     const handleSubmit = async () => {
//       console.log("Submitting post...");
//       const res = await fetch("/api/posts", {
//         method: "POST",
//         body: JSON.stringify({
//           title:title,
//           img:"/food.png",
//           desc: content,
//           slug: slugify(title),
//           catSlug: catSlug || "coding",
//         }),
//       });
    
//       console.log("Response status:", res.status);
//       if (res.status === 200) {
//         const data = await res.json();
//         console.log("Post submitted successfully:", data);
//         router.push(`/posts/${data.slug}`);
//       } else {
//         console.error("Error submitting post:", await res.text());
//       }
//     };


//   const handleEditorChange = (newContent) => {
//     setContent(newContent);
 

//   };
  

// console.log("content",content ,"type of it : ",typeof content)
//   return (
//     <div className={styles.container}>
//       <input
//         type="text"
//         placeholder="Title"
//         className={styles.input}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <input
//         type="text"
//         className={styles.select}
//         onChange={(e) => setCatSlug(e.target.value)}
//         placeholder="Enter category"
//       />

//       <div className={styles.editor}>
//                {" "}
//         <QuillEditor
//          className={styles.textArea}
         
//           value={content}
//           onChange={handleEditorChange}
//           modules={quillModules}
//           formats={quillFormats}
//           placeholder="Tell me...."
//           theme="bubble"
//         />
//       </div>
//       <button className={styles.publish} onClick={handleSubmit}>Publish</button>
//     </div>
//   );
// }

// export default WritePage;
