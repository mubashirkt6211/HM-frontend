import { useMemo, useState } from "react";
import {
  Bed,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Car,
  Check,
  CheckCircle,
  EnvelopeSimple,
  FilePdf,
  Funnel,
  Heart,
  MagnifyingGlass,
  MapPin,
  NotePencil,
  Phone,
  Plus,
  Stamp,
  Ticket,
  Trash,
  UsersThree,
  X,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PackageType = "All" | "International" | "Domestic" | "Regional";

type DayPlan = {
  id: string;
  title: string;
  activities: string[];
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
  stay: string;
  transport: string;
};

type Destination = {
  id: string;
  name: string;
  country: string;
  type: Exclude<PackageType, "All">;
  emoji: string;
  image?: string;
  description: string;
};

type VariantKey = "classic" | "honeymoon" | "family" | "adventure" | "budget";

type Template = {
  id: string;
  code: string;
  name: string;
  variantLabel: string;
  variantKey: VariantKey;
  tag: string;
  description: string;
  destinationId: string;
  price: number;
  days: DayPlan[];
};

type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
  startDate: string;
  pickup: string;
  notes: string;
};

type FlightDocument = {
  id: string;
  label: string;
  flight: string;
  airline: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  terminal: string;
  gate: string;
  seat: string;
  status: string;
};

const packageStyles: Record<Exclude<PackageType, "All">, { badge: string; stub: string; ring: string }> = {
  International: {
    badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
    stub: "from-indigo-600 to-indigo-500",
    ring: "ring-indigo-200 dark:ring-indigo-900",
  },
  Domestic: {
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    stub: "from-emerald-600 to-emerald-500",
    ring: "ring-emerald-200 dark:ring-emerald-900",
  },
  Regional: {
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    stub: "from-amber-600 to-amber-500",
    ring: "ring-amber-200 dark:ring-amber-900",
  },
};

const variantStyles: Record<VariantKey, string> = {
  classic: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  honeymoon: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  family: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  adventure: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  budget: "bg-lime-50 text-lime-700 dark:bg-lime-950/40 dark:text-lime-300",
};

const categories: PackageType[] = ["All", "International", "Domestic", "Regional"];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85";

const uid = () => Math.random().toString(36).slice(2, 9);

const makeDay = (id: string, title: string, activities: string[], stay: string, transport: string): DayPlan => ({
  id,
  title,
  activities,
  meals: { breakfast: true, lunch: true, dinner: false },
  stay,
  transport,
});

const cloneDay = (day: DayPlan): DayPlan => ({
  ...day,
  id: uid(),
  meals: { ...day.meals },
  activities: [...day.activities],
});

// Stretches or trims a base day-plan by one day so each variant feels distinct
// without hand-writing a full itinerary for every single package.
const adjustDays = (baseDays: DayPlan[], delta: -1 | 0 | 1): DayPlan[] => {
  const cloned = baseDays.map(cloneDay);
  if (delta === 0) return cloned;

  if (delta === 1) {
    const anchor = cloned[cloned.length - 2] ?? cloned[0];
    const leisureDay = makeDay(
      uid(),
      "Leisure & Relaxation",
      ["Free time at leisure", "Optional spa or local exploration"],
      anchor.stay,
      "At leisure",
    );
    cloned.splice(cloned.length - 1, 0, leisureDay);
    return cloned;
  }

  // delta === -1
  if (cloned.length > 2) {
    cloned.splice(cloned.length - 2, 1);
  }
  return cloned;
};

// ---------------------------------------------------------------------------
// Destinations & base day-plans
// ---------------------------------------------------------------------------

const destinations: Destination[] = [
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    type: "International",
    emoji: "🌴",
    image: "https://i.pinimg.com/736x/ae/85/29/ae8529c1501c51534c68a7caef3e093a.jpg",
    description: "Temples, rice terraces, and beach sunsets across Ubud and Seminyak.",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    type: "International",
    emoji: "🏜️",
    image: "https://i.pinimg.com/736x/1e/6f/d6/1e6fd64e4fa7be1dcd345ac1ed63ffc5.jpg",
    description: "Desert safaris, the Burj Khalifa, and souks — a fast-paced city and dune combo.",
  },
  {
    id: "kashmir",
    name: "Kashmir",
    country: "India",
    type: "Domestic",
    emoji: "🏔️",
    description: "Srinagar houseboats, Gulmarg gondola rides, and Pahalgam river valleys.",
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    country: "India",
    type: "Domestic",
    emoji: "🏰",
    description: "Forts, palaces, and desert camps across Jaipur, Jodhpur, and Jaisalmer.",
  },
  {
    id: "munnar",
    name: "Munnar",
    country: "Kerala, India",
    type: "Regional",
    emoji: "🍃",
    description: "Tea gardens, misty viewpoints, and a slow-paced hill-station weekend.",
  },
  {
    id: "alleppey",
    name: "Alleppey",
    country: "Kerala, India",
    type: "Regional",
    emoji: "🛶",
    description: "A houseboat stay through Kerala's palm-fringed backwater canals.",
  },
];

const baseDaysByDestination: Record<string, DayPlan[]> = {
  bali: [
    makeDay("d1", "Arrival & Seminyak", ["Airport pickup", "Hotel check-in", "Sunset at Seminyak Beach"], "Seminyak Beach Resort", "Private car"),
    makeDay("d2", "Ubud Culture Trail", ["Tegalalang rice terrace", "Sacred Monkey Forest", "Ubud art market"], "Ubud Heritage Villa", "Private car"),
    makeDay("d3", "Temples & Waterfalls", ["Tirta Empul temple", "Tegenungan waterfall", "Traditional Balinese lunch"], "Ubud Heritage Villa", "Private car"),
    makeDay("d4", "Nusa Penida Day Trip", ["Speedboat to Nusa Penida", "Kelingking viewpoint", "Snorkelling"], "Ubud Heritage Villa", "Speedboat + car"),
    makeDay("d5", "Leisure & Departure", ["Spa morning", "Souvenir shopping", "Airport drop-off"], "—", "Private car"),
  ],
  dubai: [
    makeDay("d1", "Arrival & Marina", ["Airport pickup", "Dubai Marina walk", "Dhow dinner cruise"], "Marina View Hotel", "Private car"),
    makeDay("d2", "City Icons", ["Burj Khalifa 'At the Top'", "Dubai Mall & fountain show", "Old Dubai souks"], "Marina View Hotel", "Private car"),
    makeDay("d3", "Desert Safari", ["Dune bashing", "Camel ride", "BBQ dinner with live show"], "Marina View Hotel", "4x4 safari van"),
    makeDay("d4", "Leisure & Departure", ["Late checkout", "Duty-free shopping", "Airport drop-off"], "—", "Private car"),
  ],
  kashmir: [
    makeDay("d1", "Arrival in Srinagar", ["Airport pickup", "Houseboat check-in", "Shikara ride on Dal Lake"], "Deluxe Houseboat", "Private car"),
    makeDay("d2", "Srinagar Sightseeing", ["Mughal Gardens", "Shankaracharya Temple", "Local handicraft market"], "Deluxe Houseboat", "Private car"),
    makeDay("d3", "Gulmarg Day Trip", ["Gondola ride to Apharwat Peak", "Snow point leisure time"], "Hotel Gulmarg Heights", "Private car"),
    makeDay("d4", "Pahalgam Transfer", ["Drive to Pahalgam", "Betaab Valley", "Riverside walk"], "Pine Valley Resort", "Private car"),
    makeDay("d5", "Aru & Betaab Valleys", ["Aru Valley excursion", "Pony ride (optional)", "Local Kashmiri dinner"], "Pine Valley Resort", "Private car"),
    makeDay("d6", "Departure", ["Drive back to Srinagar", "Airport drop-off"], "—", "Private car"),
  ],
  rajasthan: [
    makeDay("d1", "Arrival in Jaipur", ["Airport pickup", "Hotel check-in", "Evening at Johari Bazaar"], "Heritage Haveli Jaipur", "Private car"),
    makeDay("d2", "Jaipur Forts", ["Amber Fort", "City Palace", "Hawa Mahal photo stop"], "Heritage Haveli Jaipur", "Private car"),
    makeDay("d3", "Transfer to Jodhpur", ["Drive to Jodhpur", "Mehrangarh Fort", "Blue City walk"], "Blue City Boutique Hotel", "Private car"),
    makeDay("d4", "Jodhpur to Jaisalmer", ["Scenic drive", "Jaisalmer Fort at sunset"], "Desert Marigold Resort", "Private car"),
    makeDay("d5", "Sam Sand Dunes", ["Camel safari", "Desert camp check-in", "Folk dance & bonfire dinner"], "Desert Camp", "Jeep + camel"),
    makeDay("d6", "Jaisalmer Leisure", ["Patwon Ki Haveli", "Local market shopping"], "Desert Marigold Resort", "Private car"),
    makeDay("d7", "Departure", ["Transfer to airport", "Departure"], "—", "Private car"),
  ],
  munnar: [
    makeDay("d1", "Arrival & Tea Gardens", ["Pickup from base town", "Tea Museum visit", "Evening at Tea Garden viewpoint"], "Hillside Resort Munnar", "Private car"),
    makeDay("d2", "Eravikulam & Top Station", ["Eravikulam National Park", "Top Station viewpoint", "Local spice plantation walk"], "Hillside Resort Munnar", "Private car"),
    makeDay("d3", "Leisure & Departure", ["Mattupetty Dam", "Echo Point", "Drop-off at base town"], "—", "Private car"),
  ],
  alleppey: [
    makeDay("d1", "Houseboat Check-in", ["Pickup from jetty", "Houseboat cruise through backwaters", "Sunset over the canals", "Onboard Kerala dinner"], "Premium Houseboat", "Houseboat"),
    makeDay("d2", "Village & Departure", ["Morning cruise", "Village walk & toddy shop stop", "Drop-off at jetty"], "—", "Private car"),
  ],
};

const basePriceByDestination: Record<string, number> = {
  bali: 68500,
  dubai: 54900,
  kashmir: 32000,
  rajasthan: 41200,
  munnar: 11800,
  alleppey: 8400,
};

const codePrefixByDestination: Record<string, string> = {
  bali: "INTL-BAL",
  dubai: "INTL-DXB",
  kashmir: "DOM-KSH",
  rajasthan: "DOM-RAJ",
  munnar: "REG-MUN",
  alleppey: "REG-ALP",
};

const variantDefs: { key: VariantKey; label: string; tag: string; priceFactor: number; nightsDelta: -1 | 0 | 1 }[] = [
  { key: "classic", label: "Classic", tag: "Best seller", priceFactor: 1, nightsDelta: 0 },
  { key: "honeymoon", label: "Honeymoon Special", tag: "Romantic", priceFactor: 1.4, nightsDelta: 1 },
  { key: "family", label: "Family Fun", tag: "Kid-friendly", priceFactor: 1.2, nightsDelta: 0 },
  { key: "adventure", label: "Adventure Plus", tag: "Active", priceFactor: 1.15, nightsDelta: 1 },
  { key: "budget", label: "Budget Saver", tag: "Value", priceFactor: 0.7, nightsDelta: -1 },
];

const templates: Template[] = destinations.flatMap((destination) => {
  const baseDays = baseDaysByDestination[destination.id];
  const basePrice = basePriceByDestination[destination.id];
  const codePrefix = codePrefixByDestination[destination.id];

  return variantDefs.map((variant) => ({
    id: `${destination.id}-${variant.key}`,
    code: `${codePrefix}-${variant.key.slice(0, 3).toUpperCase()}`,
    name: `${destination.name} ${variant.label}`,
    variantLabel: variant.label,
    variantKey: variant.key,
    tag: variant.tag,
    description: destination.description,
    destinationId: destination.id,
    price: Math.round((basePrice * variant.priceFactor) / 100) * 100,
    days: adjustDays(baseDays, variant.nightsDelta),
  }));
});

const emptyCustomer: CustomerDetails = {
  name: "",
  phone: "",
  email: "",
  adults: 2,
  children: 0,
  startDate: "",
  pickup: "",
  notes: "",
};

const internationalFlightDefaults: FlightDocument[] = [
  { id: "outbound", label: "Outbound flight", flight: "AI 934", airline: "Air India", from: "COK", to: "DXB", date: "2026-08-14", departure: "09:45 AM", arrival: "12:00 PM", terminal: "1", gate: "17", seat: "12A", status: "Boarding" },
  { id: "return", label: "Return flight", flight: "AI 935", airline: "Air India", from: "DXB", to: "COK", date: "2026-08-19", departure: "06:20 PM", arrival: "11:40 PM", terminal: "3", gate: "B12", seat: "12B", status: "Confirmed" },
];

const steps = [
  { id: 1, label: "Traveler Details", icon: UsersThree },
  { id: 2, label: "Day-wise Itinerary", icon: CalendarBlank },
  { id: 3, label: "Review & Generate", icon: FilePdf },
] as const;

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ItineraryBuilderPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PackageType>("All");

  const [pickerDestination, setPickerDestination] = useState<Destination | null>(null);
  const [favoriteDestinations, setFavoriteDestinations] = useState<string[]>([]);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [days, setDays] = useState<DayPlan[]>([]);
  const [flightDocuments, setFlightDocuments] = useState<FlightDocument[]>(internationalFlightDefaults);
  const [generated, setGenerated] = useState(false);

  const templatesByDestination = useMemo(() => {
    const map = new Map<string, Template[]>();
    templates.forEach((template) => {
      const list = map.get(template.destinationId) ?? [];
      list.push(template);
      map.set(template.destinationId, list);
    });
    return map;
  }, []);

  const filteredDestinations = useMemo(() => {
    const search = query.trim().toLowerCase();
    return destinations.filter((destination) => {
      const categoryMatch = category === "All" || destination.type === category;
      const searchMatch =
        !search ||
        `${destination.name} ${destination.country} ${destination.description}`.toLowerCase().includes(search);
      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  const activeDestination = activeTemplate ? destinations.find((d) => d.id === activeTemplate.destinationId) : null;
  const pickerTemplates = pickerDestination ? templatesByDestination.get(pickerDestination.id) ?? [] : [];

  const openWizard = (template: Template) => {
    setActiveTemplate(template);
    setCustomer(emptyCustomer);
    setDays(template.days.map(cloneDay));
    setFlightDocuments(internationalFlightDefaults.map((flight) => ({ ...flight })));
    setWizardStep(1);
    setGenerated(false);
    setPickerDestination(null);
    setWizardOpen(true);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setActiveTemplate(null);
  };

  const updateCustomer = (field: keyof CustomerDetails, value: string | number) =>
    setCustomer((prev) => ({ ...prev, [field]: value }));

  const updateDayField = (dayId: string, field: "title" | "stay" | "transport", value: string) =>
    setDays((prev) => prev.map((day) => (day.id === dayId ? { ...day, [field]: value } : day)));

  const toggleMeal = (dayId: string, meal: keyof DayPlan["meals"]) =>
    setDays((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, meals: { ...day.meals, [meal]: !day.meals[meal] } } : day)),
    );

  const updateActivity = (dayId: string, index: number, value: string) =>
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, activities: day.activities.map((a, i) => (i === index ? value : a)) } : day,
      ),
    );

  const addActivity = (dayId: string) =>
    setDays((prev) => prev.map((day) => (day.id === dayId ? { ...day, activities: [...day.activities, ""] } : day)));

  const removeActivity = (dayId: string, index: number) =>
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, activities: day.activities.filter((_, i) => i !== index) } : day,
      ),
    );

  const addDay = () => setDays((prev) => [...prev, makeDay(uid(), `Day ${prev.length + 1}`, [""], "", "")]);

  const removeDay = (dayId: string) => setDays((prev) => prev.filter((day) => day.id !== dayId));

  const updateFlightDocument = (flightId: string, field: keyof FlightDocument, value: string) =>
    setFlightDocuments((prev) => prev.map((flight) => (flight.id === flightId ? { ...flight, [field]: value } : flight)));

  const toggleFavoriteDestination = (destinationId: string) =>
    setFavoriteDestinations((prev) =>
      prev.includes(destinationId) ? prev.filter((id) => id !== destinationId) : [...prev, destinationId],
    );

  const step1Valid = customer.name.trim() && customer.phone.trim() && customer.startDate.trim();

  const handleGenerate = () => {
    // TODO: wire to backend PDF generation endpoint, e.g.
    // POST /api/itineraries/generate  { customer, template: activeTemplate?.code, days }
    setGenerated(true);
  };

  return (
    <main className="min-h-screen w-full bg-zinc-50/70 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {/* ---------------------------------------------------------------- Hero */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
              <Stamp className="size-4" />
              Travel workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Hi, Travel Desk <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Build memorable trips with ready-made plans, traveler details, and polished PDFs in one place.
            </p>
          </div>
          <Button
            className="h-10 gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            onClick={() => setPickerDestination(destinations[0])}
          >
            <Plus className="size-4" />
            Create itinerary
          </Button>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Ready-made plans", value: `${destinations.length}`, hint: "destinations to explore" },
            { label: "Package variants", value: `${templates.length}`, hint: "plans ready to customize" },
            { label: "Popular this week", value: "Bali", hint: "most selected destination" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{stat.value}</p>
                <span className="pb-0.5 text-right text-[11px] text-zinc-400">{stat.hint}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ---------------------------------------------------------------- Destinations */}
        <section className="mt-8 rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Browse trips</h2>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">Curated</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Find a ready-made travel plan and customize it for your traveler.
              </p>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search destination or country"
                className="h-11 rounded-2xl border-zinc-200 bg-zinc-50 pl-9 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Funnel className="mr-1 size-4 text-zinc-400" />
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${category === item
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredDestinations.map((destination, destinationIndex) => {
                const style = packageStyles[destination.type];
                const destTemplates = templatesByDestination.get(destination.id) ?? [];
                const prices = destTemplates.map((t) => t.price);
                const minPrice = Math.min(...prices);
                const featuredLabel = ["Best seller", "Popular", "Trending", "Top rated"][destinationIndex % 4];
                const leadTemplate = destTemplates[0];
                const isFavorite = favoriteDestinations.includes(destination.id);

                return (
                  <Card
                    key={destination.id}
                    className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-none transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div
                      className="relative flex h-44 items-end gap-3 overflow-hidden px-4 py-3 text-white"
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(9, 9, 11, .78), rgba(9, 9, 11, .05)), url(${destination.image ?? FALLBACK_IMAGE
                          })`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    >
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 shadow-sm">
                        {featuredLabel}
                      </span>
                      <button
                        aria-label={`${isFavorite ? "Remove" : "Add"} ${destination.name} ${isFavorite ? "from" : "to"} favorites`}
                        onClick={() => toggleFavoriteDestination(destination.id)}
                        className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/15 text-white backdrop-blur transition hover:bg-white hover:text-rose-500"
                      >
                        <Heart className="size-4" weight={isFavorite ? "fill" : "regular"} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold">{destination.name}</p>
                        <p className="text-xs tracking-wide text-white/85">{destination.country}</p>
                      </div>
                      <span className="grid size-7 place-items-center rounded-full bg-white/90 text-indigo-600 shadow-sm transition group-hover:bg-indigo-600 group-hover:text-white">
                        <CaretRight className="size-4" />
                      </span>
                    </div>

                    <CardContent className="space-y-4 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{destination.name}, {destination.country}</h3>
                          <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-4 text-zinc-500 dark:text-zinc-400">{destination.description}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${style.badge}`}>
                          {destination.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
                        <span className="text-zinc-400">from <strong className="text-base text-indigo-600 dark:text-indigo-400">{formatPrice(minPrice)}</strong></span>
                        <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                          <CalendarBlank className="size-3.5" />
                          {leadTemplate?.days.length ?? 0} Days Trip
                        </span>
                      </div>

                      <Button variant="outline" className="h-9 w-full gap-2 rounded-xl border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900" onClick={() => setPickerDestination(destination)}>
                        View details
                        <CaretRight className="size-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-zinc-200 p-10 text-center dark:border-zinc-800">
              <p className="font-medium text-zinc-900 dark:text-white">No destinations found</p>
              <p className="mt-1 text-sm text-zinc-500">Try another search or category.</p>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------------- Package picker */}
        <Dialog open={!!pickerDestination} onOpenChange={(open) => !open && setPickerDestination(null)}>
          {pickerDestination && (
            <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto p-0">
              <DialogHeader className="border-b border-zinc-200 px-4 py-5 pr-12 sm:px-6 sm:pr-14 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-zinc-100 text-xl dark:bg-zinc-900">
                    {pickerDestination.emoji}
                  </div>
                  <div className="min-w-0">
                    <DialogTitle>{pickerDestination.name} packages</DialogTitle>
                    <DialogDescription>
                      {pickerTemplates.length} ready-made packages · choose one to customize
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-3 px-6 py-5 sm:grid-cols-2">
                {pickerTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex flex-col justify-between rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${variantStyles[template.variantKey]}`}>
                          {template.tag}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">{template.code}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                        {template.variantLabel}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <CalendarBlank className="size-3.5" />
                        {template.days.length} days / {Math.max(template.days.length - 1, 1)} nights
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {formatPrice(template.price)}
                      </span>
                      <Button size="sm" className="gap-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={() => openWizard(template)}>
                        Use this
                        <CaretRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* ---------------------------------------------------------------- Wizard */}
        <Dialog open={wizardOpen} onOpenChange={(open) => !open && closeWizard()}>
          {activeTemplate && activeDestination && (
            <DialogContent className="grid max-h-[min(92vh,920px)] w-[calc(100%-1rem)] max-w-4xl grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:w-full">
              <DialogHeader className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-xl text-white ${packageStyles[activeDestination.type].stub}`}
                  >
                    {activeDestination.emoji}
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="truncate">{activeTemplate.name}</DialogTitle>
                    <DialogDescription>
                      {activeDestination.name}, {activeDestination.country} · {activeTemplate.code}
                    </DialogDescription>
                  </div>
                </div>

                {/* Stepper */}
                <div className="mt-5 flex items-center gap-1.5 sm:gap-2">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = wizardStep === step.id;
                    const isDone = wizardStep > step.id;
                    return (
                      <div key={step.id} className="flex flex-1 items-center gap-2">
                        <div
                          className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${isActive
                              ? "bg-indigo-600 text-white"
                              : isDone
                                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                            }`}
                        >
                          {isDone ? <Check className="size-3.5" /> : <StepIcon className="size-3.5" />}
                          <span className="hidden md:inline">{step.label}</span>
                        </div>
                        {index < steps.length - 1 && <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />}
                      </div>
                    );
                  })}
                </div>
              </DialogHeader>

              <div className="min-h-0 overflow-y-auto px-4 py-5 sm:px-6">
                <div className="space-y-6">
                  {/* ------------------------------------------------ Step 1: Traveler details */}
                  {wizardStep === 1 && (
                    <div className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          Customer name
                          <div className="relative">
                            <UsersThree className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                            <input
                              value={customer.name}
                              onChange={(e) => updateCustomer("name", e.target.value)}
                              placeholder="e.g. Anjali Menon"
                              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                            />
                          </div>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          Phone number
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                            <input
                              value={customer.phone}
                              onChange={(e) => updateCustomer("phone", e.target.value)}
                              placeholder="e.g. +91 98765 43210"
                              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                            />
                          </div>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          Email
                          <div className="relative">
                            <EnvelopeSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                            <input
                              value={customer.email}
                              onChange={(e) => updateCustomer("email", e.target.value)}
                              placeholder="e.g. anjali@email.com"
                              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                            />
                          </div>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          Travel start date
                          <div className="relative">
                            <CalendarBlank className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                            <input
                              type="date"
                              value={customer.startDate}
                              onChange={(e) => updateCustomer("startDate", e.target.value)}
                              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                            />
                          </div>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          Adults
                          <input
                            type="number"
                            min={1}
                            value={customer.adults}
                            onChange={(e) => updateCustomer("adults", Number(e.target.value))}
                            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                          />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          Children
                          <input
                            type="number"
                            min={0}
                            value={customer.children}
                            onChange={(e) => updateCustomer("children", Number(e.target.value))}
                            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                          />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 sm:col-span-2">
                          Pickup location
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                            <input
                              value={customer.pickup}
                              onChange={(e) => updateCustomer("pickup", e.target.value)}
                              placeholder="e.g. Kochi International Airport"
                              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                            />
                          </div>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 sm:col-span-2">
                          Special requests
                          <textarea
                            value={customer.notes}
                            onChange={(e) => updateCustomer("notes", e.target.value)}
                            placeholder="Dietary needs, accessibility, celebration occasions..."
                            rows={3}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------ Step 2: Day-wise itinerary */}
                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      {activeDestination?.type === "International" && (
                        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Ticket className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="font-semibold text-zinc-900 dark:text-white">Flight documents</h3>
                              </div>
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Add the flight details that will appear on the traveler&apos;s boarding documents.
                              </p>
                            </div>
                            <Badge className="w-fit border-0 bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300">
                              International
                            </Badge>
                          </div>

                          <div className="mt-4 grid gap-3 lg:grid-cols-2">
                            {flightDocuments.map((flight) => (
                              <div key={flight.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-indigo-100 dark:bg-zinc-950 dark:ring-zinc-800">
                                <div className="flex items-center justify-between border-b border-dashed border-zinc-200 px-4 py-3 dark:border-zinc-800">
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{flight.label}</p>
                                    <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-white">
                                      {flight.flight} <span className="font-normal text-zinc-400">· {flight.airline}</span>
                                    </p>
                                  </div>
                                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${flight.status === "Boarding" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"}`}>
                                    {flight.status}
                                  </span>
                                </div>

                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4">
                                  <div>
                                    <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{flight.from}</p>
                                    <p className="text-[11px] text-zinc-400">{flight.departure}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-indigo-500">
                                    <span className="h-px w-5 bg-indigo-200 dark:bg-indigo-900" />
                                    <Ticket className="size-4" />
                                    <span className="h-px w-5 bg-indigo-200 dark:bg-indigo-900" />
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{flight.to}</p>
                                    <p className="text-[11px] text-zinc-400">{flight.arrival}</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Travel date</p>
                                    <p className="mt-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200">{flight.date}</p>
                                  </div>
                                  {flight.id === "outbound" && (
                                    <div
                                      aria-label="Boarding pass QR preview"
                                      className="size-12 rounded-md border-4 border-white bg-zinc-900 shadow-sm dark:border-zinc-800"
                                      style={{ backgroundImage: "repeating-conic-gradient(#18181b 0 25%, #fafafa 0 50%)", backgroundSize: "8px 8px" }}
                                    />
                                  )}
                                </div>

                                <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 px-4 py-3 text-[11px] dark:border-zinc-800">
                                  {(["terminal", "gate", "seat"] as const).map((field) => (
                                    <label key={field} className="space-y-1 font-medium capitalize text-zinc-400">
                                      {field}
                                      <input
                                        value={flight[field]}
                                        onChange={(event) => updateFlightDocument(flight.id, field, event.target.value)}
                                        className="h-7 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-semibold text-zinc-700 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                                      />
                                    </label>
                                  ))}
                                </div>

                                <details className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
                                  <summary className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400">Edit flight document</summary>
                                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {(["flight", "airline", "from", "to", "date", "departure", "arrival", "status"] as const).map((field) => (
                                      <label key={field} className="space-y-1 text-[11px] font-medium capitalize text-zinc-400">
                                        {field}
                                        <input
                                          type={field === "date" ? "date" : "text"}
                                          value={flight[field]}
                                          onChange={(event) => updateFlightDocument(flight.id, field, event.target.value)}
                                          className="h-8 w-full rounded-lg border border-zinc-200 bg-white px-2 text-xs text-zinc-700 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                                        />
                                      </label>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-white">Day-wise activities</h3>
                          <p className="text-xs text-zinc-500">Edit the plan, meals, and stay for each day.</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 rounded-md border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900" onClick={addDay}>
                          <Plus className="size-4" />
                          Add day
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {days.map((day, dayIndex) => (
                          <div key={day.id} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <div className="flex items-start gap-3">
                              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                {dayIndex + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                  Day {dayIndex + 1}
                                </p>
                                <input
                                  value={day.title}
                                  onChange={(e) => updateDayField(day.id, "title", e.target.value)}
                                  className="mt-1 w-full bg-transparent text-sm font-semibold text-zinc-900 outline-none dark:text-white"
                                />
                              </div>
                              <button
                                aria-label="Remove day"
                                onClick={() => removeDay(day.id)}
                                className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                              >
                                <Trash className="size-4" />
                              </button>
                            </div>

                            <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                              {day.activities.map((activity, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <NotePencil className="size-3.5 shrink-0 text-zinc-400" />
                                  <input
                                    value={activity}
                                    onChange={(e) => updateActivity(day.id, index, e.target.value)}
                                    placeholder="Add an activity"
                                    className="h-8 flex-1 rounded-lg border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                  />
                                  <button
                                    aria-label="Remove activity"
                                    onClick={() => removeActivity(day.id, index)}
                                    className="grid size-7 shrink-0 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addActivity(day.id)}
                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                              >
                                <Plus className="size-3.5" />
                                Add activity
                              </button>
                            </div>

                            <div className="mt-3 grid gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800 sm:grid-cols-2">
                              <label className="space-y-1 text-xs font-medium text-zinc-500">
                                <span className="flex items-center gap-1"><Bed className="size-3.5" /> Stay</span>
                                <input
                                  value={day.stay}
                                  onChange={(e) => updateDayField(day.id, "stay", e.target.value)}
                                  placeholder="Hotel / houseboat name"
                                  className="h-8 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                />
                              </label>
                              <label className="space-y-1 text-xs font-medium text-zinc-500">
                                <span className="flex items-center gap-1"><Car className="size-3.5" /> Transport</span>
                                <input
                                  value={day.transport}
                                  onChange={(e) => updateDayField(day.id, "transport", e.target.value)}
                                  placeholder="Private car / flight / ferry"
                                  className="h-8 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                />
                              </label>
                            </div>

                            <div className="mt-3 flex items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                              {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                                <button
                                  key={meal}
                                  onClick={() => toggleMeal(day.id, meal)}
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition ${day.meals[meal]
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                      : "bg-zinc-100 text-zinc-400 dark:bg-zinc-900"
                                    }`}
                                >
                                  {meal}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------ Step 3: Review & generate */}
                  {wizardStep === 3 && (
                    <div className="space-y-5">
                      {!generated ? (
                        <>
                          <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <h3 className="font-semibold text-zinc-900 dark:text-white">Traveler summary</h3>
                            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                              <div className="flex justify-between sm:block">
                                <dt className="text-zinc-500">Name</dt>
                                <dd className="font-medium text-zinc-900 dark:text-white">{customer.name || "—"}</dd>
                              </div>
                              <div className="flex justify-between sm:block">
                                <dt className="text-zinc-500">Phone</dt>
                                <dd className="font-medium text-zinc-900 dark:text-white">{customer.phone || "—"}</dd>
                              </div>
                              <div className="flex justify-between sm:block">
                                <dt className="text-zinc-500">Travelers</dt>
                                <dd className="font-medium text-zinc-900 dark:text-white">
                                  {customer.adults} adults{customer.children > 0 ? `, ${customer.children} children` : ""}
                                </dd>
                              </div>
                              <div className="flex justify-between sm:block">
                                <dt className="text-zinc-500">Start date</dt>
                                <dd className="font-medium text-zinc-900 dark:text-white">{customer.startDate || "—"}</dd>
                              </div>
                              <div className="flex justify-between sm:block sm:col-span-2">
                                <dt className="text-zinc-500">Pickup</dt>
                                <dd className="font-medium text-zinc-900 dark:text-white">{customer.pickup || "—"}</dd>
                              </div>
                            </dl>
                          </div>

                          <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <h3 className="font-semibold text-zinc-900 dark:text-white">
                              {activeTemplate.name} · {days.length} days
                            </h3>
                            <ol className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                              {days.map((day, index) => (
                                <li key={day.id} className="flex gap-2">
                                  <span className="font-semibold text-zinc-400">D{index + 1}</span>
                                  <span>{day.title} — {day.activities.filter(Boolean).length} activities</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/20">
                          <CheckCircle className="size-10 text-emerald-600" weight="fill" />
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-white">Itinerary ready</p>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                              {customer.name || "This traveler"}'s {activeTemplate.name.toLowerCase()} itinerary has
                              been created. Send it to the customer as a PDF.
                            </p>
                          </div>
                          <Button className="gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            <FilePdf className="size-4" />
                            Download PDF
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex shrink-0 flex-row items-center justify-between gap-2 border-t border-zinc-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-zinc-800">
                <Button
                  variant="outline"
                  className="gap-2 rounded-md border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
                >
                  <CaretLeft className="size-4" />
                  Back
                </Button>
                {wizardStep < 3 ? (
                  <Button
                    className="gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    disabled={wizardStep === 1 && !step1Valid}
                    onClick={() => setWizardStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))}
                  >
                    Next
                    <CaretRight className="size-4" />
                  </Button>
                ) : !generated ? (
                  <Button className="gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" onClick={handleGenerate}>
                    <FilePdf className="size-4" />
                    Generate Itinerary PDF
                  </Button>
                ) : (
                  <Button variant="outline" className="rounded-md border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900" onClick={closeWizard}>
                    Done
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </main>
  );
}
