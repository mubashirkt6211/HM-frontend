/**
 * Reviews Tab - Display and manage customer reviews
 */
import {
  Star,
  ThumbsUp,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card } from "./components.tsx";

interface Review {
  name: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
  color: string;
}

export function ReviewsTab() {
  const reviews: Review[] = [
    {
      name: "Alice Thompson",
      rating: 5,
      date: "2 days ago",
      comment:
        "The patient portal is incredibly intuitive. Significant improvement in our daily workflow. Highly recommended for any R&D team.",
      tags: ["UX", "Efficiency"],
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Roberto Rossi",
      rating: 4,
      date: "1 week ago",
      comment:
        "Great tool, though I'd like to see more automation in document generation. The UI is very polished though!",
      tags: ["Feature Request"],
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Elena Gilbert",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "The best medical R&D platform I've used. The team is very responsive to feedback and updates are frequent.",
      tags: ["Support", "UI"],
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Average Rating" trailing="4.8 / 5.0">
          <div className="mt-4 flex flex-col items-center justify-center py-6">
            <div className="flex items-center gap-1.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-7 h-7 fill-current transition-transform hover:scale-110",
                    i < 4
                      ? "text-amber-400"
                      : "text-zinc-200 dark:text-zinc-700 shadow-sm"
                  )}
                />
              ))}
            </div>
            <p className="text-[13px] font-bold text-zinc-400">
              Based on <span className="text-zinc-900 dark:text-zinc-100">124 reviews</span>
            </p>
          </div>
        </Card>
        <Card title="Client Satisfaction" trailing="94%">
          <div className="mt-4 flex flex-col items-center justify-center py-6 text-emerald-500 capitalize">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
              <ThumbsUp className="w-7 h-7" />
            </div>
            <span className="font-black text-xl tracking-tight">Excellent</span>
          </div>
        </Card>
        <Card title="Active Discussions" trailing="12 New">
          <div className="mt-4 flex flex-col items-center justify-center py-6 text-indigo-500">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <span className="font-black text-xl tracking-tight">Daily</span>
          </div>
        </Card>
        <div className="p-8 rounded-[40px] bg-zinc-900 dark:bg-zinc-100 flex flex-col items-center justify-center text-center shadow-2xl shadow-zinc-200 dark:shadow-none group cursor-pointer overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-white dark:text-zinc-900 font-bold text-lg mb-2">
              Want to help?
            </h4>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mb-8 max-w-30 mx-auto leading-tight">
              Your feedback helps us evolve the platform.
            </p>
            <button className="px-8 py-3 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-black text-[13px] hover:scale-105 active:scale-95 transition-all shadow-xl">
              Write Review
            </button>
          </div>
          <Star className="absolute -right-5 -top-5 w-24 h-24 text-white/5 dark:text-black/5 rotate-12 group-hover:scale-125 transition-transform" />
        </div>
      </div>

      <div className="space-y-5">
        {reviews.map((review, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center font-black text-[14px] shadow-inner",
                    review.color
                  )}
                >
                  {review.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-[16px] tracking-tight">
                    {review.name}
                  </h5>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={cn(
                            "w-3.5 h-3.5 fill-current",
                            j < review.rating
                              ? "text-amber-400"
                              : "text-zinc-200 dark:text-zinc-700"
                          )}
                        />
                      ))}
                    </div>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    <span className="text-[12px] text-zinc-400 font-medium">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <MoreVertical className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-6 leading-relaxed font-medium italic">
              "{review.comment}"
            </p>
            <div className="flex items-center gap-3 mt-8">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <button className="w-full py-8 text-[14px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest opacity-50 hover:opacity-100">
        Load more reviews...
      </button>
    </div>
  );
}
