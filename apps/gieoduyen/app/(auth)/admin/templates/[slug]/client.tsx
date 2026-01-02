"use client";

import headingAnalyzer from "@/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "@config";
import { AutoField, Button, Data, FieldLabel, Puck } from "@measured/puck";
import { Edit, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditTemplateModal from "../_components/EditTemplateModal";

interface AdminTemplateEditorClientProps {
  templateSlug: string;
}

export default function AdminTemplateEditorClient({
  templateSlug,
}: AdminTemplateEditorClientProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [puckData, setPuckData] = useState<Data | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (templateSlug) {
      fetchTemplate();
    }
  }, [templateSlug]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/templates/${templateSlug}`);
      const data = await response.json();
      if (response.ok) {
        setTemplate(data.template);
        // Load initialData từ template vào Puck editor
        setPuckData(data.template.initialData || null);
      } else {
        alert(data.error || "Không tìm thấy template");
        router.push("/admin/templates");
      }
    } catch (error) {
      console.error("Error fetching template:", error);
      alert("Lỗi khi tải template");
      router.push("/admin/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInitialData = async (data: Data | null) => {
    if (!data) {
      alert("Vui lòng tạo nội dung template");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/templates/${templateSlug}/data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialData: data,
        }),
      });

      if (response.ok) {
        setPuckData(data);
        // Không redirect, chỉ lưu initialData
      } else {
        const error = await response.json();
        alert(error.error || "Lỗi khi lưu nội dung template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Lỗi khi lưu nội dung template");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSuccess = (updatedTemplate: any) => {
    setTemplate(updatedTemplate);
    // Nếu slug thay đổi, redirect đến slug mới
    if (updatedTemplate.slug !== templateSlug) {
      router.push(`/admin/templates/${updatedTemplate.slug}`);
    }
  };

  if (!isClient || loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải...</div>
    );
  }

  const params = new URL(window.location.href).searchParams;

  return (
    <div>
      <div
        style={{
          padding: "1rem 2rem",
          background: "white",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            {template?.name || "Chỉnh sửa Template"}
          </h2>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="secondary"
            icon={<Edit size={16} />}
          >
            Thông tin
          </Button>
          <Button
            href="/admin/templates"
            variant="secondary"
          >
            Hủy
          </Button>
        </div>
      </div>

      <Puck
        config={config}
        data={puckData || {}}
        plugins={[headingAnalyzer]}
        headerPath="/admin/templates"
        publishLabel="Lưu"
        iframe={{
          enabled: params.get("disableIframe") === "true" ? false : true,
        }}
        fieldTransforms={{
          userField: ({ value }) => value,
        }}
        overrides={{
          fieldTypes: {
            userField: ({ readOnly, field, name, value, onChange }) => (
              <FieldLabel
                label={field.label || name}
                readOnly={readOnly}
                icon={<Type size={16} />}
              >
                <AutoField
                  field={{ type: "text" }}
                  onChange={onChange}
                  value={value}
                />
              </FieldLabel>
            ),
          }
        }}
        onPublish={async (data) => {
          setPuckData(data);
          handleSaveInitialData(data);
        }}
        metadata={{}}
      />

      <EditTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        template={template}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

