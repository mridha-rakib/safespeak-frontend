"use client";

import { ApiRequestError, apiRequest, type ApiEnvelope } from "@/lib/api";
import { clearAuthSession, getValidAccessToken } from "@/lib/auth";

export type UserNotificationType =
  | "report_status"
  | "report_delivery"
  | "privacy_request"
  | "support_request"
  | "safety_plan"
  | "system";

export type UserNotificationSeverity = "info" | "success" | "warning" | "critical";

export type UserNotificationView = "all" | "today" | "past";

export type UserNotificationItem = {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  dateLabel: string;
  unread: boolean;
  readAt?: string;
  type: UserNotificationType;
  severity: UserNotificationSeverity;
  createdAt: string;
  sourceType: string;
  sourceId?: string;
  actionLabel?: string;
  actionHref?: string;
  metadata?: Record<string, unknown>;
};

export type UserNotificationsResponse = {
  notifications: UserNotificationItem[];
  unreadCount: number;
  totalCount: number;
};

type NotificationRequestOptions = Omit<
  Parameters<typeof apiRequest<UserNotificationsResponse>>[1],
  "token"
>;

async function notificationApiRequest<TData>(
  path: string,
  options: Omit<Parameters<typeof apiRequest<TData>>[1], "token"> = {}
): Promise<ApiEnvelope<TData>> {
  const token = await getValidAccessToken();

  try {
    return await apiRequest<TData>(path, {
      ...options,
      token,
    });
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 401 || error.status === 403)
    ) {
      clearAuthSession();
    }

    throw error;
  }
}

function toQueryString(query: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

export async function listUserNotifications(
  query: {
    view?: UserNotificationView;
    unreadOnly?: boolean;
    limit?: number;
  } = {},
  options: NotificationRequestOptions = {}
): Promise<UserNotificationsResponse> {
  const response = await notificationApiRequest<UserNotificationsResponse>(
    `/notifications${toQueryString(query)}`,
    options
  );

  return response.data;
}

export async function markUserNotificationRead(notificationId: string): Promise<void> {
  await notificationApiRequest("/notifications/read", {
    method: "POST",
    body: { notificationId },
  });
}

export async function markUserNotificationsRead(notificationIds: string[]): Promise<void> {
  if (notificationIds.length === 0) {
    return;
  }

  await notificationApiRequest("/notifications/read-all", {
    method: "POST",
    body: { notificationIds },
  });
}
