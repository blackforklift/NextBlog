import prisma from "../../utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "../../utils/auth";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  // Parse the 'page' parameter into an integer, defaulting to 1 if not provided
  const page = parseInt(searchParams.get("page")) || 1;
  const cat = searchParams.get("cat");
  const id = searchParams.get("id");

  const POST_PER_PAGE = 3;

  // Ensure that 'page' is a positive integer
  const skip = Math.max(0, POST_PER_PAGE * (page - 1));

 //popularity

 const popQuery = {
  take: 5,
  orderBy: { views: 'desc' },
  where: {
    ...(cat && { catSlug: cat }),
  },
  include:{ user: true ,cat:true}
};
  const query = {
    take: POST_PER_PAGE,
    skip: skip,
    orderBy: { createdAt: 'desc' }, // Order by creation date in descending order
    where: {
      ...(id,cat && { catSlug: cat }),
    },
  };

  try {
    const [posts, count ,popularity] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
      prisma.post.findMany(popQuery)

    ]);

    return new NextResponse(JSON.stringify({ posts, count,popularity }, { status: 200 }));
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
// DELETE A POST
export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const postid = searchParams.get("id");
   console.log("post id: ",postid)

    if (!postid) {
      return new NextResponse(
        JSON.stringify({ message: "Missing postId parameter!" }, { status: 400 })
      );
    }

    const deletedPost = await prisma.post.delete({
      where: { id:postid },
    });

    return new NextResponse(JSON.stringify(deletedPost, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(

      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// CREATE A POST
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const { catSlug } = body;

    // Check if the specified category exists
    let category = await prisma.category.findUnique({
      where: { slug: catSlug },
    });

    function generateRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    const randomcolor =generateRandomColor();
    // If the category doesn't exist, create it
    if (!category) {
      category = await prisma.category.create({
        data: { slug: catSlug || "Default Category", title: catSlug,color:randomcolor },
      });
    
    }
    const post = await prisma.post.create({
      data: { ...body, userEmail: session.user.email },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};