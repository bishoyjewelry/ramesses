/**
 * File validation utilities for secure file uploads
 */

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates that a file is an allowed image type
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check file extension
  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (!ext || !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension: ${ext || 'none'}. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
    };
  }

  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only JPG, PNG, WebP, and GIF images are allowed.`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
    };
  }

  return { valid: true };
}

/**
 * Validates an array of files and returns only valid ones
 * Returns both valid files and any error messages
 */
export function validateImageFiles(files: File[]): {
  validFiles: File[];
  errors: string[];
} {
  const validFiles: File[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = validateImageFile(file);
    if (result.valid) {
      validFiles.push(file);
    } else if (result.error) {
      errors.push(`${file.name}: ${result.error}`);
    }
  }

  return { validFiles, errors };
}

/**
 * Quick check if a file is a valid image type
 */
export function isValidImageFile(file: File): boolean {
  return validateImageFile(file).valid;
}
