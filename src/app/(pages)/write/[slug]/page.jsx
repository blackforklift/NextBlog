"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import "react-quill/dist/quill.bubble.css"; 
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { app } from "../../../utils/firebase";
import Cover from "../../../components/cover/Cover";
import styles from "../writePage.module.css";

const storage = getStorage(app);

// Dynamically import Quill Editor
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

function WritePage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { slug } = params || {};

  const [content, setContent] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [quillModules, setQuillModules] = useState(null);
  const processedUrls = new Set();

  useEffect(() => {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-quill").then((ReactQuillModule) => {
        const Quill = ReactQuillModule.Quill || ReactQuillModule.default.Quill;
        import("quill-image-resize-module-react").then((ImageResizeModule) => {
          const ImageResize = ImageResizeModule.default;

          if (Quill) {
            Quill.register("modules/imageResize", ImageResize);
          }

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
              modules: ["Resize", "DisplaySize"],
            },
          });
        });
      });
    }
  }, []);

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

  const handleSubmit = async () => {
    try {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(content, "text/html");
      const imgs = htmlDoc.querySelectorAll("img");

      const headings = htmlDoc.querySelectorAll("h1, h2, h3");
      headings.forEach((heading) => {
        const text = heading.textContent || heading.innerText;
        heading.id = text.toLowerCase();
      });

      await Promise.all(
        Array.from(imgs).map(async (img) => {
          let url = img.getAttribute("src");

          if (!url.startsWith("https://firebase") && !processedUrls.has(url)) {
            processedUrls.add(url);

            const name = new Date().getTime() + 1;
            const storageRef = ref(storage, name.toString());

            await uploadString(storageRef, url, "data_url").then(async () => {
              const downloadUrl = await getDownloadURL(storageRef);
              img.setAttribute("src", downloadUrl);
            }).catch((error) => {
              console.error("Error uploading:", error);
            });
          }
        })
      );

      const updatedContent = new XMLSerializer().serializeToString(htmlDoc.documentElement);
      setContent(updatedContent);

      const method = isEditMode ? "PATCH" : "POST";
      const endpoint = isEditMode ? `/api/posts/${slug}` : `/api/posts`;

      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify({
          title,
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
        console.error("Error submitting post:", await res.text());
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
      <Cover />
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
        {isEditMode ? "Update" : "Publish"}
      </button>
    </div>
  );
}

export default WritePage;
