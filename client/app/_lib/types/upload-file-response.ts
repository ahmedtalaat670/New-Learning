export interface UploadedFileResponse {
  id: string;
  name: string;
  path: string;
  type: "video" | "image" | string;
  size: number;
  mime: string;
}
