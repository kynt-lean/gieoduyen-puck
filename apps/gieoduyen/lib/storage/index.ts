/**
 * Storage Module
 * 
 * Centralized storage management với khả năng thay đổi provider
 */

import { StorageProvider, UploadResult, UploadOptions } from "./types";
import { base64StorageProvider } from "./providers/base64";

// Default provider là base64
let currentProvider: StorageProvider = base64StorageProvider;

/**
 * Set storage provider
 * Cho phép thay đổi provider một cách độc lập
 * 
 * @example
 * import { setStorageProvider } from '@lib/storage';
 * import { s3StorageProvider } from '@lib/storage/providers/s3';
 * setStorageProvider(s3StorageProvider);
 */
export function setStorageProvider(provider: StorageProvider): void {
  currentProvider = provider;
}

/**
 * Get current storage provider
 */
export function getStorageProvider(): StorageProvider {
  return currentProvider;
}

/**
 * Upload file using current provider
 */
export async function uploadFile(
  file: File | string,
  options?: UploadOptions
): Promise<UploadResult> {
  return currentProvider.upload(file, options);
}

/**
 * Delete file using current provider (if supported)
 */
export async function deleteFile(url: string): Promise<void> {
  if (currentProvider.delete) {
    return currentProvider.delete(url);
  }
  throw new Error("Delete operation not supported by current provider");
}

// Export types
export type { StorageProvider, UploadResult, UploadOptions } from "./types";

