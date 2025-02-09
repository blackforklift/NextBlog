import { NextResponse } from "next/server";
import prisma from "../../utils/connect";
import { getAuthSession } from "../../utils/auth";

export const GET = async (req, { params }) => {
  const { slug } = params;


  const sanitizedSlug = slug.replace(/[^a-zA-Z0-9@._-]/g, "");

  try {
    const profile = await prisma.user.findUnique({
      where: { email: sanitizedSlug },
      select: {
        name: true,
        email: true,
        image: true,
        desc: true,
      },
    });

    if (!profile) {
      return new NextResponse(
        JSON.stringify({ message: "User not found!" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(profile), { status: 200 });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};


export const PUT = async (req, { params }) => {
  const { slug } = params;
  const session = await getAuthSession();


  if (!session || session.user.email !== slug) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }),
      { status: 401 }
    );
  }

  try {
    const { name, image, desc } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: slug },
      data: { name, image, desc },
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    console.error("Error updating user data:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
