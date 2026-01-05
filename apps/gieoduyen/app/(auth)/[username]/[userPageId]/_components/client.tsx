"use client";

import headingAnalyzer from "@/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "@config";
import { AutoField, Button, FieldLabel, Puck, Render } from "@measured/puck";
import { Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
}

export function Client({
  username,
  userPageId,
  isEdit,
}: {
  username: string;
  userPageId: string;
  isEdit: boolean;
}) {
  const router = useRouter();
  const [userPage, setUserPage] = useState<UserPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserPage();
  }, [username, userPageId]);

  const fetchUserPage = async () => {
    try {
      // Use authenticated route if editing, public route if viewing
      const apiPath = isEdit 
        ? `/api/user-pages/my/${userPageId}` 
        : `/api/user-pages/${username}/${userPageId}`;
      
      const response = await fetch(apiPath);
      const data = await response.json();
      if (response.ok) {
        // Verify ownership when editing
        if (isEdit) {
          const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
          };
          const currentUsername = getCookie("gieoduyen-username") || "user";
          
          if (data.userPage.userId !== currentUsername) {
            alert("Bạn không có quyền chỉnh sửa trang này");
            router.push(`/${username}/${userPageId}`);
            return;
          }
        }
        setUserPage(data.userPage);
      } else {
        console.error("Error fetching user page:", data.error);
        if (isEdit) {
          alert("Không tìm thấy trang hoặc bạn không có quyền chỉnh sửa");
          router.push("/templates");
        } else {
          alert("Không tìm thấy trang");
          router.push("/templates");
        }
      }
    } catch (error) {
      console.error("Error fetching user page:", error);
      alert("Lỗi khi tải trang");
      if (isEdit) {
        router.push("/templates");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (userPage: UserPage) => {
    if (!userPage) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/user-pages/my/${userPage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageData: userPage.pageData }),
      });

      if (response.ok) {
        alert("Đã lưu thành công!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Lỗi khi lưu");
      }
    } catch (error) {
      console.error("Error saving user page:", error);
      alert("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!userPage) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h1>404</h1>
          <p>Trang không tồn tại</p>
        </div>
      </div>
    );
  }

  const params = new URL(window.location.href).searchParams;

  if (isEdit) {
    return (
      <div>
        <div
          style={{
            padding: "1rem 2rem",
            background: "white",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#333" }}>
              Chỉnh sửa: {userPage.template?.name || "Trang"}
            </h2>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "#666" }}>
              {username}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              href={`/${username}/${userPageId}`}
              newTab
              variant="secondary"
            >
              Xem trang
            </Button>
          </div>
        </div>

        <Puck
          config={config}
          data={userPage.pageData || {}}
          plugins={[headingAnalyzer]}
          headerPath={`/${username}/${userPageId}`}
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
            },
          }}
          onPublish={async (data) => {
            setUserPage({ ...userPage, pageData: data });
            handleSave({ ...userPage, pageData: data });
          }}
          metadata={{}}
        />
      </div>
    );
  }

  if (userPage.pageData) {
    return <Render config={config} data={userPage.pageData} metadata={{}} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>404</h1>
        <p>Trang không tồn tại</p>
      </div>
    </div>
  );
}

export default Client;

