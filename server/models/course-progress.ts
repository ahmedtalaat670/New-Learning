import mongoose from "mongoose";

type LectureProgressType = {
  lectureId: string;
  viewed: boolean;
  viewDate: Date;
};

const lectureProgressSchema = new mongoose.Schema(
  {
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course.lectures",
      required: true,
    },

    viewed: {
      type: Boolean,
      default: false,
    },

    viewDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completionDate: {
      type: Date,
    },

    lecturesProgress: {
      type: [lectureProgressSchema],
      validate: {
        validator: function (arr: LectureProgressType[]) {
          const ids = arr.map((l) => l.lectureId.toString());
          return ids.length === new Set(ids).size;
        },
        message: "Duplicate lecture progress entries are not allowed",
      },
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
courseProgressSchema.index({ courseId: 1 });

export default mongoose.model("CourseProgress", courseProgressSchema);
