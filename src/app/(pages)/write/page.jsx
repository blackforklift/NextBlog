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

const storage = getStorage(app);

// Dynamically import ReactQuill (Quill is inside this module)
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

function WritePage() {
  const { data: session, status } = useSession(); 
  const router = useRouter();

  const [quillModules, setQuillModules] = useState(null);
  const [content, setContent] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-quill").then((ReactQuillModule) => {
        const Quill = ReactQuillModule.Quill || ReactQuillModule.default.Quill;
        import("quill-image-resize-module-react").then((ImageResizeModule) => {
          const ImageResize = ImageResizeModule.default;
          
          //if Quill is available
          if (Quill) {
            Quill.register("modules/imageResize", ImageResize);
          }

          // Set Quill modules dynamically
          setQuillModules({
            toolbar: [
              [{ header: [1, 2, 3, 4, false] }],
              [{ size: ["small", false, "large", "huge"] }],
              ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
              [{ font: [] }, { size: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              [{ align: [] }],
              [{ color: [] }],
              ["clean"],
            ],
            clipboard: { matchVisual: false },
            imageResize: {
              parchment: Quill.import("parchment"),
              modules: ["Resize", "DisplaySize"],
            },
          });
        });
      });
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user.role !== "author" && session.user.role !== "admin")) {
      router.push("/error");
    }
  }, [session, status, router]);

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

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    console.log("Submitting post...");
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        img: media,
        desc: content,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        catSlug: catSlug || "coding",
        ispublished: true,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      console.log("Post submitted successfully:", data);
      router.push(`/posts/${data.slug}`);
    } else {
      console.error("Error submitting post:", await res.text());
    }
  };

  return (
    <div className={styles.container}>
     <Cover onImageUrlChange={setMedia} />
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
        {quillModules ? (
          <QuillEditor
            className={styles.textArea}
            value={content}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Tell me...."
            theme="bubble"
          />
        ) : (
          <p>Loading editor...</p>
        )}
      </div>

      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
}

export default WritePage;
