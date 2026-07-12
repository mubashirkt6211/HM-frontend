import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Archive,
  ArrowLeft,
  ArrowUDownLeft,
  ArrowUDownRight,
  Asterisk,
  DotsThree,
  EnvelopeOpen,
  Funnel,
  MagnifyingGlass,
  PaperPlaneRight,
  Pencil,
  Star,
  Trash,
  Warning,
  X,
  FilePlus,
  Paperclip,
  At,
  Smiley,
  TextB,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
  Link,
  ImageSquare,
  Eye,
  FileText,
  Bell,
} from "@phosphor-icons/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type EmailFolder =
  | "inbox"
  | "starred"
  | "sent"
  | "drafts"
  | "archive"
  | "trash"
  | "spam";

type EmailLabel = "work" | "personal" | "finance" | "health" | "urgent";

type EmailAttachment = {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "doc" | "other";
};

type Email = {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: { name: string; email: string }[];
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: EmailFolder;
  labels: EmailLabel[];
  attachments: EmailAttachment[];
  isImportant?: boolean;
};

type ConfirmAction = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

function createSeedEmails(): Email[] {
  return [
    {
      id: "e1",
      from: { name: "Dr. Sarah Mitchell", email: "s.mitchell@hospital.com" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "Patient Care Update – Ward B Rounds",
      preview: "I wanted to bring to your attention the latest updates from our morning rounds in Ward B. Three patients have shown significant improvement...",
      body: `Good morning,

I wanted to bring to your attention the latest updates from our morning rounds in Ward B. Three patients have shown significant improvement following the revised treatment protocols introduced last week.

**Key Highlights:**
- Mr. Thompson (Bed 12) has been cleared for discharge on Friday pending final labs.
- Mrs. Garcia (Bed 7) responded well to the new antibiotic regimen; fever has subsided.
- The post-operative patient in Bed 15 is progressing as expected.

Please ensure the nursing staff is briefed on the updated care plans before the evening shift. I'll be available for any consultations until 6 PM.

Best regards,
Dr. Sarah Mitchell
Senior Consultant – Internal Medicine`,
      time: "9:42 AM",
      date: "Today",
      isRead: false,
      isStarred: true,
      folder: "inbox",
      labels: ["health", "work"],
      attachments: [
        { id: "a1", name: "Ward_B_Report.pdf", size: "1.2 MB", type: "pdf" },
        { id: "a2", name: "Lab_Results.pdf", size: "340 KB", type: "pdf" },
      ],
      isImportant: true,
    },
    {
      id: "e2",
      from: { name: "Finance Department", email: "finance@leadwave.com" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "Monthly Revenue Report – May 2026",
      preview: "Please find attached the consolidated revenue report for May 2026. Total collections were up 12% compared to last month...",
      body: `Dear Admin,

Please find attached the consolidated revenue report for May 2026.

**Summary:**
- Total Collections: $284,500 (↑ 12% MoM)
- Outstanding Invoices: $43,200
- Insurance Claims Processed: 142 (96% approval rate)
- New Patient Registrations: 87

The detailed breakdown by department and payer type is in the attached Excel file. Please review and approve by EOD for the board presentation.

If you have any questions, don't hesitate to reach out.

Regards,
Finance Department`,
      time: "8:15 AM",
      date: "Today",
      isRead: false,
      isStarred: false,
      folder: "inbox",
      labels: ["finance", "work"],
      attachments: [
        { id: "a3", name: "Revenue_May2026.xlsx", size: "2.8 MB", type: "doc" },
      ],
      isImportant: false,
    },
    {
      id: "e3",
      from: { name: "James Carter", email: "j.carter@medstaff.org" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "Re: Staffing Schedule – Upcoming Holiday",
      preview: "Thanks for sending over the holiday schedule. I've reviewed it with the team, and we have a couple of concerns about the night shift coverage...",
      body: `Hi,

Thanks for sending over the holiday schedule. I've reviewed it with the team, and we have a couple of concerns about the night shift coverage on the 25th and 26th.

Currently, we only have 2 registered nurses scheduled for the ICU on those nights, which doesn't meet our minimum staffing ratio of 1:2. Could we look at either:
1. Bringing in a per diem RN for those nights
2. Extending the evening shift for two volunteers

Please let me know how you'd like to proceed. I need to finalize the schedule by Thursday.

Thanks,
James Carter
HR – Nursing Staff Coordinator`,
      time: "Yesterday",
      date: "Yesterday",
      isRead: true,
      isStarred: false,
      folder: "inbox",
      labels: ["work"],
      attachments: [],
      isImportant: false,
    },
    {
      id: "e4",
      from: { name: "IT Support", email: "it@leadwave.com" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "System Maintenance Scheduled – Saturday 2 AM",
      preview: "This is a reminder that our scheduled system maintenance window is this Saturday from 2:00 AM to 4:00 AM. During this time, all HMS portals will be temporarily unavailable...",
      body: `Hi Team,

This is a reminder that our scheduled system maintenance window is this Saturday from 2:00 AM to 4:00 AM.

**During this time, the following services will be temporarily unavailable:**
- Patient Management Portal
- Billing & Invoicing System
- Staff Scheduling Module
- Lab Results Interface

All data is being backed up beforehand. We expect full restoration by 4:00 AM with no data loss. Emergency systems (ER intake, ICU monitoring) operate on a separate infrastructure and will NOT be affected.

Please inform your teams accordingly.

IT Support Team`,
      time: "Mon",
      date: "Jun 9",
      isRead: true,
      isStarred: false,
      folder: "inbox",
      labels: ["work"],
      attachments: [],
      isImportant: false,
    },
    {
      id: "e5",
      from: { name: "Dr. Emma Patel", email: "e.patel@hospital.com" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "Research Grant Application – Deadline Friday",
      preview: "I wanted to flag that the NIH research grant application we discussed is due this Friday at 5 PM. I've completed the clinical sections but need your administrative signatures...",
      body: `Dear Admin,

I wanted to flag that the NIH research grant application we discussed is due this Friday at 5 PM.

I've completed the clinical sections and the budget justification, but I still need:
1. Your administrative signature on pages 4 and 11
2. The hospital's tax ID and non-profit certification (EIN letter)
3. Confirmation of the matching funds commitment letter

This grant could bring in up to $750,000 over three years for our oncology research program. It's crucial we don't miss this deadline.

Could we schedule 20 minutes today or tomorrow to go through the documents?

Best,
Dr. Emma Patel
Head of Oncology Research`,
      time: "Sun",
      date: "Jun 8",
      isRead: true,
      isStarred: true,
      folder: "inbox",
      labels: ["work", "urgent"],
      attachments: [
        { id: "a4", name: "NIH_Grant_Draft.pdf", size: "4.1 MB", type: "pdf" },
        { id: "a5", name: "Budget_Justification.docx", size: "890 KB", type: "doc" },
      ],
      isImportant: true,
    },
    {
      id: "e6",
      from: { name: "Admin", email: "admin@leadwave.com" },
      to: [{ name: "Dr. Sarah Mitchell", email: "s.mitchell@hospital.com" }],
      subject: "Re: Patient Care Update – Ward B Rounds",
      preview: "Thank you for the detailed update, Dr. Mitchell. I've forwarded the care plan changes to the head nurse for the evening briefing...",
      body: `Dr. Mitchell,

Thank you for the detailed update. I've forwarded the care plan changes to the head nurse and confirmed the briefing is scheduled for 5:30 PM.

Regarding Mr. Thompson's discharge – I'll coordinate with the social work team to ensure the discharge plan and follow-up appointments are arranged before Friday.

Will you be attending the quality committee meeting on Thursday?

Best,
Admin`,
      time: "9:58 AM",
      date: "Today",
      isRead: true,
      isStarred: false,
      folder: "sent",
      labels: ["work"],
      attachments: [],
      isImportant: false,
    },
    {
      id: "e7",
      from: { name: "Admin", email: "admin@leadwave.com" },
      to: [{ name: "All Staff", email: "staff@leadwave.com" }],
      subject: "Draft: Q3 Performance Review Schedule",
      preview: "This is a draft for the upcoming Q3 performance review schedule. Please note the dates are tentative pending...",
      body: `[DRAFT]

Dear Team,

This is to inform you that Q3 performance reviews are scheduled to begin the week of July 14th.

Department heads will receive individual scheduling links by July 1st.

Note: This schedule is still being finalized.`,
      time: "Jun 10",
      date: "Jun 10",
      isRead: true,
      isStarred: false,
      folder: "drafts",
      labels: ["work"],
      attachments: [],
      isImportant: false,
    },
    {
      id: "e8",
      from: { name: "MedSupply Co.", email: "orders@medsupply.com" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "Your order #MS-2891 has shipped",
      preview: "Your medical supplies order #MS-2891 has been dispatched and is expected to arrive by June 16th. Track your shipment using the link below...",
      body: `Hello,

Your medical supplies order #MS-2891 has been dispatched.

**Order Details:**
- Surgical gloves (Box × 50)
- Disposable syringes (Pack × 200)
- IV bags 500ml (Case × 24)
- Expected Delivery: June 16, 2026

Track your shipment: [Click here to track]

Thank you for your business.
MedSupply Co.`,
      time: "Jun 11",
      date: "Jun 11",
      isRead: true,
      isStarred: false,
      folder: "inbox",
      labels: ["work"],
      attachments: [],
    },
    {
      id: "e9",
      from: { name: "Newsletter", email: "noreply@medbulletin.com" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "🏥 This Week in Healthcare: AI Diagnostics & Policy Updates",
      preview: "In this week's edition: How AI is transforming radiology reads, new CMS reimbursement policies for 2026, and a case study on telehealth expansion...",
      body: `This Week in Healthcare – Issue #142

IN THIS ISSUE:
• AI in Radiology: 94% accuracy in detecting early-stage lung nodules
• CMS 2026 Policy: New reimbursement codes effective October 1
• Telehealth Expansion: Three health systems share their stories
• Job Board: 14 new leadership positions posted this week

Read the full issue at medbulletin.com

Unsubscribe | Manage Preferences`,
      time: "Jun 10",
      date: "Jun 10",
      isRead: true,
      isStarred: false,
      folder: "inbox",
      labels: ["personal"],
      attachments: [],
    },
    {
      id: "e10",
      from: { name: "Spam Alert", email: "promo@discountmeds.net" },
      to: [{ name: "Admin", email: "admin@leadwave.com" }],
      subject: "💊 BIG SALE on medications! 80% off this weekend only!",
      preview: "Don't miss our massive sale on unverified medications. Click here to order without prescription...",
      body: `HUGE SALE! Click here to buy medications without a prescription! LIMITED TIME OFFER!`,
      time: "Jun 8",
      date: "Jun 8",
      isRead: false,
      isStarred: false,
      folder: "spam",
      labels: [],
      attachments: [],
    },
  ];
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

const LABEL_CONFIG: Record<EmailLabel, { label: string; color: string; bg: string; dot: string }> = {
  work:     { label: "Work",     color: "text-zinc-900 dark:text-zinc-100",    bg: "bg-zinc-100 dark:bg-zinc-800",     dot: "bg-zinc-900 dark:bg-zinc-100" },
  personal: { label: "Personal", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30", dot: "bg-purple-500" },
  finance:  { label: "Finance",  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", dot: "bg-emerald-500" },
  health:   { label: "Health",   color: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-900/30",     dot: "bg-rose-500" },
  urgent:   { label: "Urgent",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/30",   dot: "bg-amber-500" },
};

const FOLDER_CONFIG: Record<EmailFolder, { label: string; icon: React.ElementType }> = {
  inbox: { label: "Inbox", icon: Bell },
  starred: { label: "Starred", icon: Star },
  sent: { label: "Sent", icon: PaperPlaneRight },
  drafts: { label: "Drafts", icon: FilePlus },
  archive: { label: "Archive", icon: Archive },
  trash: { label: "Trash", icon: Trash },
  spam: { label: "Spam", icon: Warning },
};

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onCancel()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950">
        <DialogHeader className="px-6 pt-6 pb-4 bg-white dark:bg-zinc-950">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-900/40">
              <Trash className="h-5 w-5" weight="fill" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[16px] font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </DialogTitle>
              <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
          >
            <Trash className="h-4 w-4" weight="fill" />
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Compose Modal ────────────────────────────────────────────────────────────

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (email: Partial<Email>) => void;
  replyTo?: Email | null;
}

function ComposeModal({ open, onClose, onSend, replyTo }: ComposeModalProps) {
  const [to, setTo] = React.useState(replyTo ? replyTo.from.email : "");
  const [subject, setSubject] = React.useState(replyTo ? `Re: ${replyTo.subject}` : "");
  const [body, setBody] = React.useState(
    replyTo
      ? `\n\n──────────────────────────\nOn ${replyTo.date} at ${replyTo.time}, ${replyTo.from.name} wrote:\n\n${replyTo.body}`
      : ""
  );
  const [isSending, setIsSending] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTo(replyTo ? replyTo.from.email : "");
      setSubject(replyTo ? `Re: ${replyTo.subject}` : "");
      setBody(
        replyTo
          ? `\n\n──────────────────────────\nOn ${replyTo.date} at ${replyTo.time}, ${replyTo.from.name} wrote:\n\n${replyTo.body}`
          : ""
      );
    }
  }, [open, replyTo]);

  function handleSend() {
    if (!to.trim() || !subject.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      onSend({
        id: `sent-${Date.now()}`,
        from: { name: "Admin", email: "admin@leadwave.com" },
        to: [{ name: to, email: to }],
        subject,
        preview: body.slice(0, 80),
        body,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        date: "Today",
        isRead: true,
        isStarred: false,
        folder: "sent",
        labels: [],
        attachments: [],
      });
      setIsSending(false);
      onClose();
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-zinc-950 to-zinc-700">
          <DialogTitle className="text-white font-bold text-[15px]">
            {replyTo ? "Reply" : "New Message"}
          </DialogTitle>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="flex flex-col">
          {/* To */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-12">To</span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipients@example.com"
              className="flex-1 text-sm text-zinc-900 dark:text-zinc-100 bg-transparent outline-none placeholder:text-zinc-400"
            />
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-12">Subj</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent outline-none placeholder:text-zinc-400"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-5 py-2 border-b border-zinc-100 dark:border-zinc-800">
            {[TextB, TextItalic, TextUnderline, ListBullets, ListNumbers, Link, ImageSquare].map((Icon, i) => (
              <button key={i} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Body */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 min-h-[220px] px-6 py-4 text-sm text-zinc-800 dark:text-zinc-200 bg-transparent resize-none outline-none placeholder:text-zinc-400 leading-relaxed"
          />

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-2">
              {[Paperclip, At, Smiley].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSend}
                disabled={!to.trim() || !subject.trim() || isSending}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl shadow-md transition-all",
                  to.trim() && subject.trim()
                    ? "bg-gradient-to-r from-zinc-950 to-zinc-700 text-white hover:from-zinc-900 hover:to-zinc-800 shadow-zinc-900/20"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                )}
              >
                {isSending ? (
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <PaperPlaneRight className="w-4 h-4" />
                )}
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Email List Item ───────────────────────────────────────────────────────────

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
  onStar: () => void;
}

function EmailListItem({ email, isSelected, onClick, onStar }: EmailListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-4 px-6 py-4 text-left transition-all border-b border-zinc-100 dark:border-zinc-800/60 group relative",
        isSelected
          ? "bg-zinc-100/90 dark:bg-zinc-800/40"
          : email.isRead
          ? "bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            : "bg-zinc-50/40 dark:bg-zinc-900/20 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/30"
      )}
    >
      {/* Unread indicator */}
      {!email.isRead && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0" />
      )}

      <Avatar className="h-9 w-9 shrink-0 mt-0.5">
        {email.from.avatar && <AvatarImage src={email.from.avatar} alt={email.from.name} />}
        <AvatarFallback className="text-[12px] font-bold bg-gradient-to-br from-zinc-700 to-zinc-950 text-white">
          {getInitials(email.from.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn("text-[13px] truncate", email.isRead ? "font-medium text-zinc-900 dark:text-zinc-100" : "font-bold text-zinc-900 dark:text-zinc-100")}>
            {email.from.name}
          </span>
          <span className="text-[11px] text-zinc-400 shrink-0">{email.time}</span>
        </div>
        <p className={cn("text-[13px] truncate mb-1", email.isRead ? "font-normal text-zinc-700 dark:text-zinc-300" : "font-semibold text-zinc-900 dark:text-zinc-100")}>
          {email.subject}
        </p>
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500 truncate">{email.preview}</p>

        {/* Labels + attachments */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {email.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-zinc-400">
              <Paperclip className="w-3 h-3" />
              {email.attachments.length}
            </span>
          )}
          {email.labels.slice(0, 2).map((label) => (
            <span
              key={label}
              className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", LABEL_CONFIG[label].bg, LABEL_CONFIG[label].color)}
            >
              {LABEL_CONFIG[label].label}
            </span>
          ))}
        </div>
      </div>

      {/* Star button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStar();
        }}
        className={cn(
          "p-1 rounded-md transition-all shrink-0 mt-0.5",
          email.isStarred ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-amber-400"
        )}
      >
        <Star className="w-4 h-4" weight={email.isStarred ? "fill" : "regular"} />
      </button>
    </button>
  );
}

// ─── Email Detail View ────────────────────────────────────────────────────────

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onReply: () => void;
  onForward: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onStar: () => void;
}

function EmailDetail({ email, onClose, onReply, onForward, onDelete, onArchive, onStar }: EmailDetailProps) {
  const formatBody = (body: string) => {
    return body.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold text-zinc-800 dark:text-zinc-100 mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <li key={i} className="ml-4 text-zinc-700 dark:text-zinc-300">{line.slice(2)}</li>;
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-zinc-700 dark:text-zinc-300">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <ActionButton icon={Archive} label="Archive" onClick={onArchive} />
          <ActionButton icon={Trash} label="Delete" onClick={onDelete} destructive />
          <ActionButton icon={Star} label="Star" onClick={onStar} active={email.isStarred} activeColor="text-amber-400" />
          <ActionButton icon={DotsThree} label="More" onClick={() => { }} />
        </div>
      </div>

      {/* Subject */}
      <div className="px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <div className="flex items-start gap-3">
          <h1 className="flex-1 text-[20px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {email.subject}
          </h1>
          {email.isImportant && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full shrink-0">
              <Asterisk className="w-3 h-3" /> Important
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {email.labels.map((label) => (
            <span
              key={label}
              className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", LABEL_CONFIG[label].bg, LABEL_CONFIG[label].color)}
            >
              {LABEL_CONFIG[label].label}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5">
        {/* Sender info */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-11 w-11 shrink-0">
            {email.from.avatar && <AvatarImage src={email.from.avatar} alt={email.from.name} />}
            <AvatarFallback className="text-[13px] font-bold bg-gradient-to-br from-zinc-700 to-zinc-950 text-white">
              {getInitials(email.from.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">{email.from.name}</span>
                <span className="ml-2 text-[12px] text-zinc-400">&lt;{email.from.email}&gt;</span>
              </div>
              <span className="text-[12px] text-zinc-400 shrink-0">{email.date} · {email.time}</span>
            </div>
            <p className="text-[12px] text-zinc-400 mt-0.5">
              To: {email.to.map((t) => t.name || t.email).join(", ")}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="prose prose-sm max-w-none leading-relaxed space-y-1 text-[14px]">
          {formatBody(email.body)}
        </div>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="mt-8">
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-3">
              Attachments ({email.attachments.length})
            </p>
            <div className="flex flex-wrap gap-3">
              {email.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer group"
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    att.type === "pdf" ? "bg-rose-50 dark:bg-rose-900/30" : att.type === "image" ? "bg-zinc-100 dark:bg-zinc-800" : "bg-emerald-50 dark:bg-emerald-900/30"
                  )}>
                    <FileText className={cn("w-4 h-4",
                      att.type === "pdf" ? "text-rose-500" : att.type === "image" ? "text-zinc-700 dark:text-zinc-300" : "text-emerald-500"
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">{att.name}</p>
                    <p className="text-[11px] text-zinc-400">{att.size}</p>
                  </div>
                  <Eye className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors ml-1" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply / Forward actions */}
      <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-950 flex items-center gap-3">
        <button
          onClick={onReply}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-zinc-950 to-zinc-700 text-white rounded-xl shadow-md shadow-zinc-900/20 hover:from-zinc-900 hover:to-zinc-800 transition-all"
        >
          <ArrowUDownLeft className="w-4 h-4" /> Reply
        </button>
        <button
          onClick={onForward}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
        >
          <ArrowUDownRight className="w-4 h-4" /> Forward
        </button>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  destructive,
  active,
  activeColor,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex items-center justify-center h-9 w-9 rounded-xl transition-all",
        destructive
          ? "text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/30"
          : active
            ? cn(activeColor || "text-zinc-900 dark:text-zinc-100", "bg-zinc-100 dark:bg-zinc-800")
            : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
      )}
    >
      <Icon className="w-4.5 h-4.5" weight={active ? "fill" : "regular"} />
    </button>
  );
}

// ─── Main Email Page ──────────────────────────────────────────────────────────

export function EmailPage() {
  const [emails, setEmails] = React.useState<Email[]>(() => createSeedEmails());
  const [selectedFolder, setSelectedFolder] = React.useState<EmailFolder>("inbox");
  const [selectedEmailId, setSelectedEmailId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isComposeOpen, setIsComposeOpen] = React.useState(false);
  const [replyToEmail, setReplyToEmail] = React.useState<Email | null>(null);
  const [confirmAction, setConfirmAction] = React.useState<ConfirmAction | null>(null);
  const selectedEmail = React.useMemo(
    () => emails.find((e) => e.id === selectedEmailId) ?? null,
    [emails, selectedEmailId]
  );

  const filteredEmails = React.useMemo(() => {
    return emails.filter((e) => {
      const inFolder =
        selectedFolder === "starred" ? e.isStarred : e.folder === selectedFolder;
      const matchesSearch =
        !searchQuery ||
        e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.preview.toLowerCase().includes(searchQuery.toLowerCase());
      return inFolder && matchesSearch;
    });
  }, [emails, selectedFolder, searchQuery]);

  const folderCounts = React.useMemo(() => {
    const counts: Partial<Record<EmailFolder, number>> = {};
    (Object.keys(FOLDER_CONFIG) as EmailFolder[]).forEach((f) => {
      const count =
        f === "starred"
          ? emails.filter((e) => e.isStarred && !e.isRead).length
          : emails.filter((e) => e.folder === f && !e.isRead).length;
      if (count > 0) counts[f] = count;
    });
    return counts;
  }, [emails]);

  function handleSelectEmail(id: string) {
    setSelectedEmailId(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
    );
  }

  function handleStar(id: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e))
    );
  }

  function handleDelete(id: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, folder: "trash" as EmailFolder } : e))
    );
    setSelectedEmailId(null);
  }

  function handleArchive(id: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, folder: "archive" as EmailFolder } : e))
    );
    setSelectedEmailId(null);
  }

  function handleSendEmail(partial: Partial<Email>) {
    setEmails((prev) => [partial as Email, ...prev]);
  }

  function handleReply() {
    setReplyToEmail(selectedEmail);
    setIsComposeOpen(true);
  }

  function handleForward() {
    if (!selectedEmail) return;
    setReplyToEmail({ ...selectedEmail, subject: `Fwd: ${selectedEmail.subject}` } as Email);
    setIsComposeOpen(true);
  }

  function handleCloseCompose() {
    setIsComposeOpen(false);
    setTimeout(() => setReplyToEmail(null), 300);
  }

  function requestConfirm(action: ConfirmAction) {
    setConfirmAction(action);
  }

  const unreadInboxCount = emails.filter((e) => e.folder === "inbox" && !e.isRead).length;

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">

      {/* ── Left Sidebar: Folder Nav ── */}
      <div className="flex min-h-0 w-[220px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/30">

        {/* Compose button */}
        <div className="px-4 pt-5 pb-3">
          <button
            onClick={() => { setReplyToEmail(null); setIsComposeOpen(true); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-zinc-950 to-zinc-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-zinc-900/20 hover:from-zinc-900 hover:to-zinc-800 transition-all"
          >
            <Pencil className="w-4 h-4" />
            Compose
          </button>
        </div>

        {/* Folders */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4">
          <div className="space-y-0.5">
            {(Object.entries(FOLDER_CONFIG) as [EmailFolder, typeof FOLDER_CONFIG[EmailFolder]][]).map(
              ([folderId, { label, icon: Icon }]) => (
                <button
                  key={folderId}
                  onClick={() => { setSelectedFolder(folderId); setSelectedEmailId(null); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                    selectedFolder === folderId
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  <Icon
                    className={cn("w-4.5 h-4.5 shrink-0", selectedFolder === folderId ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400")}
                    weight={selectedFolder === folderId ? "fill" : "regular"}
                  />
                  <span className="flex-1">{label}</span>
                  {folderCounts[folderId] !== undefined && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      folderId === "spam"
                        ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    )}>
                      {folderCounts[folderId]}
                    </span>
                  )}
                </button>
              )
            )}
          </div>

          {/* Labels section */}
          <div className="mt-6">
            <p className="px-3 mb-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Labels</p>
            <div className="space-y-0.5">
              {(Object.entries(LABEL_CONFIG) as [EmailLabel, typeof LABEL_CONFIG[EmailLabel]][]).map(
                ([labelId, { label }]) => (
                <button
                    key={labelId}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                  >
                    <span className={cn("w-2 h-2 rounded-full shrink-0", LABEL_CONFIG[labelId].dot)} />
                    <span>{label}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </nav>

        {/* Storage indicator */}
        <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500">Storage</span>
            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">2.1 / 15 GB</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-[14%] bg-gradient-to-r from-zinc-950 to-zinc-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── Middle: Email List ── */}
      <div className={cn(
        "flex min-h-0 flex-col border-r border-zinc-200 bg-white transition-all dark:border-zinc-800 dark:bg-zinc-950",
        selectedEmail ? "w-[320px] shrink-0" : "flex-1"
      )}>
        {/* List header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-black text-zinc-900 dark:text-zinc-100 capitalize">
                {FOLDER_CONFIG[selectedFolder].label}
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {filteredEmails.length} email{filteredEmails.length !== 1 ? "s" : ""}
                {selectedFolder === "inbox" && unreadInboxCount > 0 && `, ${unreadInboxCount} unread`}
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <Funnel className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              className="h-11 w-full pl-10 pr-4 text-sm text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-900 transition-all placeholder:text-zinc-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <EnvelopeOpen className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <p className="text-sm font-semibold text-zinc-400">No emails here</p>
              <p className="text-[12px] text-zinc-300 dark:text-zinc-600">
                {searchQuery ? "Try a different search" : "This folder is empty"}
              </p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={email.id === selectedEmailId}
                onClick={() => handleSelectEmail(email.id)}
                onStar={() => handleStar(email.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right: Email Detail ── */}
      {selectedEmail ? (
        <div className="flex min-h-0 flex-1 min-w-0">
          <EmailDetail
            email={selectedEmail}
            onClose={() => setSelectedEmailId(null)}
            onReply={handleReply}
            onForward={handleForward}
            onDelete={() =>
              requestConfirm({
                title: "Delete email?",
                description: "This will move the message to trash.",
                confirmLabel: "Delete",
                onConfirm: () => handleDelete(selectedEmail.id),
              })
            }
            onArchive={() =>
              requestConfirm({
                title: "Archive email?",
                description: "This will move the message to the archive folder.",
                confirmLabel: "Archive",
                onConfirm: () => handleArchive(selectedEmail.id),
              })
            }
            onStar={() => handleStar(selectedEmail.id)}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 min-w-0 flex-col items-center justify-center gap-4 bg-zinc-50/30 dark:bg-zinc-900/10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
            <EnvelopeOpen className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-bold text-zinc-600 dark:text-zinc-400">Select an email to read</p>
            <p className="text-[13px] text-zinc-400 dark:text-zinc-600 mt-1">
              Choose from your {FOLDER_CONFIG[selectedFolder].label.toLowerCase()}
            </p>
          </div>
          <button
            onClick={() => { setReplyToEmail(null); setIsComposeOpen(true); }}
            className="flex items-center gap-2 mt-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-zinc-950 to-zinc-700 text-white rounded-xl shadow-lg shadow-zinc-900/20 hover:from-zinc-900 hover:to-zinc-800 transition-all"
          >
            <Pencil className="w-4 h-4" />
            Compose New
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmAction !== null}
        title={confirmAction?.title ?? ""}
        description={confirmAction?.description ?? ""}
        confirmLabel={confirmAction?.confirmLabel}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          const action = confirmAction;
          setConfirmAction(null);
          action?.onConfirm();
        }}
      />

      {/* Compose Modal */}
      <ComposeModal
        open={isComposeOpen}
        onClose={handleCloseCompose}
        onSend={handleSendEmail}
        replyTo={replyToEmail}
      />
    </div>
  );
}
