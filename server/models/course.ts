import mongoose from "mongoose";
import validator from "validator";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    freePreview: {
      type: Boolean,
      default: false,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isURL(value),
        message: "the video source must be url",
      },
    },

    public_id: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true },
);

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      required: true,
      enum: {
        values: [
          "web-development",
          "backend-development",
          "data-science",
          "machine-learning",
          "artificial-intelligence",
          "cloud-computing",
          "cyber-security",
          "mobile-development",
          "game-development",
          "software-engineering",
        ],
        message: "Invalid category selected",
      },
      trim: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    primaryLanguage: {
      type: String,
      required: true,
      enum: {
        values: [
          "english",
          "spanish",
          "french",
          "german",
          "chinese",
          "japanese",
          "korean",
          "portuguese",
          "arabic",
          "russian",
        ],
        message: "Invalid language selected",
      },
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [20, "the description must be at least 20 character"],
    },

    pricing: {
      type: Number,
      required: true,
      min: 0,
    },

    objectives: {
      type: [String],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "the objectives can not be empty",
      },
    },

    welcomeMessage: {
      type: String,
      trim: true,
      minLength: [20, "the welcome message must be at leat 20 character"],
    },

    image: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => validator.isURL(value),
        message: "the image source must be url",
      },
      required: true,
    },

    image_id: {
      type: String,
      trim: true,
      required: true,
    },

    lectures: {
      type: [lectureSchema],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

courseSchema.index({
  category: 1,
  level: 1,
  primaryLanguage: 1,
});

export default mongoose.model("Course", courseSchema);
