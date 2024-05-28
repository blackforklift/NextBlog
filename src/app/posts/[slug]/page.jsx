import Menu from "../../components/menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "../../components/comments/Comments";

// const resizeImageURLs = (html) => {
//   const imgRegex = /<img.*?src="(.*?)".*?>/g;
//   const resizedHTML = html?.replace(imgRegex, (match, url) => {
//     return `<img class="${styles.responsiveImage}" src="${url}" />`;
//   });
//   return resizedHTML;
// };

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
 
  // const resizedDescription = resizeImageURLs(data?.desc);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.user}>
            {data?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image src={data.user.image} alt="" fill className={styles.avatar} />
              </div>
            )}
            <span className={styles.username}>{data?.user.name}</span>
            <span className={styles.date}>{data.createdAt.substring(0, 10)}</span>
          </div>
        </div>

        {/* {data?.img && (
          <div className={styles.imageContainer}>
            <Image src={data.img} alt="" fill className={styles.image} />  //cover picture
          </div>
        )} */}
      </div>
      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.post}>
          {/* Set dangerouslySetInnerHTML with resized HTML */}
          <div dangerouslySetInnerHTML={{ __html: data?.desc }} />

          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
