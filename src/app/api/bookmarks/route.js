import prisma from "../../utils/connect";
import { getAuthSession } from "../../utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  let userId = session.user.id; 

  if (!userId) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    userId = user.id;
  }

  const { postId } = await req.json();

  try {
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { userId, postId },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
      return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
    }

    const newBookmark = await prisma.bookmark.create({
      data: { userId, postId },
    });

    return NextResponse.json(newBookmark, { status: 200 });
  } catch (error) {
    console.error("Error in bookmarking:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
