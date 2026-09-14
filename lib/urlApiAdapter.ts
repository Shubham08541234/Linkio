// lib/urlApiAdapter.ts
import * as urlsActions from "@/app/actions/urls";

export async function createUrlWithApiKey(userId: string, data: {
  originalUrl: string;
  title?: string;
  description?: string;
  password?: string;
  expiresAt?: Date;
  maxClicks?: number;
  customAlias?: string;
}) {
  // Reuse your existing logic but override userId
  return urlsActions.createUrl({ ...data, userIdOverride: userId });
}
