
import prisma from "../../utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {

  const popQuery = {
    take: 3,
    orderBy: { views: 'desc' },
  };
 
  try {
   
    const [categories,popCategories] = await prisma.$transaction([
      prisma.category.findMany(),
      prisma.category.findMany(popQuery)

    ])
  
    return new NextResponse(JSON.stringify({categories,popCategories}, { status: 200 }));
   
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
