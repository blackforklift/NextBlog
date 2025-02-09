import prisma from "../../../utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { slug: userEmail } = params;

  try {
 
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true }, 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

  
    const savedPosts = await prisma.bookmark.findMany({
      where: { userId: user.id }, 
      include: {
        post: true, 
      },
    });

    const posts = savedPosts.map((bookmark) => bookmark.post);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
};
