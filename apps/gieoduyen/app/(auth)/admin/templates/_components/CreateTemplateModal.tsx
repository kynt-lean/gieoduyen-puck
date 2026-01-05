"use client";

import { useState } from "react";

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

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSuccess: (slug: string) => void;
}

export default function CreateTemplateModal({
  isOpen,
  onClose,
  templates,
  onSuccess,
}: CreateTemplateModalProps) {
  const [formData, setFormData] = useState({
    copyFromSlug: "",
    name: "",
    slug: "",
    thumbnailUrl: "",
    thumbnailFile: null as File | null,
    thumbnailType: "url" as "url" | "file",
  });
  const [creating, setCreating] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File ảnh không được vượt quá 5MB");
        return;
      }
      setFormData({ ...formData, thumbnailFile: file, thumbnailType: "file" });
      const preview = await convertFileToBase64(file);
      setThumbnailPreview(preview);
    }
  };

  const handleThumbnailUrlChange = (url: string) => {
    setFormData({
      ...formData,
      thumbnailUrl: url,
      thumbnailType: "url",
      thumbnailFile: null,
    });
    setThumbnailPreview(url || null);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.copyFromSlug) {
      alert("Vui lòng chọn template để sao chép");
      return;
    }

    if (!formData.name || !formData.slug) {
      alert("Vui lòng điền đầy đủ tên và slug");
      return;
    }

    setCreating(true);
    try {
      // Process thumbnail
      let thumbnail: string | undefined = undefined;
      if (formData.thumbnailType === "file" && formData.thumbnailFile) {
        thumbnail = await convertFileToBase64(formData.thumbnailFile);
      } else if (formData.thumbnailType === "url" && formData.thumbnailUrl.trim()) {
        thumbnail = formData.thumbnailUrl.trim();
      }

      const response = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          copyFromSlug: formData.copyFromSlug,
          name: formData.name,
          slug: formData.slug.toLowerCase().trim(),
          thumbnail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          copyFromSlug: "",
          name: "",
          slug: "",
          thumbnailUrl: "",
          thumbnailFile: null,
          thumbnailType: "url",
        });
        setThumbnailPreview(null);
        onSuccess(data.template.slug);
      } else {
        alert(data.error || "Lỗi khi tạo template");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Lỗi khi tạo template");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setFormData({
        copyFromSlug: "",
        name: "",
        slug: "",
        thumbnailUrl: "",
        thumbnailFile: null,
        thumbnailType: "url",
      });
      setThumbnailPreview(null);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
          Tạo Template Mới
        </h2>
        <form onSubmit={handleCreateTemplate}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              Sao chép từ template:
            </label>
            <select
              value={formData.copyFromSlug}
              onChange={(e) =>
                setFormData({ ...formData, copyFromSlug: e.target.value })
              }
              required
              disabled={creating}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            >
              <option value="">-- Chọn template --</option>
              {templates.map((template) => (
                <option key={template._id} value={template.slug}>
                  {template.name} ({template.slug})
                  {!template.isActive && " [Chưa kích hoạt]"}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              Tên template:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const newName = e.target.value;
                const newSlug =
                  !formData.slug ||
                  formData.slug === generateSlugFromName(formData.name)
                    ? generateSlugFromName(newName)
                    : formData.slug;
                setFormData({ ...formData, name: newName, slug: newSlug });
              }}
              required
              disabled={creating}
              placeholder="Nhập tên template"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              Slug:
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slug: e.target.value.toLowerCase().trim(),
                })
              }
              required
              disabled={creating}
              placeholder="template-slug"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
            <p
              style={{
                marginTop: "0.25rem",
                fontSize: "0.85rem",
                color: "#666",
              }}
            >
              Slug sẽ được tự động tạo từ tên nếu để trống
            </p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              Thumbnail:
            </label>
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  <input
                    type="radio"
                    checked={formData.thumbnailType === "url"}
                    onChange={() => {
                      setFormData({ ...formData, thumbnailType: "url" });
                      setThumbnailPreview(formData.thumbnailUrl || null);
                    }}
                    disabled={creating}
                  />
                  URL
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  <input
                    type="radio"
                    checked={formData.thumbnailType === "file"}
                    onChange={() => {
                      setFormData({ ...formData, thumbnailType: "file" });
                      setThumbnailPreview(null);
                    }}
                    disabled={creating}
                  />
                  Tải lên
                </label>
              </div>

              {formData.thumbnailType === "url" ? (
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                  disabled={creating}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  disabled={creating}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              )}

              {thumbnailPreview && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    background: "#f9f9f9",
                  }}
                >
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: "0.5rem",
                      fontSize: "0.85rem",
                      color: "#666",
                    }}
                  >
                    Preview:
                  </p>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "4px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={creating}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#f0f0f0",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: creating ? "not-allowed" : "pointer",
                fontSize: "1rem",
                opacity: creating ? 0.6 : 1,
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={creating}
              style={{
                padding: "0.75rem 1.5rem",
                background: creating ? "#999" : "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: creating ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              {creating ? "Đang tạo..." : "Tạo Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

