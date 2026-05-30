import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export interface AssignmentDocumentMeta {
  documentUrl: string;
  documentName: string;
  documentPath: string;
  documentContentType: string;
}

export function validateAssignmentDocument(file: File): string | null {
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
    return "Please upload a PDF or image (JPEG, PNG, WebP, or GIF).";
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return "File must be 10 MB or smaller.";
  }
  return null;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadAssignmentDocument(
  userId: string,
  assignmentId: string,
  file: File
): Promise<AssignmentDocumentMeta> {
  const safeName = sanitizeFileName(file.name);
  const path = `users/${userId}/assignments/${assignmentId}/${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, { contentType: file.type });
  const documentUrl = await getDownloadURL(storageRef);

  return {
    documentUrl,
    documentName: file.name,
    documentPath: path,
    documentContentType: file.type,
  };
}

export async function deleteAssignmentDocument(documentPath: string): Promise<void> {
  await deleteObject(ref(storage, documentPath));
}
