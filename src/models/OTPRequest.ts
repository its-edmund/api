import { Schema, model } from "mongoose";

export type OTPRequest = {
  userId: string;
  phoneNumber: string;
  code: string;
  createdAt: Date;
  sessionId: string;
};

const otpSchema = new Schema<OTPRequest>({
  userId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, expires: "300s", default: Date.now },
  sessionId: { type: String, required: true },
});

export const OTPRequestModel = model<OTPRequest>("OTPRequest", otpSchema);
