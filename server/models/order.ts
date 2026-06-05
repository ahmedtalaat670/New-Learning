import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },

    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor ID is required"],
    },

    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refunded"],
      default: "pending",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["paypal", "stripe", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      required: true,
    },

    paymentId: {
      type: String,
      trim: true,
    },

    payerId: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ courseId: 1 });
OrderSchema.index({ instructorId: 1 });
OrderSchema.index({ paymentId: 1 });

export default mongoose.model("Order", OrderSchema);
