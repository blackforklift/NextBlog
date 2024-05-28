"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css"; // Import Quill styles
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { app } from "../../utils/firebase"
import Cover from "../../components/cover/Cover";
import styles from "../writePage.module.css";
import ImageResize from 'quill-image-resize-module-react';
import { Quill } from 'react-quill';
import { Button } from "@mui/material";

const storage = getStorage(app);
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
Quill.register('modules/imageResize', ImageResize);

function WritePage({ params }) {
  const [content, setContent] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { slug } = params || {};
  console.log("slugg sent to writepage",slug)
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (slug) {
      setIsEditMode(true);
      fetchPostData(slug);
    }
  }, [slug]);

  const fetchPostData = async (slug) => {
    const res = await fetch(`http://localhost:3000/api/posts/${slug}?`);
    if (res.ok) {
      const data = await res.json();
      setTitle(data.title);
      setContent(data.desc);
      setCatSlug(data.catSlug);
      setMedia(data.img);
    } else {
      console.error("Error fetching post data:", await res.text());
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }],
      ["code-block"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
  ];
  console.log("edit mode : ",isEditMode)
  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    const method = isEditMode ? "PUT" : "POST";
   
    const endpoint = isEditMode ? `/api/posts/${slug}` : "/api/posts";

    const res = await fetch(endpoint, {
      method: method,
      body: JSON.stringify({
        title: title,
        img: media,
        desc: content,
        slug: slugify(title),
        catSlug: catSlug || "coding",
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    } else {
      console.error("Error submitting post:", await res.text());
    }
  };

   // Set to keep track of processed URLs
   const processedUrls = new Set();

  const handleEditorChange = async (newContent) => {
    setContent(newContent)
    
  };

const upload_images =async ()=>{

  var parser = new DOMParser();
  var htmlDoc = parser.parseFromString(content, 'text/html');
  const imgs = htmlDoc.querySelectorAll('img');

  // Extract the src attribute value from each img element
  await Promise.all(Array.from(imgs).map(async (img) => {
    let url = img.getAttribute('src');
    console.log("url", url);

    // Check if the URL doesn't start with "firebase" and is not already processed
    if (!url.startsWith("https://firebase") && !processedUrls.has(url)) {
      processedUrls.add(url); // Add URL to processed set


      const name = new Date().getTime() + 1;
      console.log("n.:", name.toString());
      const name_string = name.toString();
      const storageRef = ref(storage, name_string);

      await uploadString(storageRef, url, 'data_url').then(async (snapshot) => {
        console.log('Uploaded ' + name_string + ' data_url string!');
        // Download the uploaded URL
        const downloadUrl = await getDownloadURL(storageRef);
        // Replace the src attribute with the downloaded URL
        img.setAttribute('src', downloadUrl);
        console.log('Downloaded URL:', downloadUrl);
      }).catch(error => {
        console.error('Error uploading:', error);
      });
    }
  }));

  // Serialize the updated HTML document back to string
  const updatedContent = new XMLSerializer().serializeToString(htmlDoc.documentElement);

  setContent(updatedContent)
  console.log("Updated Content:", updatedContent);
  

}
 
const handleImageUrlChange = (url) => {
  setMedia(url);
  console.log("media is :",media)
};


  return (
    <div className={styles.container}>
      <Cover onImageUrlChange={handleImageUrlChange} />
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className={styles.select}
        value={catSlug}
        onChange={(e) => setCatSlug(e.target.value)}
        placeholder="Enter category"
      />
      <div className={styles.editor}>
        <QuillEditor
          className={styles.textArea}
          value={content}
          onChange={handleEditorChange}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Tell me...."
          theme="bubble"
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        {isEditMode ? "Update" : "Publish"}
      </button>
      <Button onClick={upload_images}>Upload Images</Button>
    </div>
  );
}

export default WritePage;
