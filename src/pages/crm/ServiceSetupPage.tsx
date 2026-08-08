import React, { useState } from "react";
import {
  Buildings,
  Car,
  Compass,
  Plus,
  MagnifyingGlass,
  CheckCircle,
  PencilSimple,
  Trash,
  Star,
  MapPin,
  Bed,
  Users,
  CurrencyDollar,
  Gear,
  Phone,
  Envelope,
  Tag,
  Funnel,
  Check,
  X,
  Sparkle,
  Calendar,
  FilePdf,
  ShieldCheck,
  Info,
  Clock,
  ArrowSquareOut,
  DownloadSimple
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/reui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SeasonalRate {
  season: string;
  period: string;
  adjustment: string;
  rate: string;
  notes?: string;
}

interface RoomCategory {
  name: string;
  baseRate: string;
  maxOccupancy: string;
  extraBedRate: string;
  features: string[];
}

interface HotelVendor {
  id: string;
  name: string;
  city: string;
  rating: string;
  stars: number;
  roomTypes: string[];
  baseRate: string;
  amenities: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  status: string;
  rooms: RoomCategory[];
  seasonalPricing: SeasonalRate[];
  contract: {
    contractId: string;
    b2bCommission: string;
    paymentTerms: string;
    cancellationPolicy: string;
    validity: string;
    signedBy: string;
    contractFile: string;
  };
}

const INITIAL_HOTELS: HotelVendor[] = [
  {
    id: "h1",
    name: "Grand Palace Resort & Spa",
    city: "Dubai, UAE",
    rating: "5 Star Luxury",
    stars: 5,
    roomTypes: ["Deluxe Ocean View", "Executive Suite", "Royal Villa"],
    baseRate: "$350 / night",
    amenities: ["Free WiFi 6", "Infinity Pool", "Buffet Breakfast", "Full Spa", "Private Beach"],
    contactPerson: "Elena Rostova (Director of Sales)",
    contactPhone: "+971 4 888 9999",
    contactEmail: "reservations@grandpalace.com",
    address: "Palm Jumeirah Crescent, West Crescent, Dubai, UAE",
    status: "Active Vendor",
    rooms: [
      { name: "Deluxe Ocean View", baseRate: "$350 / night", maxOccupancy: "2 Adults + 1 Child", extraBedRate: "$75", features: ["King Bed", "Ocean Balcony", "Marble Bath"] },
      { name: "Executive Suite", baseRate: "$550 / night", maxOccupancy: "3 Adults", extraBedRate: "$100", features: ["Living Room", "Lounge Access", "Jacuzzi"] },
      { name: "Royal Villa", baseRate: "$1,250 / night", maxOccupancy: "6 Guests", extraBedRate: "$150", features: ["Private Pool", "Butler 24/7", "3 Bedrooms"] },
    ],
    seasonalPricing: [
      { season: "Peak Festive Season", period: "Nov 15 – Jan 15", adjustment: "+40% Surge", rate: "$490 / night", notes: "Mandatory New Year Gala $150/guest" },
      { season: "High Travel Season", period: "Feb 01 – Apr 30", adjustment: "Standard B2B Contract Rate", rate: "$350 / night", notes: "Guaranteed 14-day hold" },
      { season: "Summer Off-Peak", period: "May 01 – Sep 30", adjustment: "-35% Discount", rate: "$227.50 / night", notes: "Includes complimentary Spa pass" },
      { season: "Autumn Shoulder", period: "Oct 01 – Nov 14", adjustment: "Standard B2B Rate", rate: "$350 / night" },
    ],
    contract: {
      contractId: "CTR-2026-DXB-0912",
      b2bCommission: "18% Net Partner Discount",
      paymentTerms: "Net 30 Days Invoiced Credit Billing",
      cancellationPolicy: "Free cancellation up to 72 hours prior to arrival",
      validity: "Jan 01, 2026 – Dec 31, 2026",
      signedBy: "Alexander Vance (Managing Partner)",
      contractFile: "grand_palace_contract_2026.pdf",
    },
  },
  {
    id: "h2",
    name: "Alps Boutique Chalet",
    city: "Zermatt, Switzerland",
    rating: "4 Star Superior",
    stars: 4,
    roomTypes: ["Matterhorn View Suite", "Alpine Double"],
    baseRate: "$280 / night",
    amenities: ["Heated Alpine Pool", "Ski Storage & Lift Pass", "Sauna & Steam", "Fireplace Lounge"],
    contactPerson: "Hans Weber (General Manager)",
    contactPhone: "+41 27 966 8000",
    contactEmail: "info@alpschalet.ch",
    address: "Bahnhofstrasse 45, 3920 Zermatt, Switzerland",
    status: "Active Vendor",
    rooms: [
      { name: "Alpine Double", baseRate: "$280 / night", maxOccupancy: "2 Guests", extraBedRate: "$60", features: ["Matterhorn View", "Pine Wood Finish", "Breakfast"] },
      { name: "Matterhorn View Suite", baseRate: "$450 / night", maxOccupancy: "4 Guests", extraBedRate: "$90", features: ["Private Sauna", "Balcony", "Fireplace"] },
    ],
    seasonalPricing: [
      { season: "Ski Peak Season", period: "Dec 01 – Mar 31", adjustment: "+50% Surge", rate: "$420 / night", notes: "Includes ski pass voucher" },
      { season: "Spring Hiking Season", period: "Apr 01 – Jun 30", adjustment: "Standard B2B Rate", rate: "$280 / night" },
      { season: "Summer Alp Season", period: "Jul 01 – Aug 31", adjustment: "+15% High Season", rate: "$322 / night" },
      { season: "Autumn Shoulder", period: "Sep 01 – Nov 30", adjustment: "-25% Discount", rate: "$210 / night" },
    ],
    contract: {
      contractId: "CTR-2026-CHE-4412",
      b2bCommission: "15% Net Partner Discount",
      paymentTerms: "Net 15 Days Credit Billing",
      cancellationPolicy: "Free cancellation up to 7 days prior to check-in",
      validity: "Jan 01, 2026 – Dec 31, 2026",
      signedBy: "Hans Weber (General Manager)",
      contractFile: "alps_chalet_contract_2026.pdf",
    },
  },
  {
    id: "h3",
    name: "Marina Bay Vista Hotel",
    city: "Singapore",
    rating: "5 Star Luxury",
    stars: 5,
    roomTypes: ["Club King", "Bay View Premier"],
    baseRate: "$420 / night",
    amenities: ["Rooftop Bar", "Infinity Sky Pool", "24/7 Gym", "Concierge Butler"],
    contactPerson: "Mei Ling (Head of Contracting)",
    contactPhone: "+65 6688 8868",
    contactEmail: "stay@marinabayvista.sg",
    address: "10 Bayfront Avenue, Marina Bay, Singapore 018956",
    status: "Active Vendor",
    rooms: [
      { name: "Club King", baseRate: "$420 / night", maxOccupancy: "2 Guests", extraBedRate: "$80", features: ["Skyline View", "Club Lounge Access", "Cocktails"] },
      { name: "Bay View Premier", baseRate: "$620 / night", maxOccupancy: "3 Guests", extraBedRate: "$110", features: ["Marina Bay View", "Deep Soak Tub", "Nespresso Bar"] },
    ],
    seasonalPricing: [
      { season: "F1 Grand Prix Week", period: "Sep 15 – Sep 22", adjustment: "+120% Surge", rate: "$924 / night", notes: "Non-refundable booking term" },
      { season: "Standard Business Season", period: "Oct 01 – May 31", adjustment: "Standard B2B Rate", rate: "$420 / night" },
      { season: "Mid-Year Travel", period: "Jun 01 – Aug 31", adjustment: "-15% Discount", rate: "$357 / night" },
    ],
    contract: {
      contractId: "CTR-2026-SGP-9011",
      b2bCommission: "20% Net Partner Discount",
      paymentTerms: "Net 30 Days Credit Billing",
      cancellationPolicy: "Free cancellation up to 48 hours prior to arrival",
      validity: "Jan 01, 2026 – Dec 31, 2026",
      signedBy: "Tan Kian (VP Commercial)",
      contractFile: "marina_bay_contract_2026.pdf",
    },
  },
];

const INITIAL_CABS = [
  {
    id: "c1",
    vehicleName: "Mercedes-Benz V-Class Luxury Van",
    type: "Luxury Van",
    capacity: "7 Passengers",
    perKmRate: "$2.50 / km",
    driverDailyRate: "$150 / day",
    driverName: "Alexander Wright",
    driverPhone: "+1 (555) 234-5678",
    status: "Available",
  },
  {
    id: "c2",
    vehicleName: "Toyota Alphard Executive",
    type: "Executive MPV",
    capacity: "6 Passengers",
    perKmRate: "$2.00 / km",
    driverDailyRate: "$120 / day",
    driverName: "Kenji Sato",
    driverPhone: "+81 90 1234 5678",
    status: "Available",
  },
  {
    id: "c3",
    vehicleName: "BMW 7 Series Sedan",
    type: "VIP Sedan",
    capacity: "3 Passengers",
    perKmRate: "$3.20 / km",
    driverDailyRate: "$200 / day",
    driverName: "Michael Schmidt",
    driverPhone: "+49 170 9876543",
    status: "Maintenance",
  },
];

const INITIAL_PACKAGES = [
  {
    id: "p1",
    title: "7-Day Swiss Alps & Scenic Train Tour",
    destination: "Switzerland (Zurich - Lucerne - Zermatt)",
    duration: "7 Days / 6 Nights",
    includedServices: ["4-Star Hotels", "Private Cab Transfers", "Glacier Express Pass"],
    pricePerPerson: "$2,850",
    category: "Honeymoon & Luxury",
    status: "Active",
  },
  {
    id: "p2",
    title: "5-Day Dubai Desert Safari & Luxury Escape",
    destination: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    includedServices: ["5-Star Resort", "VIP Dune Bashing", "Yacht Cruise Dinner"],
    pricePerPerson: "$1,950",
    category: "Adventure & Leisure",
    status: "Active",
  },
];

export function ServiceSetupPage() {
  const [activeTab, setActiveTab] = useState<"hotels" | "cabs" | "packages">("hotels");
  const [searchQuery, setSearchQuery] = useState("");

  // Data State
  const [hotels, setHotels] = useState<HotelVendor[]>(INITIAL_HOTELS);
  const [cabs, setCabs] = useState(INITIAL_CABS);
  const [packages, setPackages] = useState(INITIAL_PACKAGES);

  // Sheet Drawer State (matching LeadsPage)
  const [selectedHotel, setSelectedHotel] = useState<HotelVendor | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "rooms" | "pricing" | "contract">("overview");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Hotel Form State
  const [hotelForm, setHotelForm] = useState({
    name: "",
    city: "",
    rating: "4 Star Superior",
    stars: 4,
    baseRate: "",
    contactPhone: "",
    contactEmail: "",
    amenities: "Free WiFi, Breakfast, Pool",
    roomTypes: "Deluxe Suite, Executive Room",
  });

  // New Cab Form State
  const [cabForm, setCabForm] = useState({
    vehicleName: "",
    type: "Luxury Van",
    capacity: "6 Passengers",
    perKmRate: "",
    driverDailyRate: "",
    driverName: "",
    driverPhone: "",
  });

  // New Package Form State
  const [packageForm, setPackageForm] = useState({
    title: "",
    destination: "",
    duration: "5 Days / 4 Nights",
    pricePerPerson: "",
    category: "Luxury & Honeymoon",
    includedServices: "Hotel, Private Cab, Breakfast",
  });

  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelForm.name.trim()) return;

    const newHotel: HotelVendor = {
      id: `h${Date.now()}`,
      name: hotelForm.name.trim(),
      city: hotelForm.city.trim() || "Dubai, UAE",
      rating: hotelForm.rating,
      stars: hotelForm.stars,
      roomTypes: hotelForm.roomTypes.split(",").map((r) => r.trim()),
      baseRate: hotelForm.baseRate ? `$${hotelForm.baseRate} / night` : "$300 / night",
      amenities: hotelForm.amenities.split(",").map((a) => a.trim()),
      contactPerson: "Hotel Contracting Manager",
      contactPhone: hotelForm.contactPhone || "+1 (800) 999-0000",
      contactEmail: hotelForm.contactEmail || "reservations@hotel.com",
      address: `${hotelForm.city || "Dubai"}, City Center Blvd`,
      status: "Active Vendor",
      rooms: [
        { name: "Deluxe King Room", baseRate: `$${hotelForm.baseRate || '300'} / night`, maxOccupancy: "2 Guests", extraBedRate: "$50", features: ["King Bed", "City View"] }
      ],
      seasonalPricing: [
        { season: "Peak Season", period: "Nov 01 – Jan 31", adjustment: "+30% Surge", rate: `$${(Number(hotelForm.baseRate || 300) * 1.3).toFixed(0)} / night` },
        { season: "Standard Season", period: "Feb 01 – Oct 31", adjustment: "Contract Base Rate", rate: `$${hotelForm.baseRate || 300} / night` },
      ],
      contract: {
        contractId: `CTR-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        b2bCommission: "18% Net Partner Rate",
        paymentTerms: "Net 30 Days Invoiced Billing",
        cancellationPolicy: "Free cancellation up to 48 hours prior to arrival",
        validity: "Jan 01, 2026 – Dec 31, 2026",
        signedBy: "Partner Sales Director",
        contractFile: "vendor_contract_2026.pdf",
      },
    };

    setHotels([newHotel, ...hotels]);
    setIsAddModalOpen(false);
    setHotelForm({
      name: "",
      city: "",
      rating: "4 Star Superior",
      stars: 4,
      baseRate: "",
      contactPhone: "",
      contactEmail: "",
      amenities: "Free WiFi, Breakfast, Pool",
      roomTypes: "Deluxe Suite, Executive Room",
    });
  };

  const handleAddCab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cabForm.vehicleName.trim()) return;

    const newCab = {
      id: `c${Date.now()}`,
      vehicleName: cabForm.vehicleName.trim(),
      type: cabForm.type,
      capacity: cabForm.capacity,
      perKmRate: cabForm.perKmRate ? `$${cabForm.perKmRate} / km` : "$2.00 / km",
      driverDailyRate: cabForm.driverDailyRate ? `$${cabForm.driverDailyRate} / day` : "$120 / day",
      driverName: cabForm.driverName || "Assigned Chauffeur",
      driverPhone: cabForm.driverPhone || "+1 (555) 000-0000",
      status: "Available",
    };

    setCabs([newCab, ...cabs]);
    setIsAddModalOpen(false);
    setCabForm({
      vehicleName: "",
      type: "Luxury Van",
      capacity: "6 Passengers",
      perKmRate: "",
      driverDailyRate: "",
      driverName: "",
      driverPhone: "",
    });
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.title.trim()) return;

    const newPkg = {
      id: `p${Date.now()}`,
      title: packageForm.title.trim(),
      destination: packageForm.destination.trim() || "Worldwide",
      duration: packageForm.duration,
      includedServices: packageForm.includedServices ? packageForm.includedServices.split(",").map((s) => s.trim()) : ["Hotel", "Cab", "Breakfast"],
      pricePerPerson: packageForm.pricePerPerson ? `$${packageForm.pricePerPerson}` : "$1,500",
      category: packageForm.category,
      status: "Active",
    };

    setPackages([newPkg, ...packages]);
    setIsAddModalOpen(false);
    setPackageForm({
      title: "",
      destination: "",
      duration: "5 Days / 4 Nights",
      pricePerPerson: "",
      category: "Luxury & Honeymoon",
      includedServices: "",
    });
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50/50 dark:bg-zinc-950 p-6 lg:p-10 text-zinc-900 dark:text-zinc-100">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Gear className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Service Configuration Setup</h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage partner vendor inventory for Hotels, Transports &amp; Cab Fleets, and Tour Packages.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="size-4" />
          {activeTab === "hotels" && "Add Hotel Vendor"}
          {activeTab === "cabs" && "Add Cab / Transport"}
          {activeTab === "packages" && "Add Tour Package"}
        </Button>
      </div>

      {/* ── Navigation Tabs & Filters ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
        
        {/* Sub Tabs */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("hotels")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "hotels"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            <Buildings className="size-4" />
            Hotel Partners ({hotels.length})
          </button>
          
          <button
            onClick={() => setActiveTab("cabs")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "cabs"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            <Car className="size-4" />
            Transports &amp; Cabs ({cabs.length})
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "packages"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            <Compass className="size-4" />
            Tour Packages ({packages.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="h-9 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-xs text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500 transition-all"
          />
        </div>
      </div>

      {/* ── TAB CONTENT ── */}

      {/* 1. HOTELS TAB */}
      {activeTab === "hotels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels
            .filter((h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => {
                  setSelectedHotel(hotel);
                  setDrawerTab("overview");
                }}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between hover:border-blue-400/80 dark:hover:border-blue-600 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{hotel.rating}</span>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[10px]">
                      {hotel.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-4">
                    <MapPin className="size-3.5 text-zinc-400 shrink-0" />
                    {hotel.city}
                  </p>

                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <CurrencyDollar className="size-3.5 text-zinc-400" /> Base Contract Rate
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{hotel.baseRate}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <Bed className="size-3.5 text-zinc-400" /> Room Categories
                      </span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px] truncate max-w-[140px]">
                        {hotel.roomTypes.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Amenities Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 px-2 py-0.5 text-[10px] font-bold">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-[11px] flex items-center gap-1">
                    View Rates &amp; Contract <ArrowSquareOut className="size-3" />
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHotels((prev) => prev.filter((h) => h.id !== hotel.id));
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-500 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete vendor"
                  >
                    <Trash className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 2. CABS TAB */}
      {activeTab === "cabs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cabs
            .filter((c) => c.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) || c.type.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((cab) => (
              <div
                key={cab.id}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded-lg bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {cab.type}
                    </span>
                    <Badge className={cn("text-[10px]", cab.status === "Available" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                      {cab.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">{cab.vehicleName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-4">
                    <Users className="size-3.5 text-zinc-400 shrink-0" />
                    Capacity: {cab.capacity}
                  </p>

                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Distance Rate</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{cab.perKmRate}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Driver Allowance</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{cab.driverDailyRate}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-xs space-y-1">
                    <span className="text-[11px] font-bold text-zinc-400 block">Assigned Chauffeur</span>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{cab.driverName}</p>
                    <p className="text-zinc-500">{cab.driverPhone}</p>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    onClick={() => setCabs((prev) => prev.filter((c) => c.id !== cab.id))}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-500 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 3. PACKAGES TAB */}
      {activeTab === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {packages
            .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.destination.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded-lg bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                      {pkg.category}
                    </span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px]">
                      {pkg.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">{pkg.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-4">
                    <MapPin className="size-3.5 text-zinc-400 shrink-0" />
                    {pkg.destination} • <Clock className="size-3 text-zinc-400 ml-1" /> {pkg.duration}
                  </p>

                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Base Price (Per Person)</span>
                      <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{pkg.pricePerPerson}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 block">Included Services</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.includedServices.map((srv) => (
                        <span key={srv} className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    onClick={() => setPackages((prev) => prev.filter((p) => p.id !== pkg.id))}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-500 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ── HOTEL DETAILS SHEET DRAWER (Matching LeadsPage Sheet) ── */}
      <Sheet open={!!selectedHotel} onOpenChange={(open) => !open && setSelectedHotel(null)}>
        {selectedHotel && (
          <SheetContent className="w-full sm:max-w-2xl p-0 overflow-hidden shadow-2xl flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
            
            {/* Drawer Header Banner */}
            <div className="p-6 border-b border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-900 text-white relative">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span>{selectedHotel.rating}</span>
              </div>
              <SheetTitle className="text-xl font-extrabold tracking-tight text-white mb-1">
                {selectedHotel.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-blue-200 flex items-center gap-1">
                <MapPin className="size-3.5 text-blue-300" /> {selectedHotel.address || selectedHotel.city}
              </SheetDescription>
            </div>

            {/* Drawer Sub Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 overflow-x-auto sleek-scroll">
              <button
                onClick={() => setDrawerTab("overview")}
                className={cn(
                  "px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 select-none",
                  drawerTab === "overview"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
                )}
              >
                Overview &amp; Contacts
              </button>

              <button
                onClick={() => setDrawerTab("rooms")}
                className={cn(
                  "px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 select-none",
                  drawerTab === "rooms"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
                )}
              >
                Room Categories ({selectedHotel.rooms?.length || 0})
              </button>

              <button
                onClick={() => setDrawerTab("pricing")}
                className={cn(
                  "px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 select-none",
                  drawerTab === "pricing"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
                )}
              >
                Seasonal Pricing Matrix
              </button>

              <button
                onClick={() => setDrawerTab("contract")}
                className={cn(
                  "px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 select-none",
                  drawerTab === "contract"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
                )}
              >
                Vendor Contract Terms
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 sleek-scroll text-xs">
              
              {/* 1. OVERVIEW TAB */}
              {drawerTab === "overview" && (
                <div className="space-y-6">
                  {/* Primary Contact Person */}
                  <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
                    <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                      Primary Contracting Officer
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-extrabold text-sm text-zinc-900 dark:text-white">
                          {selectedHotel.contactPerson}
                        </p>
                        <p className="text-zinc-500 text-[11px]">{selectedHotel.name} Contracting Dept.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${selectedHotel.contactPhone}`}
                          className="h-8 px-3 rounded-xl bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-blue-700 transition-colors"
                        >
                          <Phone className="size-3.5" /> Call Direct
                        </a>
                        <a
                          href={`mailto:${selectedHotel.contactEmail}`}
                          className="h-8 px-3 rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-[11px] flex items-center gap-1.5"
                        >
                          <Envelope className="size-3.5" /> Email
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Address & Base Rate */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-zinc-400 font-bold text-[10px] uppercase">Base Contract Rate</span>
                      <p className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                        {selectedHotel.baseRate}
                      </p>
                      <p className="text-zinc-400 text-[11px]">Subject to season surge</p>
                    </div>

                    <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-zinc-400 font-bold text-[10px] uppercase">B2B Margin Share</span>
                      <p className="font-extrabold text-lg text-blue-600 dark:text-blue-400">
                        {selectedHotel.contract?.b2bCommission || "18% Margin"}
                      </p>
                      <p className="text-zinc-400 text-[11px]">Net Partner Invoiced</p>
                    </div>
                  </div>

                  {/* Amenities List */}
                  <div className="space-y-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Hotel Amenities &amp; Inclusions</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-xl bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 px-3 py-1 text-xs font-semibold"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ROOM CATEGORIES TAB */}
              {drawerTab === "rooms" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-zinc-900 dark:text-white">Partner Room Inventory</h3>
                    <span className="text-zinc-400 text-[11px]">{selectedHotel.rooms?.length || 0} categories contracted</span>
                  </div>

                  <div className="space-y-3">
                    {selectedHotel.rooms?.map((room) => (
                      <div
                        key={room.name}
                        className="p-4 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{room.name}</h4>
                            <p className="text-[11px] text-zinc-500">Max Capacity: {room.maxOccupancy}</p>
                          </div>
                          <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{room.baseRate}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {room.features?.map((ft) => (
                            <span key={ft} className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-300">
                              {ft}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. SEASONAL PRICING MATRIX TAB */}
              {drawerTab === "pricing" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white">Seasonal Surge &amp; Discount Matrix</h3>
                      <p className="text-[11px] text-zinc-400">Contracted price adjustments based on travel dates.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedHotel.seasonalPricing?.map((season) => (
                      <div
                        key={season.season}
                        className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-zinc-900 dark:text-white">{season.season}</span>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                              season.adjustment.includes("+") ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                            )}
                          >
                            {season.adjustment}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5 text-zinc-400" /> {season.period}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">{season.rate}</span>
                        </div>

                        {season.notes && (
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-2 rounded-lg font-medium">
                            Note: {season.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. VENDOR CONTRACT TERMS TAB */}
              {drawerTab === "contract" && selectedHotel.contract && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-blue-600" /> Active B2B Partner Contract
                      </span>
                      <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300">
                        {selectedHotel.contract.contractId}
                      </span>
                    </div>

                    <p className="text-[11px] text-blue-800 dark:text-blue-300">
                      Validity Period: <strong>{selectedHotel.contract.validity}</strong>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                      <span className="text-zinc-500">B2B Commission Share</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{selectedHotel.contract.b2bCommission}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                      <span className="text-zinc-500">Payment &amp; Billing Terms</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{selectedHotel.contract.paymentTerms}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                      <span className="text-zinc-500">Cancellation Terms</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{selectedHotel.contract.cancellationPolicy}</span>
                    </div>
                  </div>

                  {/* PDF Download Box */}
                  <div className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                        <FilePdf className="size-6" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white text-xs">{selectedHotel.contract.contractFile}</p>
                        <p className="text-[10px] text-zinc-400">Digitally signed by {selectedHotel.contract.signedBy}</p>
                      </div>
                    </div>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${selectedHotel.contract.contractFile}...`);
                      }}
                      className="h-8 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold flex items-center gap-1.5"
                    >
                      <DownloadSimple className="size-3.5" /> Download
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer matching LeadsPage */}
            <div className="shrink-0 p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedHotel(null)}
                className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* ── CREATE SERVICE MODAL ── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
              {activeTab === "hotels" && "Add Hotel Partner Vendor"}
              {activeTab === "cabs" && "Add Transport & Cab Fleet"}
              {activeTab === "packages" && "Add Tour Package"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Enter inventory details to make this service available in CRM itineraries.
            </DialogDescription>
          </DialogHeader>

          {/* 1. HOTEL FORM */}
          {activeTab === "hotels" && (
            <form onSubmit={handleAddHotel} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Hotel Name</label>
                <input
                  required
                  type="text"
                  placeholder="E.g. Atlantis The Royal"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">City / Location</label>
                  <input
                    required
                    type="text"
                    placeholder="E.g. Dubai"
                    value={hotelForm.city}
                    onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Star Rating</label>
                  <select
                    value={hotelForm.rating}
                    onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    <option value="5 Star Luxury">5 Star Luxury</option>
                    <option value="4 Star Superior">4 Star Superior</option>
                    <option value="3 Star Comfort">3 Star Comfort</option>
                    <option value="Boutique Resort">Boutique Resort</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Base Rate ($/night)</label>
                  <input
                    type="number"
                    placeholder="350"
                    value={hotelForm.baseRate}
                    onChange={(e) => setHotelForm({ ...hotelForm, baseRate: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+971 4 000 0000"
                    value={hotelForm.contactPhone}
                    onChange={(e) => setHotelForm({ ...hotelForm, contactPhone: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold dark:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          )}

          {/* 2. CAB FORM */}
          {activeTab === "cabs" && (
            <form onSubmit={handleAddCab} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Vehicle Model / Name</label>
                <input
                  required
                  type="text"
                  placeholder="E.g. Mercedes-Benz Sprinter"
                  value={cabForm.vehicleName}
                  onChange={(e) => setCabForm({ ...cabForm, vehicleName: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Vehicle Type</label>
                  <select
                    value={cabForm.type}
                    onChange={(e) => setCabForm({ ...cabForm, type: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    <option value="Luxury Van">Luxury Van</option>
                    <option value="Executive MPV">Executive MPV</option>
                    <option value="VIP Sedan">VIP Sedan</option>
                    <option value="Luxury SUV">Luxury SUV</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Seating Capacity</label>
                  <input
                    type="text"
                    placeholder="7 Passengers"
                    value={cabForm.capacity}
                    onChange={(e) => setCabForm({ ...cabForm, capacity: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Per KM Rate ($)</label>
                  <input
                    type="text"
                    placeholder="2.50"
                    value={cabForm.perKmRate}
                    onChange={(e) => setCabForm({ ...cabForm, perKmRate: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Driver Daily Rate ($)</label>
                  <input
                    type="text"
                    placeholder="150"
                    value={cabForm.driverDailyRate}
                    onChange={(e) => setCabForm({ ...cabForm, driverDailyRate: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold dark:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          )}

          {/* 3. PACKAGE FORM */}
          {activeTab === "packages" && (
            <form onSubmit={handleAddPackage} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Package Title</label>
                <input
                  required
                  type="text"
                  placeholder="E.g. 7-Day Swiss Alps Tour"
                  value={packageForm.title}
                  onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="E.g. Switzerland"
                    value={packageForm.destination}
                    onChange={(e) => setPackageForm({ ...packageForm, destination: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Price Per Person ($)</label>
                  <input
                    type="text"
                    placeholder="2850"
                    value={packageForm.pricePerPerson}
                    onChange={(e) => setPackageForm({ ...packageForm, pricePerPerson: e.target.value })}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold dark:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
}
