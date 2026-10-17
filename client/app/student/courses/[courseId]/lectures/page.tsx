/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/_stores/auth";
import { Lecture } from "@/app/_lib/types/lecture";
import { CourseProgressInfo } from "@/app/_lib/types/course-progress";
import { LectureProgressItem } from "@/app/_lib/types/lecture-progress-item";

interface CourseLecturesPageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseLecturesPage({
  params,
}: CourseLecturesPageProps) {
  const { courseId } = use(params);
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [completedLectureIds, setCompletedLectureIds] = useState<Set<number>>(
    new Set(),
  );
  const [courseProgress, setCourseProgress] =
    useState<CourseProgressInfo | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingWatched, setIsMarkingWatched] = useState<boolean>(false);

  const completedLectureIdsRef = useRef<Set<number>>(new Set());

  const syncCompletedIds = (newSet: Set<number>) => {
    completedLectureIdsRef.current = newSet;
    setCompletedLectureIds(newSet);
  };

  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      router.push(`/login?redirectTo=/student/courses/${courseId}/lectures`);
      return;
    }

    const fetchCourseData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchOptions: RequestInit = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        };

        const [lecturesRes, courseProgressRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/lectures?courseId=${courseId}`,
            fetchOptions,
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/course-progress?courseId=${courseId}`,
            fetchOptions,
          ),
        ]);

        if (lecturesRes.status === 401 || courseProgressRes.status === 401) {
          router.push(
            `/login?redirectTo=/student/courses/${courseId}/lectures`,
          );
          return;
        }

        if (!lecturesRes.ok || !courseProgressRes.ok) {
          throw new Error("Failed to load course information.");
        }

        const lecturesData: Lecture[] = await lecturesRes.json();

        const courseProgressRaw = await courseProgressRes.json();
        const courseProgressData: CourseProgressInfo | null = Array.isArray(
          courseProgressRaw,
        )
          ? courseProgressRaw[0] || null
          : courseProgressRaw;

        setLectures(lecturesData);
        setCourseProgress(courseProgressData);

        let completedIds = new Set<number>();

        if (courseProgressData?.id) {
          const lectureProgressRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/lecture-progress?courseProgressId=${courseProgressData.id}`,
            fetchOptions,
          );

          if (lectureProgressRes.status === 401) {
            router.push(
              `/login?redirectTo=/student/courses/${courseId}/lectures`,
            );
            return;
          }

          if (lectureProgressRes.ok) {
            const lectureProgressData: LectureProgressItem[] =
              await lectureProgressRes.json();

            completedIds = new Set(
              lectureProgressData.map((item) => item.lecture.id),
            );
          }
        }

        syncCompletedIds(completedIds);

        if (lecturesData.length > 0) {
          const firstUnwatched = lecturesData.find(
            (lec) => !completedIds.has(lec.id),
          );
          setSelectedLecture(firstUnwatched || lecturesData[0]);
        }
      } catch (err: any) {
        console.error("Error fetching lectures or progress:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
        document.title = "Watch Course | SkillBridge";
      }
    };

    fetchCourseData();
  }, [courseId, isAuthenticated, isInitializing, router]);

  const handleMarkAsWatched = async (lectureId: number) => {
    if (completedLectureIdsRef.current.has(lectureId) || isMarkingWatched) {
      return;
    }

    if (!courseProgress?.id) {
      alert("Course progress session not found. Please refresh the page.");
      return;
    }

    setIsMarkingWatched(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lecture-progress`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            courseProgressId: courseProgress.id,
            lectureId: lectureId,
          }),
        },
      );

      if (res.status === 401) {
        router.push(`/login?redirectTo=/student/courses/${courseId}/lectures`);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to mark as watched.");
      }

      const updatedSet = new Set(completedLectureIdsRef.current).add(lectureId);
      syncCompletedIds(updatedSet);
    } catch (err: any) {
      console.error("Failed to update progress:", err);
      alert(err.message || "Could not mark lecture as watched.");
    } finally {
      setIsMarkingWatched(false);
    }
  };

  if (isInitializing || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            Loading course lectures...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md border border-red-100 text-center">
          <h2 className="text-lg font-bold text-red-600 mb-2">
            Error Loading Course
          </h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#e08300] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isCurrentWatched = selectedLecture
    ? completedLectureIds.has(selectedLecture.id)
    : false;

  const progressPercentage =
    lectures.length > 0
      ? Math.round((completedLectureIds.size / lectures.length) * 100)
      : 0;

  return (
    <div className="flex h-screen flex-col bg-gray-100 lg:flex-row overflow-hidden">
      {/* MAIN VIDEO DISPLAY */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {selectedLecture ? (
          <div className="p-6 max-w-5xl mx-auto w-full">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
              <video
                key={selectedLecture.video}
                controls
                className="h-full w-full object-contain"
                onEnded={() => handleMarkAsWatched(selectedLecture.id)}
              >
                <source src={selectedLecture.video} type="video/mp4" />
                Your browser does not support HTML5 video player.
              </video>
            </div>

            {/* Video Controls & Information */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    Lecture #{selectedLecture.id}
                  </span>
                  {selectedLecture.freePreview && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Free Preview
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {selectedLecture.title}
                </h1>
              </div>

              {/* Mark as Watched Button */}
              <button
                onClick={() => handleMarkAsWatched(selectedLecture.id)}
                disabled={isCurrentWatched || isMarkingWatched}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  isCurrentWatched
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-primary text-white hover:bg-[#e08300] shadow-sm active:scale-95 disabled:opacity-50"
                }`}
              >
                {isCurrentWatched ? (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Watched
                  </>
                ) : isMarkingWatched ? (
                  "Saving..."
                ) : (
                  "Mark as Watched"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No lectures available for this course.
          </div>
        )}
      </main>

      {/* SIDEBAR */}
      <aside className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-sm">
        {/* Progress Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-gray-800 text-lg">Course Progress</h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#fff8f0] text-[#d97d00] rounded-full">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              {completedLectureIds.size} of {lectures.length} lectures watched
            </p>

            {/* Course Completion Badge */}
            {courseProgress?.completed && (
              <span className="text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Course Completed
              </span>
            )}
          </div>
        </div>

        {/* Playlist List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {lectures.map((lecture, idx) => {
            const isWatched = completedLectureIds.has(lecture.id);
            const isSelected = selectedLecture?.id === lecture.id;

            return (
              <button
                key={lecture.id}
                onClick={() => setSelectedLecture(lecture)}
                className={`w-full text-left p-4 transition flex items-center justify-between hover:bg-gray-50 ${
                  isSelected ? "bg-[#fff8f0] border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="shrink-0">
                    {isWatched ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <svg
                          className="w-3 h-3 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          isSelected ? "border-primary" : "border-gray-300"
                        }`}
                      />
                    )}
                  </div>

                  <span
                    className={`text-sm font-medium leading-snug truncate ${
                      isSelected
                        ? "text-[#b36800] font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {idx + 1}. {lecture.title}
                  </span>
                </div>

                {lecture.freePreview && (
                  <span className="shrink-0 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    Free
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
