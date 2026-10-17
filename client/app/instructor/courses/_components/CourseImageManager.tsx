/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { deleteUploadedFile, uploadImage } from "@/app/_lib/methods/upload";

interface CourseImageManagerProps {
  initialImageUrl?: string;
  initialImageId?: string;
  onImageChange: (imageData: { path: string; id: string }) => void;
}

export default function CourseImageManager({
  initialImageUrl = "",
  initialImageId = "",
  onImageChange,
}: CourseImageManagerProps) {
  const [imageData, setImageData] = useState<{ path: string; id: string }>({
    path: initialImageUrl,
    id: initialImageId,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImage(file);

      const newData = { path: res.path, id: res.id };
      setImageData(newData);
      onImageChange(newData);
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!imageData.id) {
      setImageData({ path: "", id: "" });
      onImageChange({ path: "", id: "" });
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUploadedFile(imageData.id);

      setImageData({ path: "", id: "" });
      onImageChange({ path: "", id: "" });
    } catch (err: any) {
      alert(err.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-900">
        Course Thumbnail *
      </label>

      {imageData.path ? (
        <div className="space-y-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={imageData.path}
              alt="Course Thumbnail"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate max-w-xs">
              ID: {imageData.id}
            </span>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleRemove}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              {isDeleting ? "Deleting..." : "Remove Image"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isUploading}
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-primary hover:file:bg-amber-100 transition cursor-pointer"
          />
          {isUploading && (
            <p className="text-xs text-primary mt-2 animate-pulse">
              Uploading image...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
