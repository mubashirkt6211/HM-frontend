import {
  GoogleLogo,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  DribbbleLogo,
  User,
} from "@phosphor-icons/react";

export const STATUS_CONFIG = {
  Emergency: { color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400", dot: "bg-rose-500", border: "border-rose-200 dark:border-rose-800" },
  "Follow-up": { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", dot: "bg-blue-500", border: "border-blue-200 dark:border-blue-800" },
  Checkup: { color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400", dot: "bg-violet-500", border: "border-violet-200 dark:border-violet-800" },
  Discharged: { color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-200 dark:border-emerald-800" },
  Scheduled: { color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400", dot: "bg-orange-500", border: "border-orange-200 dark:border-orange-800" },
};

export const SOURCE_ICONS = {
  Google: GoogleLogo,
  Facebook: FacebookLogo,
  Instagram: InstagramLogo,
  LinkedIn: LinkedinLogo,
  Dribbble: DribbbleLogo,
  Direct: User,
};

export const FILTERS = ["All", "Emergency", "Follow-up", "Checkup", "Scheduled", "Discharged"];
