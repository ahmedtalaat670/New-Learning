import mongoose from "mongoose";

const StudentCoursesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: [true, "Course ID is required"],
        },

        dateOfPurchase: {
          type: Date,
          default: Date.now,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

StudentCoursesSchema.index({ userId: 1 });

export default mongoose.model("StudentCourses", StudentCoursesSchema);
