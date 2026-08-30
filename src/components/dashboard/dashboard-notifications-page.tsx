"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  IconBellFilled,
  IconBoltFilled,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconLoader2,
  IconRefresh,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import type { NotificationView } from "@/components/dashboard/dashboard-types";
import {
  listUserNotifications,
  markUserNotificationRead,
  markUserNotificationsRead,
  type UserNotificationItem,
} from "@/lib/notifications-client";
import { cn } from "@/lib/utils";

type NotificationErrorState = "load" | "signin" | null;

function parseNotificationDate(value: string): Date | null {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameLocalDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isTodayNotification(item: UserNotificationItem): boolean {
  const createdAt = parseNotificationDate(item.createdAt);

  return createdAt ? isSameLocalDay(createdAt, new Date()) : false;
}

function formatNotificationTime(
  item: UserNotificationItem,
  yesterdayLabel: string
): string {
  const createdAt = parseNotificationDate(item.createdAt);

  if (!createdAt) {
    return item.timestamp;
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameLocalDay(createdAt, today)) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(createdAt);
  }

  if (isSameLocalDay(createdAt, yesterday)) {
    return yesterdayLabel;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(createdAt);
}

export function NotificationsPage({ view }: { view: NotificationView }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [notifications, setNotifications] = useState<UserNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<NotificationErrorState>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const isToday = view === "today";
  const feedItems = useMemo(
    () =>
      notifications.filter((item) =>
        isToday ? isTodayNotification(item) : !isTodayNotification(item)
      ),
    [isToday, notifications]
  );
  const visibleUnreadIds = useMemo(
    () => feedItems.filter((item) => item.unread).map((item) => item.id),
    [feedItems]
  );

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await listUserNotifications({ limit: 100 });
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      setErrorState(
        error instanceof Error && /login|auth/i.test(error.message)
          ? "signin"
          : "load"
      );
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const markLocalRead = useCallback((notificationIds: string[]) => {
    const nextReadAt = new Date().toISOString();
    const idSet = new Set(notificationIds);
    let markedCount = 0;

    setNotifications((items) =>
      items.map((item) => {
        if (!idSet.has(item.id) || !item.unread) {
          return item;
        }

        markedCount += 1;
        return {
          ...item,
          unread: false,
          readAt: nextReadAt,
        };
      })
    );

    setUnreadCount((count) => Math.max(0, count - markedCount));
  }, []);

  const markSingleRead = useCallback(
    async (item: UserNotificationItem) => {
      if (!item.unread || pendingIds.has(item.id)) {
        return;
      }

      setPendingIds((current) => new Set(current).add(item.id));
      markLocalRead([item.id]);

      try {
        await markUserNotificationRead(item.id);
      } catch {
        await loadNotifications();
      } finally {
        setPendingIds((current) => {
          const next = new Set(current);
          next.delete(item.id);
          return next;
        });
      }
    },
    [loadNotifications, markLocalRead, pendingIds]
  );

  const openNotification = useCallback(
    async (item: UserNotificationItem) => {
      await markSingleRead(item);

      if (item.actionHref) {
        router.push(item.actionHref as Parameters<typeof router.push>[0]);
      }
    },
    [markSingleRead, router]
  );

  const markVisibleRead = useCallback(async () => {
    if (visibleUnreadIds.length === 0 || isMarkingAll) {
      return;
    }

    setIsMarkingAll(true);
    markLocalRead(visibleUnreadIds);

    try {
      await markUserNotificationsRead(visibleUnreadIds);
    } catch {
      await loadNotifications();
    } finally {
      setIsMarkingAll(false);
    }
  }, [isMarkingAll, loadNotifications, markLocalRead, visibleUnreadIds]);

  const emptyTitle = isToday
    ? t("dashboard.notifications.emptyToday")
    : t("dashboard.notifications.emptyPast");
  const errorMessage =
    errorState === "signin"
      ? t("dashboard.notifications.signInRequired")
      : t("dashboard.notifications.loadError");

  return (
    <div className="px-3 pb-8 sm:px-6 xl:px-6">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between bg-[#f1f3f7] px-4 py-3">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1f2a3a]">
            <IconChevronLeft size={16} />
            {t("dashboard.notifications.notification")}
          </div>
          <button
            type="button"
            onClick={() => void markVisibleRead()}
            disabled={visibleUnreadIds.length === 0 || isMarkingAll}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#0f4f96] disabled:text-[#98a3b6]"
          >
            {isMarkingAll ? (
              <IconLoader2 size={14} className="animate-spin" />
            ) : (
              <IconCheck size={14} />
            )}
            {t("dashboard.notifications.markAllRead")}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
          <Link
            href={{
              pathname: "/dashboard/notifications",
              query: { view: "today" },
            }}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl text-sm transition",
              isToday
                ? "bg-[#04589f] font-bold text-white shadow-[0_6px_16px_rgba(4,88,159,0.25)]"
                : "border border-[#e4e9f1] bg-[#f7f8fc] font-semibold text-[#0f4f96]"
            )}
          >
            {t("dashboard.notifications.today")}
          </Link>
          <Link
            href={{
              pathname: "/dashboard/notifications",
              query: { view: "past" },
            }}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl text-sm transition",
              !isToday
                ? "bg-[#04589f] font-bold text-white shadow-[0_6px_16px_rgba(4,88,159,0.25)]"
                : "border border-[#e4e9f1] bg-[#f7f8fc] font-semibold text-[#0f4f96]"
            )}
          >
            {t("dashboard.notifications.past")}
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between px-1 text-xs font-semibold text-[#6e7f95]">
          <span>
            {t("dashboard.notifications.unreadCount", {
              count: unreadCount,
            })}
          </span>
          <button
            type="button"
            onClick={() => void loadNotifications()}
            className="inline-flex items-center gap-1 text-[#0f4f96]"
          >
            <IconRefresh size={13} />
            {t("dashboard.notifications.retry")}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex min-h-[64px] animate-pulse items-center rounded-2xl bg-[#e9eef6] px-4 py-3"
              >
                <span className="mr-3 h-8 w-8 rounded-full bg-[#d6deea]" />
                <span className="min-w-0 flex-1 space-y-2">
                  <span className="block h-3 w-40 rounded bg-[#d6deea]" />
                  <span className="block h-2.5 w-64 max-w-full rounded bg-[#d6deea]" />
                </span>
              </div>
            ))
          ) : errorState ? (
            <div className="rounded-2xl border border-[#f2c2bb] bg-[#fff5f2] px-4 py-5 text-sm text-[#7a2f22]">
              <p className="font-bold">{errorMessage}</p>
              <button
                type="button"
                onClick={() => void loadNotifications()}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#ffffff] px-3 py-2 text-xs font-bold text-[#0f4f96]"
              >
                <IconRefresh size={13} />
                {t("dashboard.notifications.retry")}
              </button>
            </div>
          ) : feedItems.length === 0 ? (
            <div className="rounded-2xl border border-[#dde6f2] bg-[#f8fafd] px-4 py-6 text-sm text-[#64748b]">
              <p className="font-bold text-[#1f2a3a]">{emptyTitle}</p>
              <p className="mt-1 text-xs">
                {t("dashboard.notifications.emptySubtitle")}
              </p>
            </div>
          ) : (
            feedItems.map((item, index) => {
              const highlighted = item.unread;
              const isPending = pendingIds.has(item.id);

              return (
                <article
                  key={item.id}
                  className={cn(
                    "relative flex min-h-[64px] items-center rounded-2xl px-4 py-3",
                    highlighted
                      ? "bg-[#f48600] text-white shadow-[0_8px_22px_rgba(244,134,0,0.35)]"
                      : "bg-[#e9e6f2] text-[#1f2a3a]",
                    item.severity === "critical" &&
                      !highlighted &&
                      "ring-1 ring-[#e94242]/30"
                  )}
                >
                  {index === 0 && highlighted && (
                    <span className="absolute -left-9 top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#e94242] xl:block" />
                  )}

                  <button
                    type="button"
                    onClick={() => void openNotification(item)}
                    className="flex min-w-0 flex-1 items-center text-left"
                  >
                    <span
                      className={cn(
                        "relative mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        highlighted
                          ? "bg-[#f8a337] text-white"
                          : "bg-[#f7f7fb] text-[#2a3342]"
                      )}
                    >
                      {highlighted ? (
                        <>
                          <IconBellFilled size={14} />
                          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#ffb861]" />
                        </>
                      ) : (
                        <IconBoltFilled size={14} />
                      )}
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block truncate text-xs",
                          highlighted ? "text-white/90" : "text-[#7c8699]"
                        )}
                      >
                        {item.body}
                      </span>
                    </span>

                    <span
                      className={cn(
                        "ml-auto shrink-0 pl-3 text-[10px] font-medium",
                        highlighted ? "text-white/80" : "text-[#98a3b6]"
                      )}
                    >
                      {formatNotificationTime(
                        item,
                        t("dashboard.notifications.yesterday")
                      )}
                    </span>
                  </button>

                  {item.unread && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void markSingleRead(item);
                      }}
                      disabled={isPending}
                      className={cn(
                        "ml-3 inline-flex h-8 shrink-0 items-center justify-center rounded-lg px-3 text-[11px] font-bold",
                        highlighted
                          ? "bg-white/15 text-white"
                          : "bg-white text-[#0f4f96]"
                      )}
                    >
                      {isPending ? (
                        <IconLoader2 size={13} className="animate-spin" />
                      ) : (
                        t("dashboard.notifications.markRead")
                      )}
                    </button>
                  )}
                </article>
              );
            })
          )}
        </div>

        {isToday && (
          <Link
            href={{
              pathname: "/dashboard/notifications",
              query: { view: "past" },
            }}
            className="mx-auto mt-4 inline-flex w-full items-center justify-center gap-1 text-xs font-medium text-[#6e7f95]"
          >
            {t("dashboard.notifications.viewEarlier")}
            <IconChevronDown size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}
