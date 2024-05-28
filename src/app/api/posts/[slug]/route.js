import prisma from "../../../utils/connect";
import { NextResponse } from "next/server";

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

    // console.log("Post:", post);
    // console.log("Category Slug:", post.cat.slug);

    // Fetch the current category views
    const currentCategory = await prisma.category.findUnique({
      where: { slug: catSlug },
      select: { views: true },
    });

    // console.log("Current Category:", currentCategory);

    // Calculate the updated cat views
    const updatedCatViews = currentCategory.views + 1;

    // Update the cat views with the calculated value
    const updatedPost = await prisma.category.update({
      where: { slug: catSlug },
      data: { views: updatedCatViews },
    });

    // console.log("Updated Post:", updatedPost);

    // Fetch the updated post separately and log its views
    const finalPost = await prisma.category.findUnique({
      where: { slug: catSlug },
    });

    // console.log("Final Post:", finalPost);

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.error("Error updating views:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

export const PUT  = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const postid = searchParams.get("id");
    const session = await getAuthSession();
    const { user } = session; // Assuming user information is passed in the session

    if (!postid) {
      return new NextResponse(
        JSON.stringify({ message: "Missing postId parameter!" }, { status: 400 })
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postid },
      select: { userEmail: true },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found!" }, { status: 404 })
      );
    }

    // Check if the user is the author of the post
    if (post.userEmail !== user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized to edit this post!" }, { status: 403 })
      );
    }

    const UpdatedPost = await prisma.post.update({
      where: { id: postid },
      data: body
    });




    return new NextResponse(JSON.stringify(UpdatedPost, { status: 200 }));
  } catch (err) {
    console.log(err); // Log the error message
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
