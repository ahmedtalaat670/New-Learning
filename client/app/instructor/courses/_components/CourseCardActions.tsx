/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CourseCardActionsProps {
  courseId: number;
  courseTitle: string;
}

export default function CourseCardActions({
  courseId,
  courseTitle,
}: CourseCardActionsProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete course");
      }

      setShowDeleteModal(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error deleting course");

      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Actions: Edit & Delete Buttons */}
      <div className="pt-5 mt-4 border-t border-gray-100 flex items-center gap-3">
        <Link
          href={`/instructor/courses/${courseId}/edit`}
          className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
        >
          Edit
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
        >
          Delete
        </button>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100 text-left">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Course</h3>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                &quot;{courseTitle}&quot;
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
