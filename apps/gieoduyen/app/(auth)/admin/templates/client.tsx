"use client";

import ThumbnailImage from "@components/ThumbnailImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateTemplateModal from "./_components/CreateTemplateModal";

interface Template {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTemplatesClient() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/templates");
      const data = await response.json();
      if (response.ok) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa template này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/templates/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTemplates();
      } else {
        alert("Lỗi khi xóa template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Lỗi khi xóa template");
    }
  };

  const handleToggleActive = async (slug: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/templates/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchTemplates();
      } else {
        alert("Lỗi khi cập nhật trạng thái template");
      }
    } catch (error) {
      console.error("Error toggling template status:", error);
      alert("Lỗi khi cập nhật trạng thái template");
    }
  };

  const handleCreateSuccess = (slug: string) => {
    setShowCreateModal(false);
    router.push(`/admin/templates/${slug}`);
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Quản lý Templates</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0051cc";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0070f3";
          }}
        >
          Tạo Template Mới
        </button>
      </div>

      {templates.length === 0 ? (
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
            Chưa có template nào. Hãy tạo template đầu tiên!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              display: "inline-block",
              fontWeight: "500",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0051cc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0070f3";
            }}
          >
            Tạo Template Mới
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {templates.map((template) => (
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
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
              onClick={() => router.push(`/admin/templates/${template.slug}`)}
            >
              <ThumbnailImage
                thumbnail={template.thumbnail}
                alt={`${template.name} thumbnail`}
              />
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1.25rem" }}>
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
                    marginBottom: "1rem",
                    fontSize: "0.85rem",
                    color: "#888",
                  }}
                >
                  <strong>Slug:</strong> {template.slug}
                </div>
                <div
                  style={{
                    marginBottom: "1rem",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <strong>Trạng thái:</strong>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      background: template.isActive ? "#d4edda" : "#f8d7da",
                      color: template.isActive ? "#155724" : "#721c24",
                    }}
                  >
                    {template.isActive ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #f0f0f0",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    href={`/admin/templates/${template.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      padding: "0.5rem 1rem",
                      background: "#0070f3",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      textAlign: "center",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0051cc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#0070f3";
                    }}
                  >
                    Chỉnh sửa
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(template.slug, template.isActive);
                    }}
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      padding: "0.5rem 1rem",
                      background: template.isActive ? "#ffc107" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      transition: "background 0.2s",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = template.isActive ? "#e0a800" : "#218838";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = template.isActive ? "#ffc107" : "#28a745";
                    }}
                  >
                    {template.isActive ? "Tạm dừng" : "Kích hoạt"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(template.slug);
                    }}
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      padding: "0.5rem 1rem",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#c82333";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#dc3545";
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        templates={templates}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

