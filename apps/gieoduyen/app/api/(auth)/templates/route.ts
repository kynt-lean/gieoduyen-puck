import { NextResponse } from "next/server";
import Template from "@lib/models/Template";
import connectDB from "@lib/mongodb";

// GET - List all active templates (for users)
export async function GET() {
  try {
    await connectDB();

    // Only return active templates for users
    const templates = await Template.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("name slug description thumbnail createdAt updatedAt")
      .lean();

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

