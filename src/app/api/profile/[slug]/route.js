import { NextResponse } from "next/server";
import prisma from "../../../utils/connect";
import { getAuthSession } from "../../../utils/auth"
// get user data
export const GET = async (req, { params }) => {
  const { slug } = params;
  

  const session = await getAuthSession();

  if (session.user.email !== slug) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { email: slug },
    });

   return new NextResponse(JSON.stringify(profile), { status: 200 });

   
  } catch (err) {
    console.error("Error fetching user data:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// update user data
export const PUT = async (req, { params }) => {
  const { slug } = params;

  const session = await getAuthSession();

  if (session.user.email !== slug) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }
  try {
    const { name, image } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: slug },
      data: { name, image },
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
