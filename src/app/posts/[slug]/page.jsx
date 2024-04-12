import Menu from "../../components/menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "../../components/comments/Comments";


// Function to resize image URLs and add width to img tag
const resizeImageURLs = (html) => {
  // Define the maximum width for the resized images
  const maxWidth = 320; 

  // Regular expression to find image tags
  const imgRegex = /<img.*?src="(.*?)".*?>/g;

  // add inline style for width
  const resizedHTML = html.replace(imgRegex, (match, url) => {
  
    return `<img src="${url}" style="max-width: ${maxWidth}px;" />`; // Add inline style for max-width
  });

  return resizedHTML;
};


const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}?`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const SinglePage = async ({ params }) => {
  const { slug } = params;

  const data = await getData(slug);
  console.log("data:", data);

  // Resize image URLs in the description
  const resizedDescription = resizeImageURLs(data?.desc);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.user}>
            {data?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image src={data.user.image} alt="" layout="fill" className={styles.avatar} />
              </div>
            )}
            <span className={styles.username}>{data?.userEmail}</span>
            <span className={styles.date}>{data.createdAt.substring(0, 10)}</span>
          </div>
        </div>

        {data?.img && (
          <div className={styles.imageContainer}>
            <Image src={data.img} alt="" layout="fill" className={styles.image} />
          </div>
        )}
      </div>
      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.post}>
          {/* Set dangerouslySetInnerHTML with resized HTML */}
          <div dangerouslySetInnerHTML={{ __html: resizedDescription }} />

          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
