import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Tên đăng nhập và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // Demo credentials for development only
    // TODO: Implement proper authentication for production
    const adminUsername = "admin";
    const adminPassword = "admin123";
    const userUsername = "user";
    const userPassword = "user123";

    const cookieStore = await cookies();

    if (username === adminUsername && password === adminPassword) {
      // Set session cookie with role
      cookieStore.set(
        "gieoduyen-admin-session",
        "admin", // Role is now explicitly set in cookie value
        {
          httpOnly: true,
          secure: false, // TODO: Set to true in production with HTTPS
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }
      );

      return NextResponse.json({ success: true, role: "admin" });
    }

    if (username === userUsername && password === userPassword) {
      // Set session cookie with role
      cookieStore.set(
        "gieoduyen-user-session",
        "user", // Role is now explicitly set in cookie value
        {
          httpOnly: true,
          secure: false, // TODO: Set to true in production with HTTPS
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }
      );

      // Set username cookie for user identification
      cookieStore.set(
        "gieoduyen-username",
        username,
        {
          httpOnly: false, // Allow client-side access for display
          secure: false, // TODO: Set to true in production with HTTPS
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }
      );

      return NextResponse.json({ success: true, role: "user" });
    }

    return NextResponse.json(
      { error: "Tên đăng nhập hoặc mật khẩu không đúng" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

