import type { ElementType } from "react";
import {
    Buildings,
    CalendarCheck,
    ChartLineUp,
    ChatCenteredDots,
    ClipboardText,
    ClockClockwise,
    Envelope,
    Funnel,
    Handshake,
    Megaphone,
    PhoneCall,
    Sparkle,
    Star,
    Target,
    TreeStructure,
    TrendUp,
    UserList,
    UserPlus,
    Users,
    Wallet,
    ShieldCheck,
    Briefcase,
    MapTrifold,
    Gear,
    Car,
    Sliders,
} from "@phosphor-icons/react";
import { CheckCircle2, LayoutGrid } from "lucide-react";

import { UserRole } from "@/models/user";
import { IconCalendarEvent, IconListCheck, IconMapSearch, IconPipeline, IconSmartHome, IconTax, IconTransactionBitcoin } from "@tabler/icons-react";

export interface NavItemConfig {
    icon?: ElementType;
    title: string;
    pageId?: string;
    badge?: string;
    iconColor?: string;
    iconFill?: boolean;
    roles?: UserRole[];
    subItems?: NavSubItemConfig[];
}

export interface NavSubItemConfig {
    title: string;
    pageId: string;
    icon?: ElementType;
    roles?: UserRole[];
}

export interface NavSectionConfig {
    title?: string;
    items: NavItemConfig[];
}

export const sidebarNavigationSections: NavSectionConfig[] = [
    {
        items: [
            { icon: IconSmartHome, title: "Dashboard", pageId: "dashboard" },
            { icon: IconPipeline, title: "Pipeline", pageId: "pipeline" },
            { icon: IconTax, title: "Revenue", pageId: "revenue", roles: [UserRole.ADMIN, UserRole.MANAGER] },
            { icon: IconListCheck, title: "To Do", pageId: "todo", badge: "6" },
            { icon: Target, title: "Leads", pageId: "leads", badge: "24", roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
            { icon: Briefcase, title: "Accounts", pageId: "accounts", badge: "4" },
            { icon: UserList, title: "Contacts", pageId: "contacts" },
            {
                icon: Handshake,
                title: "Deals",
                pageId: "deals",
                roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DOCTOR, UserRole.RECEPTIONIST],
                subItems: [
                    { title: "Open Deals", pageId: "open-deals", icon: ChartLineUp },
                    { title: "Won Deals", pageId: "won-deals", icon: ShieldCheck, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DOCTOR] },
                    { title: "Lost Deals", pageId: "lost-deals", icon: ClockClockwise, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST] },
                ],
            },
            { icon: UserPlus, title: "Prospects", pageId: "notes" },
            { icon: ChatCenteredDots, title: "Conversations", pageId: "messages", badge: "12" },
            { icon: PhoneCall, title: "Follow-ups", pageId: "tasks", badge: "5" },
            { icon: IconCalendarEvent, title: "Calendar", pageId: "calendar" },
            { icon: IconMapSearch, title: "Itinerary Builder", pageId: "itinerary-builder" },
            { icon: Envelope, title: "Emails", pageId: "emails", badge: "3", roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST] },
            { icon: ChartLineUp, title: "Reports", pageId: "reports", roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DOCTOR] },
            { icon: Sparkle, title: "Automations", pageId: "automations", roles: [UserRole.ADMIN] },
            { icon: TreeStructure, title: "Workflows", pageId: "workflows", roles: [UserRole.ADMIN] },
        ],
    },
    {
        title: "Services & Operations",
        items: [
            { icon: Car, title: "Service Setup", pageId: "service-setup", badge: "Hotels & Cabs" },
        ],
    },
    {
        title: "Settings & Help",
        items: [
            { icon: Gear, title: "Settings", pageId: "crm-config", badge: "Config", roles: [UserRole.ADMIN] },
            { icon: UserList, title: "User Profile", pageId: "profile" },
            { icon: ShieldCheck, title: "Privileges & Roles", pageId: "privileges", roles: [UserRole.ADMIN, UserRole.MANAGER] },
            { icon: Buildings, title: "Company Setup", pageId: "company-setup", roles: [UserRole.ADMIN] },
        ],
    },
    {
        title: "Favorites",
        items: [
            { icon: Star, title: "Hot Leads", pageId: "uk-eu-companies", iconColor: "text-orange-400" },
            { icon: Star, title: "Priority Accounts", pageId: "b2b-building", iconColor: "text-orange-400" },
            { icon: Star, title: "Partnerships", pageId: "partnership", iconColor: "text-orange-400" },
            { icon: Star, title: "Meeting Template", pageId: "crm-template", iconColor: "text-orange-400" },
        ],
    },
    {
        title: "Records",
        items: [
            { icon: Buildings, title: "Companies", pageId: "clients", roles: [UserRole.ADMIN, UserRole.MANAGER] },
            { icon: Users, title: "People", pageId: "people", roles: [UserRole.ADMIN, UserRole.MANAGER] },
        ],
    },
    {
        title: "Marketing & Campaigns",
        items: [
            { icon: Megaphone, title: "Campaigns", pageId: "sales-navigator", iconColor: "text-pink-500", iconFill: true },
            { icon: ClipboardText, title: "Sequences", pageId: "emails-marketing-agency", iconColor: "text-pink-500", iconFill: true },
        ],
    },
];
