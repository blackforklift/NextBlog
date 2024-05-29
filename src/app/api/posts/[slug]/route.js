import prisma from "../../../utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "../../../utils/auth";
import { update } from "firebase/database";
import { generateRandomColor } from "../../utils/utils";

// GET SINGLE POST
export const GET = async (req, { params }) => {
  const { slug } = params;

  try {
    // Fetch the post and its associated category ID
    const { catSlug } = await prisma.post.findUnique({
      where: { slug },
      select: { catSlug: true },
    });

    // Increment the post views
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { user: true, cat: true },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));

  } catch (err) {
    console.error("Error updating views:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

//EDIT PATCH POST
export const PATCH = async (req, { params }) => {
  try {
    const body = await req.json();
    const session = await getAuthSession();

    if (!session) {
      return new NextResponse(
        JSON.stringify({ message: "Not Authenticated!" }),
        { status: 401 }
      );
    }

    const { user } = session;
    const { slug } = params;
    const { catSlug } = body;

    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Post not found!" }), {
        status: 404,
      });
    }

    if (post.userEmail !== user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized to edit this post!" }),
        { status: 403 }
      );
    }

    let category = await prisma.category.findUnique({
      where: { slug: catSlug },
    });

    // If the category doesn't exist, create it
    if (!category) {
      const randomColor = generateRandomColor();
      category = await prisma.category.create({
        data: {
          slug: catSlug || "Default Category",
          title: catSlug,
          color: randomColor,
        },
      });
    }

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: { ...body },
    });

    console.log("updatedPost:", updatedPost);
    console.log("originalPost:", post);

    return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong in routing!",
        error: err.message,
      }),
      { status: 500 }
    );
  }
};
