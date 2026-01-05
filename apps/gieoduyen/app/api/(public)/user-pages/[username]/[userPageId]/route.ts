import { NextRequest, NextResponse } from "next/server";
import UserPage from "@lib/models/UserPage";
import Template from "@lib/models/Template";
import connectDB from "@lib/mongodb";

// GET - Get userPage by username and userPageId (public route)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; userPageId: string }> }
) {
  try {
    await connectDB();
    const { username, userPageId } = await params;

    const userPage = await UserPage.findOne({
      _id: userPageId,
      userId: username,
    }).lean();

    if (!userPage) {
      return NextResponse.json(
        { error: "User page not found" },
        { status: 404 }
      );
    }

    // Populate template information
    const template = await Template.findById(userPage.templateId)
      .select("name slug description thumbnail")
      .lean();

    return NextResponse.json({
      userPage: {
        ...userPage,
        template,
      },
    });
  } catch (error) {
    console.error("Error fetching user page:", error);
    return NextResponse.json(
      { error: "Failed to fetch user page" },
      { status: 500 }
    );
  }
}

