import mongoose from "mongoose";
import validator from "validator";

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    ip: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validator.isIP(value),
        message: "Invalid ip address",
      },
    },
    userAgent: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

TokenSchema.index({
  user: 1,
  isValid: 1,
});
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Token", TokenSchema);
