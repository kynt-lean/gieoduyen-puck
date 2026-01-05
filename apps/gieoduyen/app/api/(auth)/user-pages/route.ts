import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Template from "@lib/models/Template";
import UserPage from "@lib/models/UserPage";
import connectDB from "@lib/mongodb";

// GET - List all userPages for the authenticated user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

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

    const userPages = await UserPage.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    // Populate template information
    const userPagesWithTemplates = await Promise.all(
      userPages.map(async (userPage) => {
        const template = await Template.findById(userPage.templateId)
          .select("name slug description thumbnail")
          .lean();
        return {
          ...userPage,
          template,
        };
      })
    );

    return NextResponse.json({ userPages: userPagesWithTemplates });
  } catch (error) {
    console.error("Error fetching user pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch user pages" },
      { status: 500 }
    );
  }
}

// POST - Create new userPage
export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    const { templateId, pageData } = await request.json();

    if (!templateId || !pageData) {
      return NextResponse.json(
        { error: "templateId and pageData are required" },
        { status: 400 }
      );
    }

    // Verify template exists
    const template = await Template.findById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Get userId from username cookie or default to "user"
    const userId = usernameCookie?.value || "user";

    // Check if userPage already exists for this user and template
    const existingUserPage = await UserPage.findOne({ userId, templateId });
    if (existingUserPage) {
      return NextResponse.json(
        { error: "User page already exists for this template" },
        { status: 409 }
      );
    }

    const userPage = await UserPage.create({
      userId,
      templateId,
      pageData,
    });

    return NextResponse.json({ userPage }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user page:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User page already exists for this template" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user page" },
      { status: 500 }
    );
  }
}

