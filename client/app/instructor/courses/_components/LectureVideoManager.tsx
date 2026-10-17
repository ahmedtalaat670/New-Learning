/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { deleteUploadedFile, uploadVideo } from "@/app/_lib/methods/upload";
import { useState } from "react";

interface LectureVideoManagerProps {
  initialVideoUrl?: string;
  initialVideoId?: string;
  onVideoChange: (videoData: { path: string; id: string }) => void;
}

export default function LectureVideoManager({
  initialVideoUrl = "",
  initialVideoId = "",
  onVideoChange,
}: LectureVideoManagerProps) {
  const [videoData, setVideoData] = useState<{ path: string; id: string }>({
    path: initialVideoUrl,
    id: initialVideoId,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadedFile = await uploadVideo(file);

      const newVideoData = { path: uploadedFile.path, id: uploadedFile.id };
      setVideoData(newVideoData);
      onVideoChange(newVideoData);
    } catch (err: any) {
      alert(err.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!videoData.id) {
      setVideoData({ path: "", id: "" });
      onVideoChange({ path: "", id: "" });
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUploadedFile(videoData.id);

      setVideoData({ path: "", id: "" });
      onVideoChange({ path: "", id: "" });
    } catch (err: any) {
      alert(err.message || "Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        Lecture Video *
      </label>

      {videoData.path ? (
        <div className="space-y-3">
          <video
            src={videoData.path}
            controls
            className="w-full max-h-56 rounded-lg bg-black"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate max-w-xs">
              ID: {videoData.id}
            </span>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleRemove}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              {isDeleting ? "Deleting..." : "Remove Video"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="video/mp4,video/mkv,video/webm"
            disabled={isUploading}
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-primary hover:file:bg-amber-100 transition cursor-pointer"
          />
          {isUploading && (
            <p className="text-xs text-primary mt-2 animate-pulse">
              Uploading video...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
