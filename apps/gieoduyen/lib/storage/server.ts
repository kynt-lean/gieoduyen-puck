/**
 * Server-side Storage Utilities
 * 
 * Xử lý thumbnail ở server-side với storage provider pattern
 */

import { StorageProvider, UploadResult, UploadOptions } from "./types";

/**
 * Server-side Base64 Storage Provider
 * 
 * Validate và xử lý base64 string từ client
 */
class ServerBase64StorageProvider implements StorageProvider {
  /**
   * Validate và return base64 string
   * Client đã convert file thành base64, server chỉ cần validate
   */
  async upload(
    file: string, // base64 string từ client
    options?: UploadOptions
  ): Promise<UploadResult> {
    // Validate base64 format
    if (!this.isValidBase64(file)) {
      throw new Error("Invalid base64 string");
    }

    // Validate size (max 10MB for base64)
    const base64Size = this.getBase64Size(file);
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (base64Size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    return {
      url: file,
      metadata: {
        provider: "base64",
        size: base64Size,
        ...options?.metadata,
      },
    };
  }

  /**
   * Validate base64 string format
   */
  private isValidBase64(str: string): boolean {
    // Check if it's a data URL format (data:image/png;base64,...)
    if (str.startsWith("data:")) {
      const matches = str.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) return false;
      const [, mimeType, base64Data] = matches;
      // Validate mime type is image
      if (!mimeType.startsWith("image/")) return false;
      // Validate base64 data
      try {
        // Try to decode base64
        Buffer.from(base64Data, "base64");
        return true;
      } catch {
        return false;
      }
    }

    // Or plain base64 string (less common, but support it)
    try {
      Buffer.from(str, "base64");
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calculate approximate size of base64 string
   */
  private getBase64Size(base64: string): number {
    // Remove data URL prefix if present
    const base64Data = base64.includes(",")
      ? base64.split(",")[1]
      : base64;
    // Base64 encoding increases size by ~33%, so decode to get original size
    return Math.floor((base64Data.length * 3) / 4);
  }
}

// Export singleton instance
export const serverBase64StorageProvider = new ServerBase64StorageProvider();

/**
 * Process thumbnail with storage provider
 * 
 * @param thumbnail - URL string hoặc base64 string từ client
 * @returns Processed thumbnail URL
 */
export async function processThumbnail(
  thumbnail: string | undefined
): Promise<string | undefined> {
  if (!thumbnail || !thumbnail.trim()) {
    return undefined;
  }

  const trimmed = thumbnail.trim();

  // Nếu là URL (http/https), return trực tiếp
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Nếu là base64, process với storage provider
  if (trimmed.startsWith("data:") || isBase64String(trimmed)) {
    const result = await serverBase64StorageProvider.upload(trimmed);
    return result.url;
  }

  // Invalid format
  throw new Error("Invalid thumbnail format. Must be URL or base64 string.");
}

/**
 * Check if string is base64 (simple check)
 */
function isBase64String(str: string): boolean {
  // Simple check: base64 strings are typically longer and contain base64 chars
  if (str.length < 100) return false;
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(str.replace(/^data:[^;]+;base64,/, ""));
}

