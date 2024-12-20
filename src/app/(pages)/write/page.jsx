"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css"; 
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import styles from "./writePage.module.css";
import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../utils/firebase";
import Cover from "../../components/cover/Cover";
import ImageResize from "quill-image-resize-module-react";
import { Quill } from "react-quill";

const storage = getStorage(app);

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

Quill.register("modules/imageResize", ImageResize);

function WritePage() {
  const { data: session,status} = useSession(); 
  const router = useRouter();

  const [content, setContent] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    console.log("session:",session,status)
    if (!session || (session.user.role !== "author" && session.user.role !== "admin")) {

      router.push("/error");
    }
  }, [session, status, router]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ font: [] }, { size: [] }][({ list: "ordered" }, { list: "bullet" })],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }],

      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
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
    "size",
  ];

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Set to keep track of processed URLs
  const processedUrls = new Set();

  const handleEditorChange = async (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    console.log("Submitting post...");
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(content, "text/html");
    const imgs = htmlDoc.querySelectorAll("img");

    //add id to headings
    const headings = htmlDoc.querySelectorAll("h1, h2, h3");

    headings.forEach((heading) => {
      const text = heading.textContent || heading.innerText;
      const id = text.toLowerCase();
      heading.id = id;
    });

    // Extract the src attribute value from each img element
    await Promise.all(
      Array.from(imgs).map(async (img) => {
        let url = img.getAttribute("src");
        console.log("url", url);

        // Check if the URL doesn't start with "firebase" and is not already processed
        if (!url.startsWith("https://firebase") && !processedUrls.has(url)) {
          processedUrls.add(url); // Add URL to processed set

          const name = new Date().getTime() + 1;
          console.log("n.:", name.toString());
          const name_string = name.toString();
          const storageRef = ref(storage, name_string);

          await uploadString(storageRef, url, "data_url")
            .then(async (snapshot) => {
              console.log("Uploaded " + name_string + " data_url string!");
              // Download the uploaded URL
              const downloadUrl = await getDownloadURL(storageRef);
              // Replace the src attribute with the downloaded URL
              img.setAttribute("src", downloadUrl);
              console.log("Downloaded URL:", downloadUrl);
            })
            .catch((error) => {
              console.error("Error uploading:", error);
            });
        }
      })
    );

    // Serialize the updated HTML document back to string
    const updatedContent = new XMLSerializer().serializeToString(
      htmlDoc.documentElement
    );

    setContent(updatedContent);
   

    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        img: media,
        desc: updatedContent,
        slug: slugify(title),
        catSlug: catSlug || "coding",
        ispublished: true,
      }),
    });

    console.log("Response status:", res.status);
    if (res.status === 200) {
      const data = await res.json();
      console.log("Post submitted successfully:", data);
      router.push(`/posts/${data.slug}`);
    } else {
      console.error("Error submitting post:", await res.text());
    }
  };




  const handleDraft = async () => {
    console.log("saving post...");
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(content, "text/html");
    const imgs = htmlDoc.querySelectorAll("img");

    //add id to headings
    const headings = htmlDoc.querySelectorAll("h1, h2, h3");

    headings.forEach((heading) => {
      const text = heading.textContent || heading.innerText;
      const id = text.toLowerCase();
      heading.id = id;
    });

    // Extract the src attribute value from each img element
    await Promise.all(
      Array.from(imgs).map(async (img) => {
        let url = img.getAttribute("src");
        console.log("url", url);

        // Check if the URL doesn't start with "firebase" and is not already processed
        if (!url.startsWith("https://firebase") && !processedUrls.has(url)) {
          processedUrls.add(url); // Add URL to processed set

          const name = new Date().getTime() + 1;
          console.log("n.:", name.toString());
          const name_string = name.toString();
          const storageRef = ref(storage, name_string);

          await uploadString(storageRef, url, "data_url")
            .then(async (snapshot) => {
              console.log("Uploaded " + name_string + " data_url string!");
              // Download the uploaded URL
              const downloadUrl = await getDownloadURL(storageRef);
              // Replace the src attribute with the downloaded URL
              img.setAttribute("src", downloadUrl);
              console.log("Downloaded URL:", downloadUrl);
            })
            .catch((error) => {
              console.error("Error uploading:", error);
            });
        }
      })
    );

    // Serialize the updated HTML document back to string
    const updatedContent = new XMLSerializer().serializeToString(
      htmlDoc.documentElement
    );

    setContent(updatedContent);


    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        img: media,
        desc: updatedContent,
        slug: slugify(title),
        catSlug: catSlug || "coding",
        ispublished:false,
       
      }),
    });

    console.log("Response status:", res.status);
    if (res.status === 200) {
      const data = await res.json();
      console.log("Post drafted successfully:", data);
      router.push(`/`);
    } else {
      console.error("Error drafting post:", await res.text());
    }
  };




  const handleImageUrlChange = (url) => {
    setMedia(url);
    console.log("media is :", media);
  };

  return (
    <div className={styles.container}>
      <Cover onImageUrlChange={handleImageUrlChange} />
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
        Publish
      </button>

      <button className={styles.draft} onClick={handleDraft}>
        Save to drafts
      </button>
    </div>
  );
}

export default WritePage;
