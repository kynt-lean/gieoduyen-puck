import Link from "next/link";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8f9fa, #ffffff)" }}>
      {/* Hero Section */}
      <section
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Gieo Duyên
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            color: "#666",
            marginBottom: "2rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          Tạo thiệp mời cưới, thiệp mời sự kiện đẹp mắt và chuyên nghiệp
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/login"
            style={{
              padding: "1rem 2rem",
              background: "white",
              color: "#0070f3",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "1.1rem",
              border: "2px solid #0070f3",
            }}
          >
            Đăng nhập
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "4rem 2rem",
          background: "white",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            marginBottom: "3rem",
            color: "#333",
          }}
        >
          Tại sao chọn Gieo Duyên?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              🎨
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }}>
              Thiết kế đẹp mắt
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Hàng trăm mẫu thiết kế chuyên nghiệp, phù hợp với mọi phong cách
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              ✏️
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }}>
              Dễ dàng chỉnh sửa
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Chỉnh sửa trực tiếp trên trình duyệt, không cần phần mềm phức tạp
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              🚀
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }}>
              Nhanh chóng
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Tạo và xuất bản thiệp mời chỉ trong vài phút
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Sẵn sàng tạo thiệp mời của bạn?
        </h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.9 }}>
          Bắt đầu ngay hôm nay và tạo thiệp mời đẹp mắt trong vài phút
        </p>
        <Link
          href="/templates"
          style={{
            padding: "1rem 2rem",
            background: "white",
            color: "#667eea",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.1rem",
            display: "inline-block",
          }}
        >
          Bắt đầu ngay
        </Link>
      </section>
    </div>
  );
}

