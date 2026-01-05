"use client";

import ThumbnailImage from "@components/ThumbnailImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Template {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserPage {
  _id: string;
  userId: string;
  templateId: string;
  pageData: any;
  template?: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    thumbnail?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TemplatesClient() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userPages, setUserPages] = useState<UserPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Get username from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const user = getCookie("gieoduyen-username") || "user";
    setUsername(user);
    
    fetchTemplates();
    fetchUserPages();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      const data = await response.json();
      if (response.ok) {
        setTemplates(data.templates);
      } else {
        console.error("Error fetching templates:", data.error);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPages = async () => {
    try {
      const response = await fetch("/api/user-pages");
      const data = await response.json();
      if (response.ok) {
        setUserPages(data.userPages || []);
      } else {
        console.error("Error fetching user pages:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user pages:", error);
    }
  };

  // Filter templates that user hasn't created pages for
  const templateIdsWithPages = new Set(userPages.map((up) => up.templateId));
  const availableTemplates = templates.filter(
    (template) => true
  );

  const handleCreatePage = async (templateId: string) => {
    try {
      // Get template data
      const templateResponse = await fetch(`/api/templates/${templates.find(t => t._id === templateId)?.slug}`);
      const templateData = await templateResponse.json();
      
      if (!templateData.template) {
        alert("Không tìm thấy template");
        return;
      }

      // Create userPage with template's initialData
      const response = await fetch("/api/user-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          pageData: templateData.template.initialData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to edit page
        router.push(`/${username}/${data.userPage._id}/edit`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Lỗi khi tạo trang");
      }
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Lỗi khi tạo trang");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải...</div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", background: "#ffffff", minHeight: "100vh" }}>
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem", fontSize: "2rem", color: "#333" }}>
          Quản lý Templates
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          Quản lý các trang của bạn hoặc tạo trang mới từ template
        </p>
      </div>

      {/* User Pages Panel */}
      {userPages.length > 0 && (
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#333" }}>
            Trang của bạn ({userPages.length})
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {userPages.map((userPage) => (
              <div
                key={userPage._id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "0",
                  background: "white",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                }}
              >
                <ThumbnailImage
                  thumbnail={userPage.template?.thumbnail}
                  alt={`${userPage.template?.name || "Untitled"} thumbnail`}
                />
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1.25rem", color: "#333" }}>
                    {userPage.template?.name || "Untitled"}
                  </h3>
                  {userPage.template?.description && (
                    <p
                      style={{
                        color: "#666",
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {userPage.template.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <Link
                      href={`/${username}/${userPage._id}`}
                      style={{
                        flex: 1,
                        padding: "0.75rem 1rem",
                        background: "#0070f3",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        textAlign: "center",
                        transition: "background 0.2s",
                        fontWeight: "500",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#0051cc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#0070f3";
                      }}
                    >
                      Xem trang
                    </Link>
                    <Link
                      href={`/${username}/${userPage._id}/edit`}
                      style={{
                        flex: 1,
                        padding: "0.75rem 1rem",
                        background: "#f0f0f0",
                        color: "#333",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        textAlign: "center",
                        transition: "background 0.2s",
                        fontWeight: "500",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e0e0e0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f0f0f0";
                      }}
                    >
                      Chỉnh sửa
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Templates */}
      <div>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#333" }}>
          Templates có sẵn ({availableTemplates.length})
        </h2>
        {availableTemplates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <p style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1.5rem" }}>
              Bạn đã tạo trang cho tất cả templates có sẵn.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {availableTemplates.map((template) => (
              <div
                key={template._id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "0",
                  background: "white",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                }}
              >
                <ThumbnailImage
                  thumbnail={template.thumbnail}
                  alt={`${template.name} thumbnail`}
                />
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1.25rem", color: "#333" }}>
                    {template.name}
                  </h3>
                  {template.description && (
                    <p
                      style={{
                        color: "#666",
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {template.description}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <button
                      onClick={() => handleCreatePage(template._id)}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        background: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        textAlign: "center",
                        transition: "background 0.2s",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#0051cc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#0070f3";
                      }}
                    >
                      Tạo trang mới
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

