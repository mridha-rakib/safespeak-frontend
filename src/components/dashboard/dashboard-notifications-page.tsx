"use client";

import Link from "next/link";

import {
  IconBellFilled,
  IconBoltFilled,
  IconChevronDown,
  IconChevronLeft,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import type { NotificationView } from "@/components/dashboard/dashboard-types";
import { cn } from "@/lib/utils";

type NotificationFeedItem = {
  id: string;
  title: string;
  subtitle: string;
  time?: string;
  highlighted?: boolean;
};

export function NotificationsPage({ view }: { view: NotificationView }) {
  const { t } = useTranslation();

  const todayFeedItems: NotificationFeedItem[] = [
    {
      id: "n1",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      highlighted: true,
    },
    {
      id: "n2",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: "10:30 AM",
    },
    {
      id: "n3",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: "9:15 AM",
    },
    {
      id: "n4",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: t("dashboard.notifications.yesterday"),
    },
    {
      id: "n5",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: t("dashboard.notifications.yesterday"),
    },
  ];
  const pastFeedItems: NotificationFeedItem[] = [
    {
      id: "p1",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 4,
      }),
      time: "Feb 18",
    },
    {
      id: "p2",
      title: t("dashboard.notifications.weeklySummary"),
      subtitle: t("dashboard.notifications.weeklySummarySubtitle"),
      time: "Feb 17",
    },
    {
      id: "p3",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 2,
      }),
      time: "Feb 16",
    },
    {
      id: "p4",
      title: t("dashboard.notifications.timelineReminder"),
      subtitle: t("dashboard.notifications.timelineReminderSubtitle"),
      time: "Feb 15",
    },
    {
      id: "p5",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 1,
      }),
      time: "Feb 14",
    },
  ];
  const isToday = view === "today";
  const feedItems = isToday ? todayFeedItems : pastFeedItems;

  return (
    <div className="px-3 pb-8 sm:px-6 xl:px-6">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between bg-[#f1f3f7] px-4 py-3">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1f2a3a]">
            <IconChevronLeft size={16} />
            {t("dashboard.notifications.notification")}
          </div>
          <button className="text-sm font-medium text-[#6f8096]">
            {t("common.cancel")}
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

        <div className="mt-4 space-y-3">
          {feedItems.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "relative flex min-h-[64px] items-center rounded-2xl px-4 py-3",
                item.highlighted
                  ? "bg-[#f48600] text-white shadow-[0_8px_22px_rgba(244,134,0,0.35)]"
                  : "bg-[#e9e6f2] text-[#1f2a3a]"
              )}
            >
              {index === 0 && (
                <span className="absolute -left-9 top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#e94242] xl:block" />
              )}

              <span
                className={cn(
                  "relative mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  item.highlighted
                    ? "bg-[#f8a337] text-white"
                    : "bg-[#f7f7fb] text-[#2a3342]"
                )}
              >
                {item.highlighted ? (
                  <>
                    <IconBellFilled size={14} />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#ffb861]" />
                  </>
                ) : (
                  <IconBoltFilled size={14} />
                )}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{item.title}</p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    item.highlighted ? "text-white/90" : "text-[#7c8699]"
                  )}
                >
                  {item.subtitle}
                </p>
              </div>

              {item.time && (
                <span className="ml-auto pl-3 text-[10px] font-medium text-[#98a3b6]">
                  {item.time}
                </span>
              )}
            </article>
          ))}
        </div>

        <button className="mx-auto mt-4 inline-flex w-full items-center justify-center gap-1 text-xs font-medium text-[#6e7f95]">
          {t("dashboard.notifications.viewEarlier")}
          <IconChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}
