"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react"; 
import "react-quill/dist/quill.bubble.css"; // Import Quill styles
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { app } from "../../../utils/firebase";
import Cover from "../../../components/cover/Cover";
import styles from "../writePage.module.css";
import { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";

const storage = getStorage(app);
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
Quill.register('modules/imageResize', ImageResize);

function WritePage({ params }) {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  const [content, setContent] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState("");
  const { slug } = params || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const processedUrls = new Set();

  useEffect(() => {
    // Redirect unauthenticated users
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (slug) {
      setIsEditMode(true);
      fetchPostData(slug);
    }
  }, [slug]);

  const fetchPostData = async (slug) => {
    const res = await fetch(`/api/posts/${slug}`);
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
      [{ header: [1, 2, 3, 4, false] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ 'font': [] }, { 'size': [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }],
      ["clean"],
    ],
    clipboard: {
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
    "size",
  ];

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleImageUrlChange = (url) => {
    setMedia(url);
  };

  const handleSubmit = async () => {
    try {
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(content, 'text/html');
      const imgs = htmlDoc.querySelectorAll('img');
      
      // Add id to headings
      const headings = htmlDoc.querySelectorAll('h1, h2, h3');      
      headings.forEach(heading => {
        const text = heading.textContent || heading.innerText;
        const id = text.toLowerCase();
        heading.id = id;
      });

      await Promise.all(Array.from(imgs).map(async (img) => {
        let url = img.getAttribute('src');

        if (!url.startsWith("https://firebase") && !processedUrls.has(url)) {
          processedUrls.add(url);

          const name = new Date().getTime() + 1;
          const storageRef = ref(storage, name.toString());

          await uploadString(storageRef, url, 'data_url').then(async (snapshot) => {
            const downloadUrl = await getDownloadURL(storageRef);
            img.setAttribute('src', downloadUrl);
          }).catch(error => {
            console.error('Error uploading:', error);
          });
        }
      }));

      const updatedContent = new XMLSerializer().serializeToString(htmlDoc.documentElement);
      setContent(updatedContent);

      const method = isEditMode ? "PATCH" : "POST";
      const endpoint = isEditMode ? `/api/posts/${slug}` : `/api/posts`;

      const res = await fetch(endpoint, {
        method: method,
        body: JSON.stringify({
          title: title,
          img: media,
          desc: updatedContent,
          slug: slugify(title),
          catSlug: catSlug.toLowerCase() || "unknown",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/posts/${data.slug}`);
      } else {
        const errorText = await res.text();
        console.error("Error submitting post:", errorText);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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
    </div>
  );
}

export default WritePage;
