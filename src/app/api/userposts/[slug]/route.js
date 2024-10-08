import prisma from "../../../utils/connect";
import { NextResponse } from "next/server";

// GET published POSTS OF A USER
export const GET = async (req, { params }) => {
  const { slug: userEmail } = params;

  try {
    // Fetch published posts of the user
    const posts = await prisma.post.findMany({
      where: {
        user: {
          email: userEmail,
        },
        ispublished: true, // for published posts
      },
      orderBy: {
        createdAt: 'desc', // newest to oldest
      },
    });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
