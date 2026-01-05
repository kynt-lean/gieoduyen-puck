import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Template from "@lib/models/Template";
import UserPage from "@lib/models/UserPage";
import connectDB from "@lib/mongodb";

// GET - Get single userPage by userPageId (authenticated - my pages)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userPageId: string }> }
) {
  try {
    await connectDB();
    const { userPageId } = await params;

    // Get userId from cookie
    const cookieStore = await cookies();
    const userSession = cookieStore.get("gieoduyen-user-session");
    const usernameCookie = cookieStore.get("gieoduyen-username");
    
    if (!userSession || userSession.value !== "user") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get userId from username cookie or default to "user"
    const userId = usernameCookie?.value || "user";

    const userPage = await UserPage.findOne({ _id: userPageId, userId }).lean();

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

// PUT - Update userPage
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userPageId: string }> }
) {
  try {
    await connectDB();
    const { userPageId } = await params;

    // Get userId from cookie
    const cookieStore = await cookies();
    const userSession = cookieStore.get("gieoduyen-user-session");
    const usernameCookie = cookieStore.get("gieoduyen-username");
    
    if (!userSession || userSession.value !== "user") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get userId from username cookie or default to "user"
    const userId = usernameCookie?.value || "user";
    const { pageData } = await request.json();

    if (!pageData) {
      return NextResponse.json(
        { error: "pageData is required" },
        { status: 400 }
      );
    }

    const userPage = await UserPage.findOneAndUpdate(
      { _id: userPageId, userId },
      { pageData },
      { new: true, runValidators: true }
    ).lean();

    if (!userPage) {
      return NextResponse.json(
        { error: "User page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ userPage });
  } catch (error) {
    console.error("Error updating user page:", error);
    return NextResponse.json(
      { error: "Failed to update user page" },
      { status: 500 }
    );
  }
}

// DELETE - Delete userPage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userPageId: string }> }
) {
  try {
    await connectDB();
    const { userPageId } = await params;

    // Get userId from cookie
    const cookieStore = await cookies();
    const userSession = cookieStore.get("gieoduyen-user-session");
    const usernameCookie = cookieStore.get("gieoduyen-username");
    
    if (!userSession || userSession.value !== "user") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get userId from username cookie or default to "user"
    const userId = usernameCookie?.value || "user";

    const userPage = await UserPage.findOneAndDelete({ _id: userPageId, userId });

    if (!userPage) {
      return NextResponse.json(
        { error: "User page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user page:", error);
    return NextResponse.json(
      { error: "Failed to delete user page" },
      { status: 500 }
    );
  }
}

