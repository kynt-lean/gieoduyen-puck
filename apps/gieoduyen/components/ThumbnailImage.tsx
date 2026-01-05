"use client";

import { useState } from "react";

interface ThumbnailImageProps {
  thumbnail?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ThumbnailImage Component
 * 
 * Xử lý hiển thị thumbnail có thể là:
 * - URL (http:// hoặc https://)
 * - Base64 data URL (data:image/...;base64,...)
 * 
 * Có error handling và fallback
 */
export default function ThumbnailImage({
  thumbnail,
  alt = "Template thumbnail",
  className,
  style,
}: ThumbnailImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!thumbnail) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "180px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "0.9rem",
          ...style,
        }}
      >
        Không có thumbnail
      </div>
    );
  }

  // Validate thumbnail format
  const isValidThumbnail =
    thumbnail.startsWith("http://") ||
    thumbnail.startsWith("https://") ||
    thumbnail.startsWith("data:image/");

  if (!isValidThumbnail) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "180px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "0.9rem",
          ...style,
        }}
      >
        Thumbnail không hợp lệ
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "180px",
        position: "relative",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        ...style,
      }}
    >
      {imageLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            color: "#999",
            fontSize: "0.9rem",
          }}
        >
          Đang tải...
        </div>
      )}
      {!imageError ? (
        <img
          src={thumbnail}
          alt={alt}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: imageLoading ? "none" : "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            color: "#999",
            fontSize: "0.9rem",
          }}
        >
          Không thể tải ảnh
        </div>
      )}
    </div>
  );
}

