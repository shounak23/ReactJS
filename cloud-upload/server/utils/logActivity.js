import { ActivityLog } from "../models/activityLog.model.js";

export const logActivity = async ({ userId, action, status, ip, userAgent, details = null }) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      status,
      ip,
      userAgent,
      details,
    });
  } catch (error) {
    console.error("Activity log failed", error); // never crash app for logging
  }
};