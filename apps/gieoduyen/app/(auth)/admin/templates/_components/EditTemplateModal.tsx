"use client";

import { useState, useEffect } from "react";

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

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onSuccess: (updatedTemplate: Template) => void;
}

export default function EditTemplateModal({
  isOpen,
  onClose,
  template,
  onSuccess,
}: EditTemplateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    thumbnailUrl: "",
    thumbnailFile: null as File | null,
    thumbnailType: "url" as "url" | "file",
    isActive: false,
  });
  const [saving, setSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (template && isOpen) {
      setFormData({
        name: template.name || "",
        slug: template.slug || "",
        description: template.description || "",
        thumbnailUrl: template.thumbnail || "",
        thumbnailFile: null,
        thumbnailType: template.thumbnail ? "url" : "url",
        isActive: template.isActive ?? false,
      });
      setThumbnailPreview(template.thumbnail || null);
    }
  }, [template, isOpen]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      alert("Vui lòng điền đầy đủ tên và slug");
      return;
    }

    if (!template) {
      alert("Template không tồn tại");
      return;
    }

    setSaving(true);
    try {
      // Process thumbnail
      let thumbnail: string | undefined = undefined;
      if (formData.thumbnailType === "file" && formData.thumbnailFile) {
        thumbnail = await convertFileToBase64(formData.thumbnailFile);
      } else if (formData.thumbnailType === "url" && formData.thumbnailUrl.trim()) {
        thumbnail = formData.thumbnailUrl.trim();
      } else if (formData.thumbnailType === "url" && !formData.thumbnailUrl.trim()) {
        // Nếu xóa thumbnail URL, gửi empty string để xóa
        thumbnail = "";
      }

      const response = await fetch(`/api/admin/templates/${template.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug.toLowerCase().trim(),
          description: formData.description || undefined,
          thumbnail: thumbnail !== undefined ? thumbnail : undefined,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data.template);
        onClose();
      } else {
        alert(data.error || "Lỗi khi cập nhật template");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Lỗi khi cập nhật template");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      if (template) {
        setFormData({
          name: template.name || "",
          slug: template.slug || "",
          description: template.description || "",
          thumbnailUrl: template.thumbnail || "",
          thumbnailFile: null,
          thumbnailType: "url",
          isActive: template.isActive ?? false,
        });
        setThumbnailPreview(template.thumbnail || null);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

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
          Chỉnh sửa Template
        </h2>
        <form onSubmit={handleSave}>
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
              disabled={saving}
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
              disabled={saving}
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
              Mô tả:
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={saving}
              placeholder="Nhập mô tả template (tùy chọn)"
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
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
                    disabled={saving}
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
                    disabled={saving}
                  />
                  Tải lên
                </label>
              </div>

              {formData.thumbnailType === "url" ? (
                <input
                  type="url"
                  value={formData.thumbnailUrl || ""}
                  onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                  disabled={saving}
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
                  disabled={saving}
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

          <div style={{ marginBottom: "1.5rem" }}>
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
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                disabled={saving}
              />
              <span style={{ fontWeight: "500" }}>Kích hoạt template</span>
            </label>
            <p
              style={{
                marginTop: "0.25rem",
                fontSize: "0.85rem",
                color: "#666",
              }}
            >
              Template được kích hoạt sẽ hiển thị cho người dùng
            </p>
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
              disabled={saving}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#f0f0f0",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "1rem",
                opacity: saving ? 0.6 : 1,
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.75rem 1.5rem",
                background: saving ? "#999" : "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

