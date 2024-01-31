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
