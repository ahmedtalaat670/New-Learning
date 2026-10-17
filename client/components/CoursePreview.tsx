"use client";

import { useState } from "react";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lecture } from "@/app/_lib/types/lecture";

interface CoursePreviewProps {
  lectures: Lecture[];
}

export default function CoursePreview({ lectures }: CoursePreviewProps) {
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const handleLectureClick = (lecture: Lecture) => {
    if (!lecture.freePreview) return;

    setSelectedLecture(lecture);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedLecture(null);
    }
  };

  return (
    <>
      <section>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Course Content</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Preview the free lectures or purchase the course to unlock all
            content.
          </p>
        </div>

        {/* Lectures */}
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b p-5">
            <h3 className="font-semibold">Course Lectures</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
            </p>
          </div>

          <div>
            {lectures.map((lecture, index) => {
              const isFree = lecture.freePreview;

              return (
                <button
                  key={lecture.id}
                  type="button"
                  disabled={!isFree}
                  onClick={() => handleLectureClick(lecture)}
                  className={`flex w-full items-center gap-4 border-b p-5 text-left last:border-b-0 ${
                    isFree
                      ? "cursor-pointer transition-colors hover:bg-primary/5"
                      : "cursor-not-allowed opacity-60"
                  }`}
                >
                  {/* Number */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  {isFree ? (
                    <PlayCircle className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}

                  {/* Lecture information */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{lecture.title}</p>

                    <div className="mt-1">
                      {isFree ? (
                        <Badge variant="secondary" className="text-xs">
                          Free Preview
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Purchase required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  {isFree && (
                    <span className="hidden text-sm font-medium text-primary sm:block">
                      Watch
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Dialog */}
      <Dialog open={!!selectedLecture} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          {selectedLecture && (
            <>
              <DialogHeader className="px-6 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />

                  <span className="text-sm font-medium text-primary">
                    Free Preview
                  </span>
                </div>

                <DialogTitle className="text-xl">
                  {selectedLecture.title}
                </DialogTitle>
              </DialogHeader>

              {/* Video */}
              <div className="aspect-video w-full bg-black">
                <video
                  key={selectedLecture.id}
                  className="h-full w-full"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                >
                  <source src={selectedLecture.video} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground">
                  This is a free preview of the course. Purchase the course to
                  access all lectures.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
