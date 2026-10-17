import { UploadedFileResponse } from "../types/upload-file-response";

export async function uploadVideo(file: File): Promise<UploadedFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/video`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload video");
  }

  const data: UploadedFileResponse = await res.json();
  return data;
}

export async function uploadImage(file: File): Promise<UploadedFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  const data: UploadedFileResponse = await res.json();
  return data;
}

export async function deleteUploadedFile(fileId: string): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to delete uploaded file");
  }
}
