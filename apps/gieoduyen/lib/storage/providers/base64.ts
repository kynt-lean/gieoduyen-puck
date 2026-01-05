import { StorageProvider, UploadResult, UploadOptions } from "../types";

/**
 * Base64 Storage Provider
 * 
 * Lưu file dưới dạng base64 string vào MongoDB
 * Đây là default provider, có thể thay thế bằng S3, Cloudinary, etc.
 */
export class Base64StorageProvider implements StorageProvider {
  /**
   * Upload file và trả về data URL (base64)
   */
  async upload(
    file: File | string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    // Nếu đã là base64 string, validate và return
    if (typeof file === "string") {
      // Validate base64 format
      if (!this.isValidBase64(file)) {
        throw new Error("Invalid base64 string");
      }
      return {
        url: file,
        metadata: {
          provider: "base64",
          ...options?.metadata,
        },
      };
    }

    // Convert File to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        resolve({
          url: base64String,
          metadata: {
            provider: "base64",
            filename: options?.filename || file.name,
            contentType: options?.contentType || file.type,
            size: file.size,
            ...options?.metadata,
          },
        });
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate base64 string format
   */
  private isValidBase64(str: string): boolean {
    // Check if it's a data URL format (data:image/png;base64,...)
    if (str.startsWith("data:")) {
      return true;
    }
    // Or plain base64 string
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const base64StorageProvider = new Base64StorageProvider();

