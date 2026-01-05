/**
 * Storage Provider Interface
 * 
 * Cho phép gắn các provider khác nhau một cách độc lập
 * để lưu trữ blob/file (S3, Cloudinary, base64, etc.)
 */

export interface UploadResult {
  url: string;
  metadata?: Record<string, unknown>;
}

export interface StorageProvider {
  /**
   * Upload file/blob và trả về URL
   * @param file - File object hoặc base64 string
   * @param options - Tùy chọn upload (filename, folder, etc.)
   * @returns URL của file đã upload
   */
  upload(
    file: File | string,
    options?: UploadOptions
  ): Promise<UploadResult>;

  /**
   * Xóa file (optional, không phải tất cả provider đều hỗ trợ)
   * @param url - URL của file cần xóa
   */
  delete?(url: string): Promise<void>;
}

export interface UploadOptions {
  filename?: string;
  folder?: string;
  contentType?: string;
  metadata?: Record<string, unknown>;
}

