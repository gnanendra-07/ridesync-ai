"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Map,
  Compass,
  Bike,
  Cloud,
  LogOut,
  Menu,
  X,
  Calendar,
  ChevronRight,
  Droplets,
  Sparkles,
  AlertTriangle,
  Briefcase,
  Plus,
  Trash2,
  Phone,
  FileDown,
  Sun,
  Zap,
  Bell,
  Search,
  Settings,
  Wind,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import type L from "leaflet";

/* ─── Predefined Landmark Coordinates for Route Mapping ─── */


/* ─── Predefined Ride Images for Journal ─── */
const SCENIC_IMAGES = [
  "/hero_day.png",
  "/hero_night.png",
  "/hero_rider_standing.png",
  "/hero_rider_ghat.png",
];

/* ─── Interfaces ─────────────────────────────────────────── */
interface Message {
  sender: "user" | "ai";
  text: string;
}

interface Motorcycle {
  id: string;
  name: string;
  edition: string;
  engine: string;
  power: string;
  weight: string;
  luggage: string;
  type: string;
  image: string;
  tank: string;
  features: string[];
  brand: string;
  model: string;
  year: string;
  engineCc: string;
  regNumber: string;
}

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  distance: string;
  leanAngle: string;
  elevation: string;
  notes: string;
  image?: string;
  motorcycle: string;
}

interface SavedRoute {
  id: string;
  start: string;
  end: string;
  option: "Scenic" | "Fastest" | "Highway";
  distance: string;
  duration: string;
  roadType: string;
  elevation: string;
  fuelCost: number;
  date: string;
}

interface PackingItem {
  id: string;
  name: string;
  category: "gear" | "tools" | "docs" | "personal";
  packed: boolean;
}

interface OpenWeatherForecast {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    wind: {
      speed: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
}

/* ─── Constants & Reference Data ──────────────────────────── */
const MOTORCYCLES: Motorcycle[] = [
  {
    id: "bmw_gs",
    name: "BMW R1250 GS",
    edition: "Trophy Edition",
    engine: "1254cc Flat-Twin Boxer",
    power: "136 HP",
    weight: "249 kg",
    luggage: "45 Liters (Aluminum Cases)",
    type: "Adventure Touring",
    image: "/bikes/bmw_gs.png",
    tank: "20 Liters (Regular)",
    features: ["Dynamic ESA suspension", "Pro Riding Modes", "ShiftCam Boxer Tech"],
    brand: "BMW",
    model: "R1250 GS",
    year: "2024",
    engineCc: "1254",
    regNumber: "MH-12-RS-1250",
  },
  {
    id: "ktm_duke",
    name: "KTM Duke 390",
    edition: "Naked Beast",
    engine: "399cc Liquid-Cooled Single",
    power: "45 HP",
    weight: "165 kg",
    luggage: "15 Liters (Tail Bag)",
    type: "Naked Sport",
    image: "/bikes/ktm_duke.png",
    tank: "15 Liters (High Octane)",
    features: ["WP APEX Suspension", "Supermoto ABS Mode", "Quickshifter+"],
    brand: "KTM",
    model: "Duke 390",
    year: "2023",
    engineCc: "399",
    regNumber: "DL-03-KT-390",
  },
  {
    id: "re_himalayan",
    name: "Royal Enfield Himalayan",
    edition: "Sherpa 450",
    engine: "452cc Liquid Sherpa",
    power: "40 HP",
    weight: "196 kg",
    luggage: "35 Liters (Steel Panniers)",
    type: "Adventure Dual",
    image: "/bikes/re_himalayan.png",
    tank: "17 Liters (Regular)",
    features: ["Tripper Navigation", "Switchable Rear ABS", "Showa Long-Travel Forks"],
    brand: "Royal Enfield",
    model: "Himalayan 450",
    year: "2024",
    engineCc: "452",
    regNumber: "KA-51-RE-450",
  },
  {
    id: "apache_rr310",
    name: "Apache RR310",
    edition: "Race Tuned",
    engine: "312cc Liquid Single",
    power: "34 HP",
    weight: "174 kg",
    luggage: "12 Liters (Tail Pack)",
    type: "Super Sport",
    image: "/bikes/apache_rr310.png",
    tank: "11 Liters (High Octane)",
    features: ["Slipper Clutch", "Bi-LED Projectors", "SmartXonnect Telemetry"],
    brand: "TVS",
    model: "Apache RR310",
    year: "2022",
    engineCc: "312",
    regNumber: "TN-07-AP-310",
  },
  {
    id: "honda_cb350",
    name: "Honda CB350",
    edition: "H'ness Deluxe",
    engine: "348cc Air Roadster",
    power: "21 HP",
    weight: "181 kg",
    luggage: "20 Liters (Canvas Bags)",
    type: "Classic Roadster",
    image: "/bikes/honda_cb350.png",
    tank: "15 Liters (Regular)",
    features: ["Torque Control (HSTC)", "Assist Slipper Clutch", "Retro Chrome Style"],
    brand: "Honda",
    model: "CB350",
    year: "2023",
    engineCc: "348",
    regNumber: "HR-26-CB-350",
  },
];

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "log-1",
    title: "Kunzum Pass Ascent",
    date: "2026-05-18",
    distance: "185",
    leanAngle: "46",
    elevation: "4590",
    notes: "Ascending Kunzum Pass was intense. The gravel section was slippery but the motorcycle handled the mud beautifully. Encountered mild engine heat on steep climbs, but kept throttle steady. Camped near Chandratal stream.",
    image: "/hero_rider_standing.png",
    motorcycle: "BMW R1250 GS",
  },
  {
    id: "log-2",
    title: "Spiti Valley Sunset Run",
    date: "2026-06-02",
    distance: "240",
    leanAngle: "42",
    elevation: "3800",
    notes: "Rode along the Spiti river beds. Sunlight hitting the red rocks was stunning. Kept speed under 60km/h due to hidden gravel patches. Clear skies, temperature dropping rapidly after 6 PM.",
    image: "/hero_day.png",
    motorcycle: "BMW R1250 GS",
  },
  {
    id: "log-3",
    title: "Manali Ghat Curve Run",
    date: "2026-07-10",
    distance: "120",
    leanAngle: "48",
    elevation: "2050",
    notes: "Attacked the hairpins on the Manali ghat highway. Excellent cornering grip. Rear suspension felt solid in sporty settings. Logged maximum lean angle on turn 14.",
    image: "/hero_rider_ghat.png",
    motorcycle: "KTM Duke 390",
  },
];

const WEATHER_HOURLY = [
  { time: "05:00", temp: "11°C", rain: "2%", wind: "8 km/h", condition: "Clear", icon: "☀️" },
  { time: "08:00", temp: "14°C", rain: "5%", wind: "11 km/h", condition: "Sunny", icon: "☀️" },
  { time: "11:00", temp: "19°C", rain: "8%", wind: "16 km/h", condition: "Clear", icon: "☀️" },
  { time: "14:00", temp: "22°C", rain: "12%", wind: "20 km/h", condition: "Mild Clouds", icon: "⛅" },
  { time: "17:00", temp: "18°C", rain: "25%", wind: "15 km/h", condition: "Light Shower", icon: "🌦️" },
  { time: "20:00", temp: "13°C", rain: "10%", wind: "10 km/h", condition: "Clear Night", icon: "🌙" },
];

const weatherCondition = {
  temp: "18°C",
  sky: "Partly Cloudy",
  wind: "16 km/h NNE",
  rainChance: "15%",
  feelsLike: "16°C",
  visibility: "12 km",
};

interface RouteData {
  distance: string;
  duration: string;
  roadType: string;
  elevation: string;
  coordinates: [number, number][];
}

const getItineraryTitle = (dest: string, style: string, terrain: string): string => {
  const lower = dest.toLowerCase();
  if (lower.includes("goa")) {
    return `${dest} Coastal Ride`;
  }
  if (lower.includes("ladakh")) {
    return `${dest} Himalayan Expedition`;
  }
  if (lower.includes("kadapa")) {
    return `${dest} Adventure Expedition`;
  }
  if (lower.includes("spiti")) {
    return `${dest} Valley Expedition`;
  }
  
  // Generic title fallback
  if (terrain.toLowerCase().includes("coastal")) {
    return `${dest} Coastal Ride`;
  }
  if (terrain.toLowerCase().includes("mountain")) {
    return `${dest} Mountain Expedition`;
  }
  if (style.toLowerCase().includes("adventure")) {
    return `${dest} Adventure Expedition`;
  }
  return `${dest} ${style} Expedition`;
};

const getSpitiItinerary = (activeBike: Motorcycle, plannerDuration: string): string[] => {
  const durationDays = parseInt(plannerDuration) || 5;
  const isAdventureBike = activeBike.id === "bmw_gs" || activeBike.id === "re_himalayan";
  
  const activities = [
    `Basecamp Departure (Altitude climb from 2,050m to 3,100m). Recommended tyre pressures: 22 PSI Front, 30 PSI Rear.`,
    `High Pass Crossing (Kunzum Pass Summit - 4,590m). Check traction control settings. Your ${activeBike.name} is best in ${isAdventureBike ? "Off-Road Mode" : "Standard Sport Mode"}.`,
    `River crossings & gravel beds. Keep suspension pre-load at ${activeBike.id === "bmw_gs" ? "Level 3 ESA Dynamic" : "Medium-High Stiffness"} to handle cargo weight.`,
    `Route highlights: Spiti valley circuit hairpin climbs. Recommended fuel stop: Kaza central depot (your range is fully sufficient).`,
    `Dhankar Monastery Run. Steep rocky climbs at high elevation. Monitor engine temperature.`,
    `Ride to Hikkim (4,400m) to visit the world's highest post office. Check tyre traction on loose gravel.`,
    `Pin Valley National Park exploration. Navigate through rocky gorge trails and water crossings.`,
    `Tabo Caves trek and scenic cruise along low-lying Spiti river beds. Keep speed moderate.`,
    `Kaza to Losar scenic pass ride. Fast-paced gravel sections. Ensure air filter is clear of dust.`,
    `Return loop base run. Full diagnostics clear. Pack wet layers by 3 PM due to mountain pass cloud layers.`
  ];

  const resultDays: string[] = [];
  for (let i = 0; i < durationDays - 1; i++) {
    resultDays.push(activities[i % 9]);
  }
  resultDays.push(activities[9]); // Last day is always the return loop
  
  return resultDays;
};

const getGoaItinerary = (activeBike: Motorcycle, plannerDuration: string): string[] => {
  const durationDays = parseInt(plannerDuration) || 5;
  const isAdventureBike = activeBike.id === "bmw_gs" || activeBike.id === "re_himalayan";
  
  const activities = [
    `North Goa Coastal Cruise. Ride along Vagator and Anjuna beach roads. Check tyre pressures (recommend 26 PSI Front, 32 PSI Rear for sandy coastal paths).`,
    `Fort Aguada and Chapora loop. Navigate sweeping tarmac curves with ocean views. Your ${activeBike.name} is suited for ${isAdventureBike ? "Touring Mode" : "Standard Sport Mode"}.`,
    `Ferry crossing to Divar Island. Explore narrow coconut-fringed lanes and old Portuguese-style villas.`,
    `Spice Plantation Run in Ponda. Sweep through lush green plantation curves and enjoy local coastal cuisine.`,
    `Dudhsagar Waterfall Trail. Off-road section through jungle trails. Set suspension to ${activeBike.id === "bmw_gs" ? "Level 2 ESA Dynamic" : "High Clearance"}.`,
    `South Goa Beach Hopping. Ride to Palolem and Agonda beaches on smooth coastal highway runs.`,
    `Bhagwan Mahavir Wildlife Sanctuary. Dense forest canopy run with stream crossings. Watch out for wet patches.`,
    `Old Goa Heritage Ride. Visit historical churches and the Latin quarters of Fontainhas at a relaxed pace.`,
    `Cabo de Rama Fort cliff ride. Catch the sunset over the Arabian Sea. Rocky approach road requires standing on footpegs.`,
    `Final coastal loop return to base camp. Inspect tyre tread wear and perform standard chain lubrication.`
  ];

  const resultDays: string[] = [];
  for (let i = 0; i < durationDays - 1; i++) {
    resultDays.push(activities[i % 9]);
  }
  resultDays.push(activities[9]);
  
  return resultDays;
};

const getLadakhItinerary = (activeBike: Motorcycle, plannerDuration: string): string[] => {
  const durationDays = parseInt(plannerDuration) || 5;
  const isAdventureBike = activeBike.id === "bmw_gs" || activeBike.id === "re_himalayan";
  
  const activities = [
    `Leh Acclimatization. Gentle local cruise around Shanti Stupa and Leh Palace (Altitude: 3,500m). Recommended tyre pressures: 22 PSI Front, 30 PSI Rear.`,
    `Magnetic Hill & Sangam Confluence run. Test high-altitude throttle response along the Indus river.`,
    `Khardung La Pass Summit. Climb to 5,359m. Your ${activeBike.name} performs best in ${isAdventureBike ? "Off-Road/Enduro Mode" : "Standard Mode"}. Watch for thin ice patches.`,
    `Nubra Valley Dunes. Ride to Hunder sand dunes. Explore the rocky river valley beds.`,
    `Shyok River Route. Challenging gravel run from Nubra to Pangong Tso. Check suspension settings.`,
    `Pangong Tso Lakeshore ride. Cruise along the pristine blue high-altitude lake (4,250m). Clear mountain skies.`,
    `Chang La Pass Crossing. Navigate steep hairpin bends and water crossings back to Leh.`,
    `Tso Moriri Lake route. Long highway cruise through remote landscapes. Monitor your ${activeBike.name}'s fuel levels closely.`,
    `Tanglang La Ascent. Climb the winding mountain passes. Keep throttle steady on steep climbs.`,
    `Return loop to Leh base. Full bike health check. Diagnostic scan shows optimal performance.`
  ];

  const resultDays: string[] = [];
  for (let i = 0; i < durationDays - 1; i++) {
    resultDays.push(activities[i % 9]);
  }
  resultDays.push(activities[9]);
  
  return resultDays;
};

const getKadapaItinerary = (activeBike: Motorcycle, plannerDuration: string): string[] => {
  const durationDays = parseInt(plannerDuration) || 5;
  
  const activities = [
    `Penna River Basin. Winding state highway ride to the river basin. Recommended tyre pressures: 24 PSI Front, 32 PSI Rear.`,
    `Gandikota Gorge Run. Explore the grand canyon of India. Rocky gravel trails near the gorge edge.`,
    `Belum Caves Trail. Long cruise through open rural highways. Smooth tarmac riding.`,
    `Lankamalla Forest Reserve. Ride through winding curves under dense tree canopies. Keep speed steady.`,
    `Red Sanders Hills. Moderate off-road climb through forest reserve paths. Set suspension to ${activeBike.id === "bmw_gs" ? "Level 2 ESA Dynamic" : "Stiff Mode"}.`,
    `Vontimitta historic architecture cruise. Scenic evening ride along the lakeside temples.`,
    `Nallamala Ghat section curves. Attack tight twisties and hairpins. Test your ${activeBike.name}'s lean angles.`,
    `Gandikota Fort Camping loop. Return to the fort ruins for an overnight camp setup.`,
    `Bugga Buggavanka rocky stream crossings. Ride through minor water beds and gravel paths.`,
    `Return loop to base. Complete clean-down of the motorcycle. Scan engine diagnostics.`
  ];

  const resultDays: string[] = [];
  for (let i = 0; i < durationDays - 1; i++) {
    resultDays.push(activities[i % 9]);
  }
  resultDays.push(activities[9]);
  
  return resultDays;
};

const getGenericItinerary = (dest: string, activeBike: Motorcycle, plannerDuration: string, plannerTerrain: string, plannerStyle: string): string[] => {
  const durationDays = parseInt(plannerDuration) || 5;
  const isAdventureBike = activeBike.id === "bmw_gs" || activeBike.id === "re_himalayan";
  
  const terrainLower = plannerTerrain.toLowerCase();
  
  let day1Pressures = "24 PSI Front, 32 PSI Rear";
  let modeRecommendation = isAdventureBike ? "Off-Road Mode" : "Standard Sport Mode";
  let suspensionRecommendation = activeBike.id === "bmw_gs" ? "Level 2 ESA Dynamic" : "Medium-High Stiffness";
  
  if (terrainLower.includes("mountain") || terrainLower.includes("gravel")) {
    day1Pressures = "22 PSI Front, 30 PSI Rear";
    modeRecommendation = isAdventureBike ? "Off-Road Mode" : "Rain / Slippery Mode";
    suspensionRecommendation = activeBike.id === "bmw_gs" ? "Level 3 ESA Dynamic" : "Stiff Off-Road Setup";
  } else if (terrainLower.includes("coastal")) {
    day1Pressures = "26 PSI Front, 34 PSI Rear";
    modeRecommendation = "Touring / Standard Mode";
    suspensionRecommendation = activeBike.id === "bmw_gs" ? "Level 1 ESA Comfort" : "Comfort / Medium Stiffness";
  } else if (terrainLower.includes("desert")) {
    day1Pressures = "20 PSI Front, 28 PSI Rear (lowered for sand traction)";
    modeRecommendation = isAdventureBike ? "Enduro / Sand Mode" : "Rain / Soft Mode";
    suspensionRecommendation = activeBike.id === "bmw_gs" ? "Level 3 ESA Dynamic" : "Stiff Preload";
  } else if (terrainLower.includes("highway")) {
    day1Pressures = "28 PSI Front, 36 PSI Rear";
    modeRecommendation = "Cruise / Highway Mode";
    suspensionRecommendation = activeBike.id === "bmw_gs" ? "Level 1 ESA Comfort" : "Soft / Comfortable Preload";
  }
  
  const activities = [
    `${dest} Basecamp Departure. Initial shakedown ride around the region. Set tyre pressures to ${day1Pressures}.`,
    `Scenic Highway Sweep. Enjoy winding curves and check throttle response. Your ${activeBike.name} is running in ${modeRecommendation}.`,
    `Terrain Challenge. Navigating the unique ${plannerTerrain} segments. Put your skills to the test.`,
    `Mid-point Cruise. Ride to scenic view points. Recommended fuel and oil levels check on your ${activeBike.name}.`,
    `Technical Riding Section. Navigating curves and elevation changes. Set suspension to ${suspensionRecommendation}.`,
    `Off-the-beaten-path exploration. Explore rural trails and gravel paths outside of ${dest}.`,
    `Group Ride stage. Experience the ${plannerStyle} style of pace and flow.`,
    `Panoramic Ridge Run. Ride along high elevation trails overlooking the valley.`,
    `Exploration loop. Exploring local hidden trails. Ensure chain is lubricated and air filters are checked.`,
    `Return loop to base camp. Final pack up and gear checklist completion. Scan engine diagnostics for ${activeBike.name}.`
  ];

  const resultDays: string[] = [];
  for (let i = 0; i < durationDays - 1; i++) {
    resultDays.push(activities[i % 9]);
  }
  resultDays.push(activities[9]);
  
  return resultDays;
};

const getRouteDetails = (
  start: string,
  end: string,
  option: "Scenic" | "Fastest" | "Highway",
  bike: Motorcycle
): RouteData => {
  const isManali = start.toLowerCase().includes("manali") || start.toLowerCase().includes("base");
  const isKaza = end.toLowerCase().includes("kaza");
  const bikeTag = bike.brand || "Expedition";

  const baseCoords: Record<"Scenic" | "Fastest" | "Highway", [number, number][]> = {
    Scenic: [
      [32.2396, 77.1887], // Manali
      [32.3716, 77.2452], // Rohtang
      [32.4019, 77.6369], // Kunzum
      [32.2276, 78.0706], // Kaza
    ],
    Fastest: [
      [32.2396, 77.1887], // Manali
      [32.4770, 77.1250], // Sissu
      [32.3501, 77.5802], // bypass
      [32.2276, 78.0706], // Kaza
    ],
    Highway: [
      [32.2396, 77.1887],
      [32.1800, 77.3000],
      [32.1200, 77.7000],
      [32.2276, 78.0706],
    ],
  };

  const resolveCoord = (name: string, fallbackLat: number, fallbackLng: number): [number, number] => {
    const n = name.toLowerCase();
    if (n.includes("manali")) return [32.2396, 77.1887];
    if (n.includes("kaza")) return [32.2276, 78.0706];
    if (n.includes("rohtang")) return [32.3716, 77.2452];
    if (n.includes("kunzum")) return [32.4019, 77.6369];
    if (n.includes("sissu")) return [32.4770, 77.1250];
    if (n.includes("keylong")) return [32.5711, 77.0266];
    if (n.includes("chandratal")) return [32.4820, 77.6160];
    return [fallbackLat, fallbackLng];
  };

  const startCoord = resolveCoord(start, 32.2396, 77.1887);
  const endCoord = resolveCoord(end, 32.2276, 78.0706);

  let distance = "";
  let duration = "";
  let roadType = "";
  let elevation = "";
  let coords: [number, number][] = [];

  if (option === "Scenic") {
    distance = "482 km";
    duration = "9h 45m";
    roadType = `Passes (Adventure Ready for ${bikeTag})`;
    elevation = "4,590 m";
    coords = isManali && isKaza
      ? baseCoords.Scenic
      : [startCoord, [(startCoord[0] + endCoord[0]) / 2 + 0.05, (startCoord[1] + endCoord[1]) / 2 + 0.08], endCoord];
  } else if (option === "Fastest") {
    distance = "410 km";
    duration = "6h 30m";
    roadType = `Expressway (Bypass for ${bikeTag})`;
    elevation = "3,120 m";
    coords = isManali && isKaza
      ? baseCoords.Fastest
      : [startCoord, [(startCoord[0] + endCoord[0]) / 2 + 0.03, (startCoord[1] + endCoord[1]) / 2 + 0.02], endCoord];
  } else {
    distance = "430 km";
    duration = "7h 15m";
    roadType = `Double-lane Highway (Cruising for ${bikeTag})`;
    elevation = "3,480 m";
    coords = isManali && isKaza
      ? baseCoords.Highway
      : [startCoord, [(startCoord[0] + endCoord[0]) / 2 - 0.02, (startCoord[1] + endCoord[1]) / 2 - 0.04], endCoord];
  }

  return {
    distance,
    duration,
    roadType,
    elevation,
    coordinates: coords,
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  // User Profile
  const [displayName, setDisplayName] = useState("Adventure Pilot");
  const [username, setUsername] = useState("Explorer");
  const [userInitials, setUserInitials] = useState("AP");

  // Headlight theme (ON = Night/Dark Mode, OFF = Day/Light Mode)
  const [headlightOn, setHeadlightOn] = useState<boolean>(true);

  // Selected Motorcycle
  const [activeBike, setActiveBike] = useState<Motorcycle>(MOTORCYCLES[0]);
  const [motorcyclesList, setMotorcyclesList] = useState<Motorcycle[]>(MOTORCYCLES);

  // CRUD actions state
  const [showAddBike, setShowAddBike] = useState(false);
  const [showEditBike, setShowEditBike] = useState<Motorcycle | null>(null);

  // Form states
  const [formBrand, setFormBrand] = useState("");
  const [formModel, setFormModel] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formEngineCc, setFormEngineCc] = useState("");
  const [formRegNumber, setFormRegNumber] = useState("");
  const [formImage, setFormImage] = useState("/bikes/bmw_gs.png");

  // Reset form helper
  const resetForm = () => {
    setFormBrand("");
    setFormModel("");
    setFormYear("");
    setFormEngineCc("");
    setFormRegNumber("");
    setFormImage("/bikes/bmw_gs.png");
  };

  // AI Assistant Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);

  // OpenWeather API Config
  const [openWeatherApiKey, setOpenWeatherApiKey] = useState("");
  const [weatherForecast, setWeatherForecast] = useState<OpenWeatherForecast | null>(null);
  const [weatherCity, setWeatherCity] = useState("Manali");

  // AI Trip Planner inputs & generated plan
  const [plannerDestination, setPlannerDestination] = useState("Spiti Valley Circuit");
  const [plannerDuration, setPlannerDuration] = useState("5 Days");
  const [plannerTerrain, setPlannerTerrain] = useState("Mountain Passes & Gravel");
  const [plannerStyle, setPlannerStyle] = useState("Adventure Tour");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<string | null>(null);

  // Route Planner States
  const [routeStart, setRouteStart] = useState("Manali Base Camp");
  const [routeEnd, setRouteEnd] = useState("Kaza Base Camp");
  const [selectedRouteOption, setSelectedRouteOption] = useState<"Scenic" | "Fastest" | "Highway">("Scenic");
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [recentRoutes, setRecentRoutes] = useState<SavedRoute[]>([]);

  // Journal logs state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [showAddJournal, setShowAddJournal] = useState(false);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalDate, setNewJournalDate] = useState("");
  const [newJournalDist, setNewJournalDist] = useState("");
  const [newJournalLean, setNewJournalLean] = useState("");
  const [newJournalElev, setNewJournalElev] = useState("");
  const [newJournalNotes, setNewJournalNotes] = useState("");
  const [newJournalImage, setNewJournalImage] = useState("/hero_rider_standing.png");

  // Journal Search & Filters
  const [journalQuery, setJournalQuery] = useState("");
  const [journalBikeFilter, setJournalBikeFilter] = useState("All");

  // AI Packing Checklist State
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);

  // SOS Emergency States
  const [sosCountdown, setSosCountdown] = useState(3);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const sosIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // GPS Simulation
  const [gpsCoords, setGpsCoords] = useState({
    lat: "32.2396° N",
    lng: "77.1887° E",
    alt: "3,450 m",
  });

  // Leaflet refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const sosMapContainerRef = useRef<HTMLDivElement>(null);
  const sosMapInstanceRef = useRef<L.Map | null>(null);

  // Initial Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFull = localStorage.getItem("fullName") || "Adventure Pilot";
      const storedUser = localStorage.getItem("username") || "Explorer";
      const storedBikeId = localStorage.getItem("activeBike");
      const storedTheme = localStorage.getItem("headlightTheme");
      const storedWeatherKey = localStorage.getItem("openWeatherApiKey") || "";
      const storedMotorcycles = localStorage.getItem("ridesync_motorcycles");
      const storedSavedRoutes = localStorage.getItem("ridesync_saved_routes");
      const storedRecentRoutes = localStorage.getItem("ridesync_recent_routes");

      let fleet = MOTORCYCLES;
      if (storedMotorcycles) {
        try {
          fleet = JSON.parse(storedMotorcycles);
        } catch {
          console.error("Error parsing stored fleet, using defaults");
        }
      }

      let parsedSaved: SavedRoute[] = [];
      if (storedSavedRoutes) {
        try {
          parsedSaved = JSON.parse(storedSavedRoutes);
        } catch {
          console.error("Error parsing stored saved routes");
        }
      }

      let parsedRecent: SavedRoute[] = [];
      if (storedRecentRoutes) {
        try {
          parsedRecent = JSON.parse(storedRecentRoutes);
        } catch {
          console.error("Error parsing stored recent routes");
        }
      }

      const matchedBike = fleet.find((b) => b.id === storedBikeId) || fleet[0];

      const initials = storedFull
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const timeout = setTimeout(() => {
        setDisplayName(storedFull);
        setUsername(storedUser);
        setUserInitials(initials || "AP");
        setMotorcyclesList(fleet);
        setActiveBike(matchedBike);
        setOpenWeatherApiKey(storedWeatherKey);
        setSavedRoutes(parsedSaved);
        setRecentRoutes(parsedRecent);

        if (storedTheme !== null) {
          setHeadlightOn(storedTheme === "night");
        } else {
          setHeadlightOn(true);
        }
        setMessages([
          {
            sender: "ai",
            text: `Welcome back, ${storedFull}! Your ${matchedBike.name} is connected. I've pre-analyzed the curvy mountain paths for your current location. Let's plan your adventure!`,
          },
        ]);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Update packing checklist when motorcycle updates
  useEffect(() => {
    const baseItems: PackingItem[] = [
      { id: "p1", name: "Premium Adventure Helmet", category: "gear", packed: false },
      { id: "p2", name: "Gore-Tex Riding Jacket & Pants", category: "gear", packed: false },
      { id: "p3", name: "Thermal Protective Gloves", category: "gear", packed: false },
      { id: "p4", name: "Riding Boots (Waterproof)", category: "gear", packed: false },
      { id: "p5", name: "Driving License & Vehicle RC Copy", category: "docs", packed: false },
      { id: "p6", name: "Medical Insurance Card", category: "docs", packed: false },
      { id: "p7", name: "Compact First-Aid / Trauma Kit", category: "personal", packed: false },
      { id: "p8", name: "Insulated Water Hydration Pack", category: "personal", packed: false },
    ];

    let bikeItems: PackingItem[] = [];
    if (activeBike.id === "bmw_gs") {
      bikeItems = [
        { id: "pb1", name: "Boxer-cylinder protectors & valve tools", category: "tools", packed: false },
        { id: "pb2", name: "Heavy Aluminum Side Pannier dry bags (45L)", category: "gear", packed: false },
        { id: "pb3", name: "Tire repair kit & portable electric pump", category: "tools", packed: false },
      ];
    } else if (activeBike.id === "ktm_duke") {
      bikeItems = [
        { id: "pb1", name: "Compact naked frame engine guard spacers", category: "tools", packed: false },
        { id: "pb2", name: "Aerodynamic 15L water-resistant Tail bag", category: "gear", packed: false },
        { id: "pb3", name: "Essential tube-repair sealants & CO2 canisters", category: "tools", packed: false },
      ];
    } else if (activeBike.id === "re_himalayan") {
      bikeItems = [
        { id: "pb1", name: "Spare accelerator & clutch cable loops", category: "tools", packed: false },
        { id: "pb2", name: "Steel pannier organizer boxes (35L)", category: "gear", packed: false },
        { id: "pb3", name: "Heavy spark plug wrench & chain link spare", category: "tools", packed: false },
      ];
    } else if (activeBike.id === "apache_rr310") {
      bikeItems = [
        { id: "pb1", name: "Visor anti-fog spray & microfibre buff", category: "personal", packed: false },
        { id: "pb2", name: "Ultra-compact 12L lightweight racing tail pack", category: "gear", packed: false },
        { id: "pb3", name: "Pocket tire pressure gauge & quick-seal kit", category: "tools", packed: false },
      ];
    } else {
      bikeItems = [
        { id: "pb1", name: "Chrome polishing wax & cleaning cloth", category: "personal", packed: false },
        { id: "pb2", name: "Retro canvas saddlebags canvas strap set (20L)", category: "gear", packed: false },
        { id: "pb3", name: "Wrench set (10/12/14mm) & spark plug cleaning tool", category: "tools", packed: false },
      ];
    }

    const timeout = setTimeout(() => {
      setPackingItems([...baseItems, ...bikeItems]);
    }, 0);
    return () => clearTimeout(timeout);
  }, [activeBike]);

  // OpenWeather API Fetch
  useEffect(() => {
    const fetchRealWeather = async () => {
      if (!openWeatherApiKey) {
        setWeatherForecast(null);
        return;
      }
      try {
        const query = encodeURIComponent(weatherCity);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${openWeatherApiKey}&units=metric`
        );
        if (res.ok) {
          const data = await res.json();
          setWeatherForecast(data);
        } else {
          setWeatherForecast(null);
        }
      } catch (err) {
        console.error("Failed to fetch weather from OpenWeather:", err);
        setWeatherForecast(null);
      }
    };
    fetchRealWeather();
  }, [openWeatherApiKey, weatherCity]);

  // GPS Simulation Loop
  useEffect(() => {
    const gpsInterval = setInterval(() => {
      const randomDec = () => (Math.random() * 0.005 - 0.0025).toFixed(4);
      const curLat = parseFloat("32.2396") + parseFloat(randomDec());
      const curLng = parseFloat("77.1887") + parseFloat(randomDec());
      setGpsCoords({
        lat: `${curLat.toFixed(4)}° N`,
        lng: `${curLng.toFixed(4)}° E`,
        alt: `${Math.floor(3450 + Math.random() * 10 - 5)} m`,
      });
    }, 3000);
    return () => clearInterval(gpsInterval);
  }, []);

  // SOS Countdown Loop
  useEffect(() => {
    let sosTimeout: NodeJS.Timeout;
    if (sosTriggered && sosCountdown > 0) {
      sosIntervalRef.current = setTimeout(() => {
        setSosCountdown((prev) => prev - 1);
      }, 1000);
    } else if (sosTriggered && sosCountdown === 0) {
      sosTimeout = setTimeout(() => {
        setSosActive(true);
      }, 0);
    }
    return () => {
      if (sosIntervalRef.current) clearTimeout(sosIntervalRef.current);
      if (sosTimeout) clearTimeout(sosTimeout);
    };
  }, [sosTriggered, sosCountdown]);

  // Leaflet Map Initialization for Route Planner
  useEffect(() => {
    if (activeTab !== "My Routes" || typeof window === "undefined") return;
    const container = mapContainerRef.current;
    if (!container) return;

    let map: L.Map;

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Add stylesheet link dynamically if not present
      if (!document.getElementById("leaflet-style-link")) {
        const link = document.createElement("link");
        link.id = "leaflet-style-link";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const details = getRouteDetails(routeStart, routeEnd, selectedRouteOption, activeBike);
      const coords = details.coordinates;
      const startPoint = coords[0] || [32.2396, 77.1887];

      // Initialize map on element
      map = L.map(container).setView(startPoint, 9);
      mapInstanceRef.current = map;

      const tilesUrl = headlightOn
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      L.tileLayer(tilesUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      // Add waypoints
      const markerGroup = L.featureGroup();
      const latlngs: L.LatLngTuple[] = [];

      coords.forEach((c, idx) => {
        latlngs.push([c[0], c[1]]);
        const isStart = idx === 0;
        const isEnd = idx === coords.length - 1;

        const customDiv = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: ${
            isStart ? "#10B981" : isEnd ? "#EF4444" : "#FF6B00"
          }; border: 2.5px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); width: 24px; height: 24px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900;">${
            isStart ? "S" : isEnd ? "E" : idx
          }</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([c[0], c[1]], { icon: customDiv })
          .bindPopup(`<strong>${isStart ? "Start Position" : isEnd ? "Destination" : `Waypoint ${idx}`}</strong>`)
          .addTo(map);

        markerGroup.addLayer(marker);
      });

      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: "#FF6B00",
          weight: 4.5,
          opacity: 0.95,
          dashArray: "6, 5",
        }).addTo(map);
      }

      if (coords.length > 0) {
        map.fitBounds(markerGroup.getBounds(), { padding: [50, 50] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, routeStart, routeEnd, selectedRouteOption, headlightOn, activeBike]);

  // Leaflet Map Initialization for SOS panel
  useEffect(() => {
    if (activeTab !== "Emergency SOS" || typeof window === "undefined") return;
    const container = sosMapContainerRef.current;
    if (!container) return;

    let map: L.Map;

    import("leaflet").then((L) => {
      if (sosMapInstanceRef.current) {
        sosMapInstanceRef.current.remove();
      }

      const activeLat = parseFloat(gpsCoords.lat) || 32.2396;
      const activeLng = parseFloat(gpsCoords.lng) || 77.1887;

      map = L.map(container, { zoomControl: false }).setView([activeLat, activeLng], 12);
      sosMapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      // Pulse circle
      L.circle([activeLat, activeLng], {
        color: "#EF4444",
        fillColor: "#EF4444",
        fillOpacity: 0.25,
        radius: 1200,
      }).addTo(map);

      L.marker([activeLat, activeLng], {
        icon: L.divIcon({
          className: "custom-sos-icon",
          html: `<div style="background-color: #EF4444; border: 2.5px solid white; box-shadow: 0 0 15px rgba(239,68,68,0.8); width: 16px; height: 16px; border-radius: 50%;" class="animate-pulse"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(map);
    });

    return () => {
      if (sosMapInstanceRef.current) {
        sosMapInstanceRef.current.remove();
        sosMapInstanceRef.current = null;
      }
    };
  }, [activeTab, gpsCoords]);

  // Handle Headlight Toggle
  const handleToggleHeadlight = () => {
    const nextState = !headlightOn;
    setHeadlightOn(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("headlightTheme", nextState ? "night" : "day");
    }
  };

  // Handle Bike Selection
  const handleSelectBike = (bike: Motorcycle) => {
    setActiveBike(bike);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeBike", bike.id);
    }
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: `Switched active motorcycle to ${bike.name} (${bike.edition || "Custom"}). I've recalculated your travel range to ${
          bike.id === "bmw_gs"
            ? "420 km"
            : bike.id === "re_himalayan"
            ? "340 km"
            : bike.id === "ktm_duke"
            ? "280 km"
            : bike.id === "honda_cb350"
            ? "310 km"
            : "240 km"
        } and adjusted your cargo guidelines to fit the ${bike.luggage || "30 Liters"} limit.`,
      },
    ]);
  };

  // Add Motorcycle
  const handleAddBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrand || !formModel || !formYear || !formEngineCc || !formRegNumber) return;

    const newBike: Motorcycle = {
      id: `bike-${Date.now()}`,
      brand: formBrand,
      model: formModel,
      year: formYear,
      engineCc: formEngineCc,
      regNumber: formRegNumber,
      image: formImage,
      name: `${formBrand} ${formModel}`,
      edition: "Expedition Fleet Custom",
      engine: `${formEngineCc}cc Single`,
      power: "35 HP",
      weight: "180 kg",
      luggage: "30 Liters (Canvas Bags)",
      type: "Dual Purpose",
      tank: "15 Liters",
      features: ["Dynamic traction control", "GPS Navigation Assist"],
    };

    const updated = [...motorcyclesList, newBike];
    setMotorcyclesList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_motorcycles", JSON.stringify(updated));
    }
    setShowAddBike(false);
    resetForm();
  };

  // Edit Motorcycle
  const handleStartEditBike = (bike: Motorcycle) => {
    setShowEditBike(bike);
    setFormBrand(bike.brand);
    setFormModel(bike.model);
    setFormYear(bike.year);
    setFormEngineCc(bike.engineCc);
    setFormRegNumber(bike.regNumber);
    setFormImage(bike.image);
  };

  const handleEditBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditBike || !formBrand || !formModel || !formYear || !formEngineCc || !formRegNumber) return;

    const updated = motorcyclesList.map((b) => {
      if (b.id === showEditBike.id) {
        const updatedBike = {
          ...b,
          brand: formBrand,
          model: formModel,
          year: formYear,
          engineCc: formEngineCc,
          regNumber: formRegNumber,
          image: formImage,
          name: `${formBrand} ${formModel}`,
        };
        if (activeBike.id === b.id) {
          setActiveBike(updatedBike);
        }
        return updatedBike;
      }
      return b;
    });

    setMotorcyclesList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_motorcycles", JSON.stringify(updated));
    }
    setShowEditBike(null);
    resetForm();
  };

  // Delete Motorcycle
  const handleDeleteBike = (id: string) => {
    if (activeBike.id === id) {
      alert("Cannot delete the currently active motorcycle. Please select another active motorcycle first.");
      return;
    }
    const updated = motorcyclesList.filter((b) => b.id !== id);
    setMotorcyclesList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_motorcycles", JSON.stringify(updated));
    }
  };

  // Smart Route Planner Actions
  const handleSaveRoute = () => {
    const details = getRouteDetails(routeStart, routeEnd, selectedRouteOption, activeBike);
    const ccVal = parseInt(activeBike.engineCc) || 350;
    const kmPerLiter = ccVal > 1000 ? 16 : ccVal > 400 ? 21 : ccVal > 300 ? 25 : 28;
    const distNum = parseInt(details.distance.replace(" km", "")) || 400;
    const liters = distNum / kmPerLiter;
    const estimatedFuelCost = Math.round(liters * 105);

    const newRoute = {
      id: `route-${Date.now()}`,
      start: routeStart,
      end: routeEnd,
      option: selectedRouteOption,
      distance: details.distance,
      duration: details.duration,
      roadType: details.roadType,
      elevation: details.elevation,
      fuelCost: estimatedFuelCost,
      date: new Date().toLocaleDateString(),
    };

    const updatedSaved = [newRoute, ...savedRoutes];
    setSavedRoutes(updatedSaved);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_saved_routes", JSON.stringify(updatedSaved));
    }

    // Add to recent routes (max 5)
    let updatedRecent = [newRoute, ...recentRoutes];
    updatedRecent = updatedRecent.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.start === item.start && t.end === item.end && t.option === item.option)
    );
    if (updatedRecent.length > 5) {
      updatedRecent = updatedRecent.slice(0, 5);
    }
    setRecentRoutes(updatedRecent);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_recent_routes", JSON.stringify(updatedRecent));
    }
  };

  const handleDeleteSavedRoute = (id: string) => {
    const updated = savedRoutes.filter((r) => r.id !== id);
    setSavedRoutes(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_saved_routes", JSON.stringify(updated));
    }
  };

  const handleLoadRoute = (route: SavedRoute) => {
    setRouteStart(route.start);
    setRouteEnd(route.end);
    setSelectedRouteOption(route.option);
  };

  // Chat Submission
  const handleSendChat = (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    if (!textOverride) setInputValue("");

    setTimeout(() => {
      let reply = "";
      const lower = text.toLowerCase();
      const isSpiti = plannerDestination.toLowerCase().includes("spiti");
      if (lower.includes("weather") || lower.includes("rain")) {
        reply = `${isSpiti ? "Spiti Valley" : plannerDestination} forecast for today reports ${weatherCondition.temp} with ${weatherCondition.rainChance} rain probability. Wind speeds are around ${weatherCondition.wind}. It is excellent riding weather, but pack rain gear just in case.`;
      } else if (lower.includes("range") || lower.includes("fuel") || lower.includes("tank")) {
        reply = `Your ${activeBike.name} has a fuel tank capacity of ${activeBike.tank}. Given your typical riding profile in ${plannerTerrain}, you should expect around ${
          activeBike.id === "bmw_gs" ? "390 km" : activeBike.id === "re_himalayan" ? "330 km" : "260 km"
        } of safe range before reserve limit. I recommend fueling up at ${isSpiti ? "Kaza base" : `${plannerDestination} base`}.`;
      } else if (lower.includes("weight") || lower.includes("luggage") || lower.includes("cargo") || lower.includes("pack")) {
        reply = `For your ${activeBike.name}, the recommended cargo volume is ${activeBike.luggage}. Ensure you load heavier tools lower in cases. I suggest packing an extra spark plug, chain lube, and your protective helmet.`;
      } else {
        reply = `Analyzing coordinates... Current coordinates: Lat ${gpsCoords.lat}, Lng ${gpsCoords.lng}. The elevation is ${gpsCoords.alt}. Keep traction settings in ${
          activeBike.id === "bmw_gs" || activeBike.id === "re_himalayan" ? "Enduro / Off-Road" : "Rain / Standard"
        } mode for the next pass.`;
      }
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 1000);
  };

  // Generate Plan Simulation
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);
    setGeneratedItinerary(null);

    setTimeout(() => {
      const lowerDest = plannerDestination.toLowerCase();
      let selectedDays: string[] = [];
      let title = "";

      if (lowerDest.includes("spiti")) {
        title = getItineraryTitle(plannerDestination, plannerStyle, plannerTerrain);
        selectedDays = getSpitiItinerary(activeBike, plannerDuration);
      } else if (lowerDest.includes("goa")) {
        title = getItineraryTitle(plannerDestination, plannerStyle, plannerTerrain);
        selectedDays = getGoaItinerary(activeBike, plannerDuration);
      } else if (lowerDest.includes("ladakh")) {
        title = getItineraryTitle(plannerDestination, plannerStyle, plannerTerrain);
        selectedDays = getLadakhItinerary(activeBike, plannerDuration);
      } else if (lowerDest.includes("kadapa")) {
        title = getItineraryTitle(plannerDestination, plannerStyle, plannerTerrain);
        selectedDays = getKadapaItinerary(activeBike, plannerDuration);
      } else {
        title = getItineraryTitle(plannerDestination, plannerStyle, plannerTerrain);
        selectedDays = getGenericItinerary(plannerDestination, activeBike, plannerDuration, plannerTerrain, plannerStyle);
      }

      let routeDesc = `${title} - Recalculated for ${activeBike.name}.\nDuration: ${plannerDuration} | Focus: ${plannerTerrain} (${plannerStyle}).\n\n`;
      selectedDays.forEach((dayText, idx) => {
        routeDesc += `- DAY ${idx + 1}: ${dayText}\n`;
      });

      setGeneratedItinerary(routeDesc.trim());
      setIsGeneratingPlan(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `I've generated a customized ${plannerDuration} travel plan to ${plannerDestination} optimized for your ${activeBike.name}. Check the AI Planner tab to view the detailed routing details!`,
        },
      ]);
    }, 1500);
  };


  // Add Journal Entry Handler
  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalTitle || !newJournalDate) return;
    const newLog: JournalEntry = {
      id: `log-${Date.now()}`,
      title: newJournalTitle,
      date: newJournalDate,
      distance: newJournalDist || "100",
      leanAngle: newJournalLean || "35",
      elevation: newJournalElev || "1200",
      notes: newJournalNotes || "Smooth cruising and scenic loops. Kept traction standard.",
      image: newJournalImage,
      motorcycle: activeBike.name,
    };
    setJournalEntries([newLog, ...journalEntries]);
    setNewJournalTitle("");
    setNewJournalDate("");
    setNewJournalDist("");
    setNewJournalLean("");
    setNewJournalElev("");
    setNewJournalNotes("");
    setShowAddJournal(false);
  };

  // Toggle Packing Checkbox
  const togglePackItem = (id: string) => {
    const updated = packingItems.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    setPackingItems(updated);
  };

  // SOS Activation
  const triggerSos = () => {
    setSosTriggered(true);
    setSosCountdown(3);
    setSosActive(false);
  };
  const cancelSos = () => {
    setSosTriggered(false);
    setSosActive(false);
    setSosCountdown(3);
    if (sosIntervalRef.current) clearTimeout(sosIntervalRef.current);
  };

  // Export GPX
  const exportGPX = () => {
    const details = getRouteDetails(routeStart, routeEnd, selectedRouteOption, activeBike);
    const coords = details.coordinates;
    const gpxString = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RideSync AI">
  <metadata>
    <name>${routeStart} to ${routeEnd} Route (${selectedRouteOption})</name>
    <desc>Planned route for ${activeBike.name}</desc>
  </metadata>
  <rte>
    ${coords.map((c, idx) => `<rtept lat="${c[0]}" lon="${c[1]}"><name>Waypoint ${idx}</name></rtept>`).join("\n    ")}
  </rte>
</gpx>`;
    const blob = new Blob([gpxString], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${routeStart.replace(/\s+/g, "_")}_to_${routeEnd.replace(/\s+/g, "_")}_${selectedRouteOption.toLowerCase()}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save OpenWeather API settings
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("openWeatherApiKey", openWeatherApiKey);
    }
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: `OpenWeather API Configuration saved. ${
          openWeatherApiKey ? "Live pass metrics loaded successfully." : "Standard mock parser enabled."
        }`,
      },
    ]);
  };

  // Logout
  const handleLogout = () => {
    router.push("/login?message=You+have+been+logged+out+successfully.");
  };

  // Calculations for Packing progress
  const packedCount = packingItems.filter((i) => i.packed).length;
  const totalCount = packingItems.length;
  const packingPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Packing Circle Stats
  const radius = 34;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (packingPercent / 100) * circumference;

  // Journal Search Filtered Entries
  const filteredJournal = journalEntries.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(journalQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(journalQuery.toLowerCase());
    const matchesBike =
      journalBikeFilter === "All" || log.motorcycle === journalBikeFilter;
    return matchesSearch && matchesBike;
  });

  // Sidebar navigation mapping
  const SIDEBAR_ITEMS = [
    { label: "Overview", tab: "Overview", icon: <Compass className="w-5 h-5" /> },
    { label: "My Garage", tab: "Garage", icon: <Bike className="w-5 h-5" /> },
    { label: "AI Trip Planner", tab: "AI Planner", icon: <Sparkles className="w-5 h-5" /> },
    { label: "Route Planner", tab: "My Routes", icon: <Map className="w-5 h-5" /> },
    { label: "Weather Radar", tab: "Weather Forecast", icon: <Cloud className="w-5 h-5" /> },
    { label: "Packing Assistant", tab: "Packing Assistant", icon: <Briefcase className="w-5 h-5" /> },
    { label: "Ride Journal", tab: "Ride Journal", icon: <Calendar className="w-5 h-5" /> },
    { label: "Emergency SOS", tab: "Emergency SOS", icon: <AlertTriangle className="w-5 h-5" /> },
    { label: "Settings", tab: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  // Feature Cards for Dashboard Grid
  const FEATURE_CARDS = [
    {
      label: "My Garage",
      tab: "Garage",
      icon: <Bike className="w-7 h-7" />,
      desc: "Manage fleet and bike specifications",
      accent: "orange",
      bg: "from-orange-600/12 to-orange-400/2",
    },
    {
      label: "AI Trip Planner",
      tab: "AI Planner",
      icon: <Sparkles className="w-7 h-7" />,
      desc: "AI-curated travel plans & itineraries",
      accent: "orange",
      bg: "from-amber-600/12 to-amber-400/2",
    },
    {
      label: "Route Planner",
      tab: "My Routes",
      icon: <Map className="w-7 h-7" />,
      desc: "Customise and export GPS tracks",
      accent: "orange",
      bg: "from-orange-600/12 to-orange-400/2",
    },
    {
      label: "Weather Radar",
      tab: "Weather Forecast",
      icon: <Cloud className="w-7 h-7" />,
      desc: "Live mountain pass meteorological info",
      accent: "sky",
      bg: "from-sky-600/12 to-sky-400/2",
    },
    {
      label: "Packing Assistant",
      tab: "Packing Assistant",
      icon: <Briefcase className="w-7 h-7" />,
      desc: "Smart bike-specific checklist metrics",
      accent: "orange",
      bg: "from-orange-600/12 to-orange-400/2",
    },
    {
      label: "Ride Journal",
      tab: "Ride Journal",
      icon: <Calendar className="w-7 h-7" />,
      desc: "Logs of lean angles and curves",
      accent: "orange",
      bg: "from-amber-600/12 to-amber-400/2",
    },
    {
      label: "Emergency SOS",
      tab: "Emergency SOS",
      icon: <AlertTriangle className="w-7 h-7" />,
      desc: "Satellite rescue coordinates & lock",
      accent: "red",
      bg: "from-red-600/12 to-red-400/2",
    },
    {
      label: "Settings",
      tab: "Settings",
      icon: <Settings className="w-7 h-7" />,
      desc: "Rider profiles and preferences",
      accent: "gray",
      bg: "from-gray-600/12 to-gray-400/2",
    },
  ];

  // Shared card class helper for tabs
  const cardClass = `border rounded-3xl p-8 backdrop-blur-xl shadow-2xl theme-transition ${
    headlightOn
      ? "bg-[#0A131F]/75 border-[#16324F]/30 text-white shadow-black/30"
      : "bg-white/90 border-black/8 text-[#0B1520] shadow-black/5"
  }`;

  return (
    <div
      className={`min-h-screen theme-transition flex relative overflow-x-hidden ${
        headlightOn ? "night-theme bg-[#060D15] text-white" : "day-theme bg-[#F0F2F5] text-[#0B1520]"
      }`}
    >
      {/* ── Ambient Background Glows ── */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#FF6B00]/5 blur-[220px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/4 blur-[200px] pointer-events-none z-0" />
      {headlightOn && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-[#FF6B00]/3 blur-[300px] pointer-events-none z-0" />
      )}

      {/* ════════════════════════════════════════════
          LEFT SIDEBAR (Desktop Only)
      ════════════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex flex-col w-[272px] border-r px-5 py-6 flex-shrink-0 justify-between sticky top-0 h-screen z-30 backdrop-blur-2xl theme-transition ${
          headlightOn
            ? "bg-[#060D15]/95 border-[#16324F]/30 text-white shadow-[4px_0_32px_rgba(0,0,0,0.4)]"
            : "bg-white/95 border-gray-200/80 text-[#0B1520] shadow-[4px_0_32px_rgba(0,0,0,0.03)]"
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <button
            onClick={() => setActiveTab("Overview")}
            className="flex items-center gap-3.5 group px-1 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-orange-700 flex items-center justify-center shadow-lg shadow-[#FF6B00]/30 group-hover:scale-105 transition-all duration-300">
              <Map className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-[14px] leading-none tracking-tight theme-transition ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>
                RideSync <span className="text-[#FF6B00]">AI</span>
              </span>
              <span className="text-[9px] text-[#FF6B00] font-bold tracking-[0.2em] uppercase mt-1">AI Assistant</span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 relative overflow-hidden border ${
                  activeTab === item.tab
                    ? "nav-item-active text-[#FF6B00] bg-[#FF6B00]/8 border-[#FF6B00]/20"
                    : headlightOn
                    ? "text-white/50 hover:text-white hover:bg-white/4 border-transparent hover:translate-x-0.5"
                    : "text-gray-500 hover:text-[#0B1520] hover:bg-gray-100/70 border-transparent hover:translate-x-0.5"
                }`}
              >
                <span className={`flex-shrink-0 transition-colors duration-200 ${
                  activeTab === item.tab ? "text-[#FF6B00]" : headlightOn ? "text-white/40" : "text-gray-400"
                }`}>
                  {item.icon}
                </span>
                <span className="tracking-[-0.01em]">{item.label}</span>
                {activeTab === item.tab && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B00] shadow-[0_0_6px_rgba(255,107,0,0.8)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User profile card & Logout bottom of sidebar */}
        <div className="space-y-3">
          <div className={`border rounded-xl p-3 flex items-center gap-3 theme-transition ${
            headlightOn ? "border-[#16324F]/30 bg-white/3" : "border-black/5 bg-black/3"
          }`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-orange-700 p-[1px] shadow flex-shrink-0">
              <div className={`w-full h-full rounded-[7px] flex items-center justify-center theme-transition ${headlightOn ? "bg-[#060D15]" : "bg-white"}`}>
                <span className="font-black text-xs text-[#FF6B00]">{userInitials}</span>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-[12px] font-bold truncate leading-none theme-transition ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{displayName}</span>
              <span className="text-[9px] text-[#FF6B00]/80 font-semibold tracking-wide truncate mt-0.5">@{username}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/8 border border-transparent hover:border-red-500/15 transition-all duration-200 w-full"
          >
            <LogOut className="w-[16px] h-[16px]" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════
          MAIN WORKSPACE
      ════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        {/* TOP HEADER */}
        <header
          className={`h-[72px] border-b theme-transition flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 backdrop-blur-2xl ${
            headlightOn
              ? "bg-[#060D15]/88 border-[#16324F]/28 text-white"
              : "bg-white/82 border-black/6 text-[#0B1520]"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl border theme-transition flex-shrink-0 ${
                headlightOn
                  ? "border-white/10 hover:bg-white/5 text-white"
                  : "border-black/10 hover:bg-black/5 text-[#0B1520]"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* RideSync AI Header Logo (Left aligned) */}
            <button
              onClick={() => setActiveTab("Overview")}
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-orange-700 flex items-center justify-center shadow-md shadow-[#FF6B00]/30 group-hover:scale-105 transition-all duration-300">
                <Map className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className={`font-black text-sm tracking-tight theme-transition ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>
                RideSync <span className="text-[#FF6B00]">AI</span>
              </span>
            </button>
          </div>

          {/* Premium Search Bar (Center aligned) */}
          <div className="flex-1 max-w-[420px] mx-auto hidden md:flex">
            <div
              className={`w-full h-10 rounded-2xl flex items-center gap-2.5 px-4 border theme-transition ${
                headlightOn
                  ? "bg-white/5 border-white/8 text-white/40 hover:bg-white/8 hover:border-white/12"
                  : "bg-black/4 border-black/8 text-gray-400 hover:bg-black/6 hover:border-black/12"
              }`}
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0 opacity-50 text-[#FF6B00]" />
              <input
                type="text"
                placeholder="Search routes, landmarks..."
                onChange={(e) => setJournalQuery(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none w-full ml-1 placeholder-gray-400/80 text-white"
              />
            </div>
          </div>

          {/* Header Controls (Right aligned) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Signature Headlight Theme Toggle */}
            <button
              onClick={handleToggleHeadlight}
              aria-label="Toggle Headlight Theme"
              className={`relative flex items-center rounded-xl overflow-hidden cursor-pointer border transition-all duration-700 ${
                headlightOn
                  ? "border-[#FF6B00]/35 animate-headlight-pulse"
                  : "border-black/10"
              }`}
            >
              <div className={`flex items-center gap-1.5 px-3 py-2 transition-all duration-700 ${
                !headlightOn ? "bg-amber-50 text-amber-700" : "bg-black/20 text-white/25"
              }`}>
                <Sun className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black tracking-widest uppercase hidden lg:inline">Day</span>
              </div>
              <div className={`w-px self-stretch transition-colors duration-700 ${headlightOn ? "bg-[#FF6B00]/20" : "bg-black/10"}`} />
              <div className={`flex items-center gap-1.5 px-3 py-2 transition-all duration-700 ${
                headlightOn ? "bg-[#FF6B00]/15 text-[#FF6B00]" : "bg-white/10 text-gray-400"
              }`}>
                <Zap className={`w-3.5 h-3.5 transition-all duration-700 ${headlightOn ? "fill-[#FF6B00] drop-shadow-[0_0_4px_rgba(255,107,0,0.8)]" : ""}`} />
                <span className="text-[10px] font-black tracking-widest uppercase hidden lg:inline">Night</span>
              </div>
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`absolute bottom-0 h-0.5 bg-[#FF6B00] rounded-full ${headlightOn ? "left-1/2 right-0" : "left-0 right-1/2"}`}
              />
            </button>

            {/* Notification Bell Icon */}
            <button
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 ${
                headlightOn
                  ? "border-white/8 bg-white/4 text-white/60 hover:bg-white/8 hover:text-white"
                  : "border-black/8 bg-black/3 text-gray-500 hover:bg-black/6 hover:text-[#0B1520]"
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6B00] shadow-[0_0_5px_rgba(255,107,0,0.9)]" />
            </button>

            {/* User Profile Widget */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-gray-400/15">
              <div className="hidden sm:flex flex-col text-right">
                <span className={`text-[13px] font-bold leading-none theme-transition ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>
                  {displayName}
                </span>
                <span className="text-[10px] text-[#FF6B00]/80 font-semibold mt-0.5 tracking-wide">
                  @{username}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-orange-700 p-[1.5px] shadow-md shadow-[#FF6B00]/25 flex-shrink-0 cursor-pointer">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center theme-transition ${headlightOn ? "bg-[#060D15]" : "bg-white"}`}>
                  <span className="font-black text-xs text-[#FF6B00]">{userInitials}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
              transition={{ duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* ══════════════════════════════════════════
                  DASHBOARD HOME VIEW (Overview tab)
              ══════════════════════════════════════════ */}
              {activeTab === "Overview" && (
                <div className="px-6 md:px-10 py-6 max-w-[1440px] mx-auto space-y-6">
                  
                  {/* HERO BANNER (Occupies 35-40% of the screen height) */}
                  <div className="relative w-full h-[36vh] md:h-[40vh] min-h-[320px] overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
                    {/* Parallax Golden Hour & Moon images */}
                    <motion.div
                      animate={{ scale: [1, 1.012, 1] }}
                      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 z-0"
                    >
                      <div
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                          backgroundImage: "url('/hero_day.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center 35%",
                          opacity: headlightOn ? 0 : 1,
                        }}
                      />
                      <div
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                          backgroundImage: "url('/hero_night.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center 35%",
                          opacity: headlightOn ? 1 : 0,
                        }}
                      />
                    </motion.div>

                    {/* Headlight beam overlay effect */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out z-10"
                      style={{
                        opacity: headlightOn ? 1 : 0,
                        background: "conic-gradient(from 148deg at 16% 68%, rgba(255,107,0,0.45) 0deg, rgba(255,183,107,0.12) 22deg, rgba(255,107,0,0) 38deg)",
                      }}
                    />
                    {headlightOn && (
                      <div className="absolute left-[16%] top-[62%] w-96 h-32 bg-gradient-to-r from-orange-400/20 to-transparent blur-[24px] rounded-full pointer-events-none z-10 animate-pulse" />
                    )}

                    {/* Gradient overlays */}
                    <div
                      className={`absolute inset-0 z-10 transition-all duration-1000 ${
                        headlightOn
                          ? "bg-gradient-to-r from-[#060D15]/90 via-[#060D15]/40 to-[#060D15]/65"
                          : "bg-gradient-to-r from-black/80 via-black/30 to-black/60"
                      }`}
                    />
                    {/* Bottom fade */}
                    <div className={`absolute bottom-0 inset-x-0 h-24 z-10 transition-all duration-1000 ${
                      headlightOn ? "bg-gradient-to-t from-[#060D15]/90 to-transparent" : "bg-gradient-to-t from-transparent to-transparent"
                    }`} />

                    {/* Hero Layout Content */}
                    <div className="relative z-20 h-full px-6 md:px-8 py-6 flex items-center justify-between">
                      
                      <div className="flex flex-col justify-between h-full max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 w-fit rounded-full bg-[#FF6B00] text-white text-[9px] font-black tracking-widest uppercase shadow-md shadow-[#FF6B00]/40">
                          <Compass className="w-3 h-3 animate-spin-slow" />
                          Rider Expedition Deck
                        </div>

                        {/* Title text */}
                        <div className="my-auto pt-4 pb-4">
                          <p className="text-[10px] text-[#FF6B00] font-black tracking-[0.2em] uppercase">
                            {activeBike.name} · {activeBike.edition}
                          </p>
                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] mt-1">
                            Welcome back,
                            <br />
                            <span className="text-[#FF6B00]">{displayName}</span>
                          </h1>
                        </div>

                        {/* Status bar */}
                        <div className="flex flex-wrap items-center gap-4 text-white/80">
                          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-ping" />
                            <span>Range: <strong className="text-white">{activeBike.id === "bmw_gs" ? "420 km" : "310 km"}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-bold">
                            <span>Fuel: <strong className="text-[#FF6B00]">92%</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-bold">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Next: <strong className="text-white">Jul 18 (750km)</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Selected motorcycle image floating on the right */}
                      <div className="w-[360px] h-full relative hidden lg:flex items-center justify-center pointer-events-none">
                        <motion.div
                          key={activeBike.id}
                          initial={{ opacity: 0, scale: 0.82, x: 60 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          whileHover={{ y: -6, rotate: 1.5 }}
                          className="relative w-full h-[85%] pointer-events-auto"
                        >
                          <Image
                            src={activeBike.image}
                            alt={activeBike.name}
                            fill
                            priority
                            className="object-contain drop-shadow-[0_25px_50px_rgba(255,107,0,0.35)]"
                          />
                        </motion.div>
                      </div>

                    </div>
                  </div>

                  {/* 8 PREMIUM FEATURE CARDS GRID (Exactly 2 rows x 4 columns on desktop) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <h2 className={`text-xl font-black tracking-tight theme-transition ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>
                        Mission Modules
                      </h2>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${headlightOn ? "text-white/40" : "text-gray-400"}`}>
                        Select a module to view
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5">
                      {FEATURE_CARDS.map((card, idx) => (
                        <motion.button
                          key={card.tab}
                          onClick={() => setActiveTab(card.tab)}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.045, duration: 0.35 }}
                          whileHover={{ scale: 1.03, y: -4 }}
                          whileTap={{ scale: 0.97 }}
                          className={`text-left p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between group relative overflow-hidden transition-all duration-300 min-h-[170px] ${
                            headlightOn
                              ? "bg-[#0A131F]/65 border-[#16324F]/30 hover:border-[#FF6B00]/40 shadow-xl shadow-black/30 text-white"
                              : "bg-white/80 border-black/8 hover:border-[#FF6B00]/30 shadow-lg shadow-black/5 text-[#0B1520]"
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          
                          <div className="relative z-10 flex flex-col gap-3">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                              card.accent === "orange" ? "bg-[#FF6B00]/10 text-[#FF6B00]" :
                              card.accent === "red" ? "bg-red-50/10 text-red-500" :
                              card.accent === "sky" ? "bg-sky-500/10 text-sky-500" :
                              "bg-gray-500/10 text-gray-500"
                            }`}>
                              {card.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-black leading-tight tracking-tight">{card.label}</h3>
                              <p className={`text-[11px] mt-0.5 leading-normal ${headlightOn ? "text-white/40" : "text-gray-400"}`}>{card.desc}</p>
                            </div>
                          </div>

                          <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-gray-400/5">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                              card.accent === "orange" ? "text-[#FF6B00]" :
                              card.accent === "red" ? "text-red-500" :
                              card.accent === "sky" ? "text-sky-500" :
                              "text-gray-400"
                            }`}>Access Module</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#FF6B00] group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ══════════════════════════════════════════
                  SUB-MODULE VIEWS (Back-button wrapper)
              ══════════════════════════════════════════ */}
              {activeTab !== "Overview" && (
                <div className="px-6 md:px-10 py-6 max-w-[1440px] mx-auto space-y-6">
                  {/* Navigation breadcrumb */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("Overview")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 hover:-translate-x-0.5 ${
                        headlightOn
                          ? "border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                          : "border-black/10 text-gray-500 hover:text-[#0B1520] hover:bg-black/5"
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                      Back to Dashboard
                    </button>
                    <span className="text-gray-500/40 font-black text-xs">/</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${headlightOn ? "text-[#FF6B00]" : "text-orange-600"}`}>
                      {activeTab}
                    </span>
                  </div>

                  {/* ── 1. MY GARAGE TAB ── */}
                  {activeTab === "Garage" && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-2xl font-black">My Garage</h2>
                          <p className="text-xs text-gray-400 font-semibold mt-1">Select and manage active travel motorcycles.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Showcase card */}
                        <div className={`lg:col-span-2 ${cardClass} relative overflow-hidden`}>
                          <div>
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Active Vessel</span>
                                <h3 className="text-3xl font-black mt-1 leading-none">{activeBike.name}</h3>
                                <p className="text-xs text-gray-400 font-semibold mt-2">{activeBike.edition} · {activeBike.type}</p>
                              </div>
                              <div className="px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] text-xs font-black">
                                GPS Synced
                              </div>
                            </div>

                            <div className="relative h-[250px] bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center my-6">
                              <Image src={activeBike.image} alt={activeBike.name} fill priority className="object-contain p-4 scale-105" />
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">System Features</p>
                            <div className="flex flex-wrap gap-2">
                              {activeBike.features.map((feat) => (
                                <span key={feat} className="px-3 py-1.5 rounded-xl bg-black/35 border border-white/10 text-[10px] font-black text-white">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Specs card */}
                        <div className={cardClass}>
                          <div>
                            <h4 className="text-lg font-black pb-4 border-b border-gray-400/10 mb-6">Technical Specifications</h4>
                            <div className="space-y-5">
                              {[
                                { label: "Engine Displacement", value: activeBike.engine },
                                { label: "Peak Performance Output", value: activeBike.power },
                                { label: "Wet Curb Weight", value: activeBike.weight },
                                { label: "Fuel Tank Capacity", value: activeBike.tank },
                                { label: "Cargo Luggage Capacity", value: activeBike.luggage },
                                { label: "Category Type", value: activeBike.type },
                              ].map((spec) => (
                                <div key={spec.label} className="flex justify-between items-start text-xs border-b border-gray-400/5 pb-3">
                                  <span className="text-gray-400 font-bold">{spec.label}</span>
                                  <span className="font-black text-right max-w-[60%]">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-400/10">
                            <button
                              onClick={() => setActiveTab("AI Planner")}
                              className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs rounded-xl tracking-widest uppercase shadow-lg shadow-[#FF6B00]/20 transition-colors"
                            >
                              Plan Expedition →
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Fleet selector */}
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-black">Select Motorcycle Fleet</h3>
                          <button
                            onClick={() => { resetForm(); setShowAddBike(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black tracking-wider uppercase transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Bike
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                          {motorcyclesList.map((bike) => (
                            <div
                              key={bike.id}
                              onClick={() => handleSelectBike(bike)}
                              className={`border rounded-[20px] p-4 cursor-pointer backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-[230px] group relative ${
                                activeBike.id === bike.id
                                  ? "bg-[#FF6B00]/10 border-[#FF6B00]/50 shadow-lg shadow-[#FF6B00]/10 ring-2 ring-[#FF6B00]/30 scale-[1.02]"
                                  : headlightOn
                                  ? "bg-[#0A131F]/50 border-[#16324F]/30 hover:border-white/20 text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30"
                                  : "bg-white border-black/10 hover:border-[#FF6B00]/30 text-[#0B1520] hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-black text-xs truncate" title={`${bike.brand} ${bike.model}`}>{bike.brand} {bike.model}</h5>
                                  <p className="text-[7px] text-gray-400 font-bold mt-0.5 tracking-wide uppercase truncate">Reg: {bike.regNumber}</p>
                                </div>
                                <div className="flex gap-1 ml-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStartEditBike(bike); }}
                                    className="p-1 rounded bg-black/10 hover:bg-[#FF6B00]/20 text-[#FF6B00] transition-colors"
                                    title="Edit"
                                  >
                                    <Settings className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteBike(bike.id); }}
                                    className="p-1 rounded bg-black/10 hover:bg-red-500/25 text-red-400 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <div className="relative h-[88px] w-full flex items-center justify-center rounded-xl overflow-hidden bg-black/20 my-2">
                                <Image src={bike.image} alt={bike.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                              </div>

                              <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold border-t border-gray-400/5 pt-2">
                                <span>{bike.year}</span>
                                <span>{bike.engineCc || bike.engine?.split(" ")[0] || "300"} CC</span>
                              </div>

                              {activeBike.id === bike.id && (
                                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-[#FF6B00] text-white text-[7px] font-black tracking-widest uppercase shadow-sm shadow-[#FF6B00]/30">
                                  Active
                                </span>
                              )}
                            </div>
                          ))}

                          {/* Add Motorcycle Card */}
                          <div
                            onClick={() => { resetForm(); setShowAddBike(true); }}
                            className={`border border-dashed rounded-[20px] p-4 cursor-pointer backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center h-[230px] ${
                              headlightOn
                                ? "border-white/20 bg-white/2 hover:bg-white/5 text-white/60 hover:text-white"
                                : "border-black/20 bg-black/2 hover:bg-black/5 text-gray-500 hover:text-[#0B1520]"
                            }`}
                          >
                            <Plus className="w-8 h-8 mb-2" />
                            <span className="text-xs font-black uppercase tracking-wider">Add Bike</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 2. AI TRIP PLANNER TAB ── */}
                  {activeTab === "AI Planner" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Input form */}
                      <div className={`${cardClass} h-fit`}>
                        <h3 className="text-xl font-black mb-6">Plan Expedition</h3>
                        <form onSubmit={handleGeneratePlan} className="space-y-5">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Destination</label>
                            <input
                              type="text"
                              value={plannerDestination}
                              onChange={(e) => setPlannerDestination(e.target.value)}
                              className={`theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                              }`}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Duration</label>
                            <select
                              value={plannerDuration}
                              onChange={(e) => setPlannerDuration(e.target.value)}
                              className={`theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                              }`}
                            >
                              <option value="3 Days">3 Days</option>
                              <option value="5 Days">5 Days</option>
                              <option value="7 Days">7 Days</option>
                              <option value="10 Days">10 Days</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Terrain</label>
                            <select
                              value={plannerTerrain}
                              onChange={(e) => setPlannerTerrain(e.target.value)}
                              className={`theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                              }`}
                            >
                              <option value="Mountain Passes & Gravel">Mountain Passes & Gravel</option>
                              <option value="Highway Touring">Highway Touring</option>
                              <option value="Coastal Roads">Coastal Roads</option>
                              <option value="Desert Terrain">Desert Terrain</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Riding Style</label>
                            <select
                              value={plannerStyle}
                              onChange={(e) => setPlannerStyle(e.target.value)}
                              className={`theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                              }`}
                            >
                              <option value="Adventure Tour">Adventure Tour</option>
                              <option value="Sport & Curves">Sport & Curves</option>
                              <option value="Relaxed Touring">Relaxed Touring</option>
                              <option value="Hardcore Rally Group">Hardcore Rally Group (Fast pace)</option>
                            </select>
                          </div>

                          <div className="p-3 bg-black/45 border border-white/5 rounded-xl text-[10px] text-gray-400 font-bold leading-relaxed">
                            Route calculations automatically prioritize suspension, range and tool parameters for your active <span className="text-[#FF6B00]">{activeBike.name}</span>.
                          </div>

                          <button
                            type="submit"
                            disabled={isGeneratingPlan}
                            className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs rounded-xl tracking-widest uppercase shadow-lg shadow-[#FF6B00]/25 transition-colors disabled:opacity-50"
                          >
                            {isGeneratingPlan ? "Analyzing Topography..." : "Generate AI Plan"}
                          </button>
                        </form>
                      </div>

                      {/* Itinerary output */}
                      <div className="lg:col-span-2 space-y-8">
                        <div className={`${cardClass} min-h-[400px] flex flex-col justify-between`}>
                          <div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-400/10 mb-6">
                              <h4 className="text-lg font-black">AI Curated Itinerary Output</h4>
                              {generatedItinerary && (
                                <button
                                  onClick={() => setMessages((prev) => [...prev, { sender: "ai", text: `Recalculated itinerary: ${plannerDestination}. Curvy Rating: 9.4/10. Ready for download.` }])}
                                  className="text-xs font-black text-[#FF6B00] hover:underline"
                                >
                                  Sync Itinerary
                                </button>
                              )}
                            </div>

                            {!generatedItinerary && !isGeneratingPlan && (
                              <div className="h-[250px] flex flex-col items-center justify-center text-center text-gray-500">
                                <Sparkles className="w-12 h-12 text-gray-600 mb-3 animate-pulse" />
                                <p className="text-xs font-bold">Configure parameters and click &quot;Generate AI Plan&quot; above.</p>
                              </div>
                            )}

                            {isGeneratingPlan && (
                              <div className="h-[250px] flex flex-col items-center justify-center text-center">
                                <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-xs font-bold text-gray-400">Recalculating fuel ranges, altitude pass oxygen levels, and dynamic suspension dampening index for {activeBike.name}...</p>
                              </div>
                            )}

                            {generatedItinerary && !isGeneratingPlan && (
                              <div className="space-y-4">
                                {(() => {
                                  const parts = generatedItinerary.split(/(?=- DAY)/).filter((d) => d.trim());
                                  const introPart = parts.find(p => !p.trim().startsWith("- DAY"));
                                  const dayParts = parts.filter(p => p.trim().startsWith("- DAY"));
                                  
                                  return (
                                    <>
                                      {introPart && (
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 mb-4">
                                          <p className="text-base font-black text-white">{introPart.split("\n")[0].trim()}</p>
                                          <p className="text-xs text-gray-400 mt-1 font-semibold">
                                            {introPart.split("\n").slice(1).join(" ").trim()}
                                          </p>
                                        </div>
                                      )}
                                      
                                      {dayParts.map((dayText, idx) => {
                                        const dayIcons = ["🧭", "⛰️", "🌊", "🛣️", "🏁"];
                                        const cleanText = dayText.replace(/^- DAY \d+:?\s*/i, "").trim();
                                        const dayMatch = dayText.match(/DAY (\d+)/i);
                                        const dayNum = dayMatch ? dayMatch[1] : String(idx + 1);
                                        const isLast = idx === dayParts.length - 1;
                                        return (
                                          <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center flex-shrink-0">
                                              <div className="w-9 h-9 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF6B00]/30 font-black text-white text-xs z-10">
                                                {dayNum}
                                              </div>
                                              {!isLast && (
                                                <div className="w-0.5 flex-1 bg-gradient-to-b from-[#FF6B00]/50 to-[#FF6B00]/10 my-1 min-h-[28px]" />
                                              )}
                                            </div>
                                            <div className="pb-5 flex-1 min-w-0">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-base">{dayIcons[idx % dayIcons.length] || "🏍️"}</span>
                                                <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">Day {dayNum}</span>
                                              </div>
                                              <p className="text-xs leading-relaxed text-gray-300 font-medium">{cleanText}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </div>

                          {generatedItinerary && (
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-400/10 mt-6">
                              <button
                                onClick={exportGPX}
                                className="px-4 py-2.5 bg-black/45 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all"
                              >
                                <FileDown className="w-4 h-4 text-[#FF6B00]" /> Export GPX Data
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Live assistant */}
                        <div className={`${cardClass}`}>
                          <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Expedition Live Assistant</h4>
                          <p className="text-xs text-gray-400 mb-4 font-semibold">Ask specific questions about water depths, border permissions, or fuel depots on this itinerary.</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={
                                plannerDestination.toLowerCase().includes("spiti")
                                  ? "e.g. Is there mobile network coverage near Kunzum pass?"
                                  : `e.g. Is there mobile network coverage near ${plannerDestination}?`
                              }
                              className={`flex-1 theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                              }`}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSendChat((e.target as HTMLInputElement).value);
                                  (e.target as HTMLInputElement).value = "";
                                }
                              }}
                            />
                          </div>
                          {messages.length > 1 && (
                            <div className="mt-4 p-3 bg-black/20 rounded-xl max-h-[140px] overflow-y-auto text-xs space-y-2 border border-white/5">
                              {messages.slice(1).map((m, i) => (
                                <div key={i} className={`p-2 rounded-lg ${m.sender === "user" ? "bg-[#FF6B00]/10 text-white/90 text-right ml-8 border border-[#FF6B00]/10" : "bg-black/20 text-gray-300 mr-8"}`}>
                                  <p className="text-[9px] uppercase tracking-widest text-[#FF6B00] font-black">{m.sender === "user" ? "Rider" : "AI Copilot"}</p>
                                  <p className="mt-0.5 font-medium leading-relaxed">{m.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 3. ROUTE PLANNER TAB (Leaflet Integration) ── */}
                  {/* ── 3. ROUTE PLANNER TAB (Leaflet Integration) ── */}
                  {activeTab === "My Routes" && (
                    <div className="space-y-8">
                      {/* Inputs, route options and statistics */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className={`${cardClass} h-fit space-y-6`}>
                          <div className="flex justify-between items-center pb-2 border-b border-gray-400/10">
                            <h3 className="text-lg font-black">Route Configuration</h3>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Smart Planner</span>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Current Location (Start)</label>
                              <input
                                type="text"
                                value={routeStart}
                                onChange={(e) => setRouteStart(e.target.value)}
                                placeholder="e.g. Manali Base Camp"
                                className={`theme-transition border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Destination Search (End)</label>
                              <input
                                type="text"
                                value={routeEnd}
                                onChange={(e) => setRouteEnd(e.target.value)}
                                placeholder="e.g. Kaza Base Camp"
                                className={`theme-transition border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Route Options (Only 3 Options) */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400">Select Route Engine</label>
                            <div className="grid grid-cols-3 gap-2">
                              {(["Scenic", "Fastest", "Highway"] as const).map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => setSelectedRouteOption(opt)}
                                  className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all duration-200 ${
                                    selectedRouteOption === opt
                                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-[#FF6B00] shadow-sm shadow-[#FF6B00]/10"
                                      : headlightOn
                                      ? "border-white/8 text-white/60 hover:text-white hover:bg-white/5"
                                      : "border-black/10 text-gray-500 hover:text-[#0B1520] hover:bg-black/5"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Route Details and Calculations */}
                          {(() => {
                            const details = getRouteDetails(routeStart, routeEnd, selectedRouteOption, activeBike);
                            const ccVal = parseInt(activeBike.engineCc) || 350;
                            const kmPerLiter = ccVal > 1000 ? 16 : ccVal > 400 ? 21 : ccVal > 300 ? 25 : 28;
                            const distNum = parseInt(details.distance.replace(" km", "")) || 400;
                            const liters = distNum / kmPerLiter;
                            const fuelCost = Math.round(liters * 105);

                            return (
                              <div className="space-y-4 pt-4 border-t border-gray-400/10">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Distance</p>
                                    <p className="text-base font-black mt-0.5">{details.distance}</p>
                                  </div>
                                  <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">ETA</p>
                                    <p className="text-base font-black mt-0.5">{details.duration}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Est. Fuel Cost</p>
                                    <p className="text-base font-black mt-0.5 text-[#FF6B00]">₹{fuelCost.toLocaleString()}</p>
                                  </div>
                                  <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Road Surface</p>
                                    <p className="text-[10px] font-black mt-0.5 leading-tight truncate" title={details.roadType}>{details.roadType}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleSaveRoute}
                                    className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs rounded-xl tracking-widest uppercase shadow shadow-[#FF6B00]/15 transition-colors"
                                  >
                                    Save Route
                                  </button>
                                  <button
                                    onClick={exportGPX}
                                    className={`px-3 py-2.5 rounded-xl border transition-colors flex items-center justify-center ${
                                      headlightOn ? "border-white/10 hover:bg-white/5 text-white" : "border-black/10 hover:bg-black/5 text-[#0B1520]"
                                    }`}
                                    title="Export GPX"
                                  >
                                    <FileDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Interactive Leaflet Map */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className={`${cardClass} flex flex-col justify-between h-full`}>
                            <div className="flex justify-between items-center mb-6">
                              <div>
                                <h4 className="text-lg font-black">Interactive Sat-Nav Map</h4>
                                <p className="text-xs text-gray-400 font-semibold mt-1">Real-time Leaflet GIS mapping engine.</p>
                              </div>
                            </div>

                            <div className="h-[380px] rounded-3xl overflow-hidden border border-white/5 relative z-10 bg-[#070e17]">
                              <div ref={mapContainerRef} className="w-full h-full" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Saved and Recent Routes Panel with Empty States */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Saved Routes */}
                        <div className={cardClass}>
                          <h4 className="text-base font-black mb-4 pb-2 border-b border-gray-400/10 flex justify-between items-center">
                            <span>Saved Expeditions</span>
                            <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {savedRoutes.length} Total
                            </span>
                          </h4>

                          {savedRoutes.length === 0 ? (
                            <div className="py-8 text-center flex flex-col items-center justify-center text-gray-500">
                              <Map className="w-10 h-10 mb-2 opacity-30 text-[#FF6B00]" />
                              <p className="text-xs font-black uppercase tracking-wider text-gray-400">No Saved Routes</p>
                              <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Create, search, and save routes to build your custom expedition catalog.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                              {savedRoutes.map((route) => (
                                <div
                                  key={route.id}
                                  onClick={() => handleLoadRoute(route)}
                                  className="flex items-center justify-between p-3 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/5 cursor-pointer hover:scale-[1.01] transition-all duration-200 group"
                                >
                                  <div className="text-xs flex-1 min-w-0 pr-2">
                                    <p className="font-black text-white group-hover:text-[#FF6B00] transition-colors truncate">{route.start} ➔ {route.end}</p>
                                    <p className="text-[8px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider truncate">
                                      {route.option} · {route.distance} · {route.duration} · ₹{route.fuelCost} Est.
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSavedRoute(route.id); }}
                                    className="p-1.5 rounded bg-black/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                    title="Delete Route"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Recent Searches */}
                        <div className={cardClass}>
                          <h4 className="text-base font-black mb-4 pb-2 border-b border-gray-400/10">Recent Routes</h4>

                          {recentRoutes.length === 0 ? (
                            <div className="py-8 text-center flex flex-col items-center justify-center text-gray-500">
                              <Clock className="w-10 h-10 mb-2 opacity-30 text-sky-400" />
                              <p className="text-xs font-black uppercase tracking-wider text-gray-400">No Recent Searches</p>
                              <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Searched routes will appear here for fast dynamic retrieval.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                              {recentRoutes.map((route, idx) => (
                                <div
                                  key={route.id || idx}
                                  onClick={() => handleLoadRoute(route)}
                                  className="p-3 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/5 cursor-pointer hover:scale-[1.01] transition-all duration-200 flex justify-between items-center group"
                                >
                                  <div className="text-xs flex-1 min-w-0 pr-2">
                                    <p className="font-black text-white group-hover:text-sky-400 transition-colors truncate">{route.start} ➔ {route.end}</p>
                                    <p className="text-[8px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider truncate">
                                      {route.option} · {route.distance} · {route.duration}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 4. WEATHER TAB (OpenWeather Integration) ── */}
                  {activeTab === "Weather Forecast" && (
                    <div className="space-y-8">
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-black">Weather Radar</h2>
                          <p className="text-xs text-gray-400 font-semibold mt-1">
                            {openWeatherApiKey ? `Live OpenWeather feed for ${weatherCity}` : "Standard Meteorological radar mockup"}
                          </p>
                        </div>
                        {/* City select */}
                        <div className="flex gap-2 w-full md:w-auto">
                          <input
                            type="text"
                            value={weatherCity}
                            onChange={(e) => setWeatherCity(e.target.value)}
                            placeholder="Enter city (e.g. Manali)..."
                            className={`theme-transition border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                              headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Current metrics */}
                        <div className={`${cardClass} flex flex-col justify-between`}>
                          <div>
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Active Station Radar</span>
                            <div className="flex justify-between items-center my-6">
                              <div>
                                <h4 className="text-5xl font-black">
                                  {weatherForecast ? `${Math.round(weatherForecast.list[0].main.temp)}°C` : weatherCondition.temp}
                                </h4>
                                <p className="text-xs text-gray-400 font-bold mt-1">
                                  {weatherForecast ? `${weatherForecast.city.name}, ${weatherForecast.city.country}` : "Spiti Valley High Passes"}
                                </p>
                              </div>
                              {/* Animated svg icon */}
                              <div className="animate-bounce">
                                <Cloud className="w-16 h-16 text-[#FF6B00] drop-shadow-[0_0_10px_rgba(255,107,0,0.25)]" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3.5 border-t border-gray-400/10 pt-4">
                            {[
                              {
                                label: "Atmosphere State",
                                value: weatherForecast ? weatherForecast.list[0].weather[0].description : weatherCondition.sky,
                              },
                              {
                                label: "Feels-like index",
                                value: weatherForecast ? `${Math.round(weatherForecast.list[0].main.feels_like)}°C` : weatherCondition.feelsLike,
                              },
                              {
                                label: "Wind speed & vectors",
                                value: weatherForecast ? `${weatherForecast.list[0].wind.speed} m/s` : weatherCondition.wind,
                              },
                              {
                                label: "Humidity",
                                value: weatherForecast ? `${weatherForecast.list[0].main.humidity}%` : "55%",
                              },
                              {
                                label: "Pressure index",
                                value: weatherForecast ? `${weatherForecast.list[0].main.pressure} hPa` : "1012 hPa",
                              },
                            ].map((w) => (
                              <div key={w.label} className="flex justify-between text-xs border-b border-gray-400/5 pb-2">
                                <span className="text-gray-400 font-bold">{w.label}</span>
                                <span className="font-black capitalize">{w.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 24h & 7-Day Forecast */}
                        <div className={`lg:col-span-2 ${cardClass} flex flex-col justify-between`}>
                          <div>
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-lg font-black">Expedition 24-Hour Forecast</h4>
                              <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                                <Wind className="w-3.5 h-3.5" /> Pass advisories active
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                              {WEATHER_HOURLY.map((hr: { time: string; temp: string; rain: string; wind: string; condition: string; icon: string }, idx: number) => {
                                const isNight = idx >= 4;
                                // Override temp if real forecast data is loaded
                                const displayTemp = weatherForecast 
                                  ? `${Math.round(weatherForecast.list[idx].main.temp)}°C`
                                  : hr.temp;
                                const displayIcon = weatherForecast
                                  ? weatherForecast.list[idx].weather[0].main === "Rain" ? "🌧️" : "☀️"
                                  : hr.icon;
                                
                                return (
                                  <div
                                    key={idx}
                                    className={`border rounded-2xl p-4 text-center flex flex-col items-center hover:scale-[1.04] transition-all duration-200 cursor-default ${
                                      headlightOn
                                        ? isNight
                                          ? "bg-indigo-950/40 border-indigo-800/20 shadow-md shadow-indigo-900/20"
                                          : "bg-sky-900/20 border-sky-800/15 shadow-md shadow-sky-900/10"
                                        : "bg-white border-black/8 shadow-sm"
                                    }`}
                                  >
                                    <span className="text-[10px] text-gray-400 font-bold">{hr.time}</span>
                                    <span className="text-2xl my-2 inline-block animate-weather-float" style={{ animationDelay: `${idx * 0.3}s` }}>
                                      {displayIcon}
                                    </span>
                                    <span className="text-sm font-black">{displayTemp}</span>
                                    <span className="text-[8px] text-sky-400 font-bold mt-1.5 flex items-center gap-0.5">
                                      <Droplets className="w-2.5 h-2.5" /> {hr.rain}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          <div className="mt-6 p-4 bg-orange-600/10 border border-orange-500/25 rounded-2xl">
                            <h5 className="text-xs font-black text-[#FF6B00] uppercase tracking-wider mb-1.5">Rider Safety Advisory</h5>
                            <p className="text-xs text-[#FF6B00]/90 font-medium leading-relaxed">
                              Tension index at High Pass is reporting moderate crosswinds. Keep side pannier loads firmly balanced. Rain probabilities shift depending on solar peaks. Secure visor filters and lower speed bounds on gravel.
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* 7-Day Forecast */}
                      <div>
                        <h4 className="text-lg font-black mb-6">7-Day Mountain Outlook</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
                          {[
                            { day: "Wed, Jul 15", temp: "19°C / 12°C", icon: "🌤️", cond: "Partly Sunny" },
                            { day: "Thu, Jul 16", temp: "21°C / 13°C", icon: "☀️", cond: "Bright Sunny" },
                            { day: "Fri, Jul 17", temp: "18°C / 11°C", icon: "🌦️", cond: "Light Showers" },
                            { day: "Sat, Jul 18", temp: "16°C / 9°C", icon: "🌧️", cond: "Heavy Showers" },
                            { day: "Sun, Jul 19", temp: "19°C / 12°C", icon: "⛅", cond: "Scattered Clouds" },
                            { day: "Mon, Jul 20", temp: "20°C / 13°C", icon: "☀️", cond: "Sunny Skies" },
                            { day: "Tue, Jul 21", temp: "18°C / 10°C", icon: "⛈️", cond: "Lightning Storm" },
                          ].map((d, i) => (
                            <div key={i} className={`border rounded-2xl p-5 backdrop-blur-md hover:scale-[1.03] transition-all duration-200 ${
                              headlightOn ? "bg-[#0A131F]/50 border-[#16324F]/30 text-white" : "bg-white border-black/10 text-[#0B1520]"
                            }`}>
                              <p className="text-[10px] text-gray-400 font-black leading-none">{d.day}</p>
                              <span className="text-3xl my-3 block">{d.icon}</span>
                              <p className="text-sm font-black">{d.temp}</p>
                              <p className="text-[9px] text-[#FF6B00] font-black uppercase mt-1.5 tracking-wider">{d.cond}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ── 5. RIDE JOURNAL TAB ── */}
                  {activeTab === "Ride Journal" && (
                    <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-black">Ride Journal</h2>
                          <p className="text-xs text-gray-400 font-semibold mt-1">Logs of completed expeditions and lean-angle stats.</p>
                        </div>
                        <button
                          onClick={() => setShowAddJournal(!showAddJournal)}
                          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow shadow-[#FF6B00]/15 transition-all"
                        >
                          <Plus className="w-4 h-4" /> {showAddJournal ? "Close Panel" : "Log New Ride"}
                        </button>
                      </div>

                      {/* Timeline filters */}
                      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-black/10 border border-white/5">
                        <div className="flex items-center gap-2 bg-black/20 border border-white/5 rounded-xl px-3 py-1.5 flex-1 max-w-[320px]">
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Filter logs by keyword..."
                            value={journalQuery}
                            onChange={(e) => setJournalQuery(e.target.value)}
                            className="bg-transparent text-xs focus:outline-none w-full text-white"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Motorcycle:</span>
                          <select
                            value={journalBikeFilter}
                            onChange={(e) => setJournalBikeFilter(e.target.value)}
                            className={`border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                              headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                            }`}
                          >
                            <option value="All">All Fleet</option>
                            {MOTORCYCLES.map(b => (
                              <option key={b.id} value={b.name}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {showAddJournal && (
                        <div className={cardClass}>
                          <h4 className="text-lg font-black mb-6">Log Completed Expedition</h4>
                          <form onSubmit={handleAddJournal} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { label: "Route Title", val: newJournalTitle, set: setNewJournalTitle, placeholder: "e.g. Rohtang Pass Ridge climb", required: true },
                              { label: "Date", val: newJournalDate, set: setNewJournalDate, placeholder: "", required: true, type: "date" },
                              { label: "Distance (km)", val: newJournalDist, set: setNewJournalDist, placeholder: "e.g. 140", required: false },
                              { label: "Max Lean Angle (°)", val: newJournalLean, set: setNewJournalLean, placeholder: "e.g. 42", required: false },
                              { label: "Peak Elevation Climb (m)", val: newJournalElev, set: setNewJournalElev, placeholder: "e.g. 3900", required: false },
                            ].map((f) => (
                              <div key={f.label} className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">{f.label}</label>
                                <input
                                  type={f.type || "text"}
                                  required={f.required}
                                  value={f.val}
                                  onChange={(e) => f.set(e.target.value)}
                                  placeholder={f.placeholder}
                                  className={`theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                    headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                  }`}
                                />
                              </div>
                            ))}

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Select Scenic Photo</label>
                              <div className="grid grid-cols-4 gap-2">
                                {SCENIC_IMAGES.map((img) => (
                                  <div
                                    key={img}
                                    onClick={() => setNewJournalImage(img)}
                                    className={`relative h-11 rounded-lg overflow-hidden cursor-pointer border ${
                                      newJournalImage === img ? "border-[#FF6B00] ring-1 ring-[#FF6B00]" : "border-transparent"
                                    }`}
                                  >
                                    <Image src={img} alt="Scenic selection" fill className="object-cover" />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="md:col-span-3 flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Expedition Diary Notes</label>
                              <textarea
                                value={newJournalNotes}
                                onChange={(e) => setNewJournalNotes(e.target.value)}
                                placeholder="Write ride conditions, road types, throttle behaviors..."
                                rows={3}
                                className={`theme-transition border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                            </div>
                            
                            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                              <button
                                type="button"
                                onClick={() => setShowAddJournal(false)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black border ${
                                  headlightOn ? "border-white/10 text-white hover:bg-white/5" : "border-black/10 text-[#0B1520] hover:bg-black/5"
                                }`}
                              >
                                Cancel
                              </button>
                              <button type="submit" className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow shadow-[#FF6B00]/25 transition-all">
                                Save Log
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Timeline layout vertical */}
                      <div className="relative pl-8 md:pl-12 border-l border-gray-400/10 space-y-8 py-2">
                        {filteredJournal.map((log, idx) => {
                          const isLast = idx === filteredJournal.length - 1;
                          return (
                            <div key={log.id} className="relative">
                              
                              {/* Timeline indicator node */}
                              <div className={`absolute -left-[45px] md:-left-[61px] top-1.5 w-[26px] h-[26px] rounded-full border-4 border-gray-800 bg-[#FF6B00] flex items-center justify-center font-bold text-[9px] text-white shadow-md shadow-[#FF6B00]/30 z-10 ${
                                isLast ? "" : "timeline-dot"
                              }`} />

                              {/* Card content */}
                              <div className={`${cardClass} hover:scale-[1.01] transition-transform duration-300`}>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                  
                                  {log.image && (
                                    <div className="md:col-span-3 relative h-28 rounded-2xl overflow-hidden border border-white/5">
                                      <Image src={log.image} alt={log.title} fill className="object-cover" />
                                    </div>
                                  )}

                                  <div className={log.image ? "md:col-span-9 space-y-3" : "md:col-span-12 space-y-3"}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-gray-400/10 pb-3">
                                      <div>
                                        <h4 className="text-base font-black leading-tight text-[#FF6B00]">{log.title}</h4>
                                        <p className="text-[10px] text-gray-400 font-semibold mt-1">{log.date} · {log.motorcycle}</p>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 text-[10px] font-black">
                                        <span className="bg-black/45 border border-white/5 text-gray-300 px-3 py-1.5 rounded-full">
                                          Dist: {log.distance} km
                                        </span>
                                        <span className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] px-3 py-1.5 rounded-full">
                                          Lean: {log.leanAngle}°
                                        </span>
                                        <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1.5 rounded-full">
                                          Alt: {log.elevation}m
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-xs leading-relaxed text-gray-300 font-medium">{log.notes}</p>
                                  </div>

                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── 6. PACKING ASSISTANT TAB (Circular Progress) ── */}
                  {activeTab === "Packing Assistant" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Circular progress specifications */}
                        <div className={`${cardClass} flex flex-col justify-between items-center text-center`}>
                          <div className="w-full text-left">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Active Cargo Constraint</span>
                            <h4 className="text-xl font-black mt-1 leading-none">{activeBike.name} loadout</h4>
                            <p className="text-xs text-gray-400 mt-1 font-semibold">{activeBike.luggage}</p>
                          </div>

                          {/* SVG circular progress indicator */}
                          <div className="relative my-8 flex items-center justify-center">
                            <svg className="w-28 h-28 transform -rotate-90">
                              <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                className="stroke-gray-500/10 fill-none"
                                strokeWidth={strokeWidth}
                              />
                              <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                className="stroke-[#FF6B00] fill-none transition-all duration-500 ease-out"
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-2xl font-black text-white">{packingPercent}%</span>
                              <span className="text-[8px] uppercase text-gray-400 font-bold">Packed</span>
                            </div>
                          </div>

                          <div className="p-4 bg-[#FF6B00]/10 border border-[#FF6B00]/25 rounded-2xl text-left w-full">
                            <h5 className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest mb-1.5">Cargo Recommendation</h5>
                            <p className="text-[10px] text-[#FF6B00]/90 font-medium leading-relaxed">
                              {activeBike.id === "bmw_gs" && "GS Aluminum Cases: Keep heaviest engine guards & tool kits lower. Split pannier volumes."}
                              {activeBike.id === "ktm_duke" && "Duke Naked tail pack: Restrict items to lightweight gear. Wear modular backpack."}
                              {activeBike.id === "re_himalayan" && "Himalayan Sherpa carriers: Hardcore steel side cases. Increase rear suspension pre-load factor."}
                              {activeBike.id === "apache_rr310" && "SuperSport Race Pack: Keep weight low. Tail pack limits speeds. Ride aerodynamically."}
                              {activeBike.id === "honda_cb350" && "Roadster Classic Canvas: Secure straps from hot exhaust shields."}
                            </p>
                          </div>
                        </div>

                        {/* Interactive checklist lists */}
                        <div className={`lg:col-span-2 ${cardClass}`}>
                          <h4 className="text-lg font-black mb-6 pb-4 border-b border-gray-400/10">Expedition Checklists</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              {[
                                { title: "🛡️ Riding Gear", cat: "gear" as const },
                                { title: "📋 Documentation", cat: "docs" as const },
                              ].map(({ title, cat }) => (
                                <div key={cat}>
                                  <h5 className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-3">{title}</h5>
                                  <div className="space-y-2">
                                    {packingItems.filter((i) => i.category === cat).map((item) => (
                                      <label key={item.id} className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                                        item.packed
                                          ? headlightOn ? "bg-[#FF6B00]/8 border-[#FF6B00]/20" : "bg-orange-50 border-orange-100"
                                          : headlightOn ? "bg-white/3 border-white/5 hover:bg-white/6" : "bg-gray-50/80 border-black/5 hover:bg-gray-100/80"
                                      }`}>
                                        <input type="checkbox" checked={item.packed} onChange={() => togglePackItem(item.id)} className="checkbox-premium" />
                                        <span className={`text-xs font-semibold transition-all ${item.packed ? "line-through text-gray-500" : headlightOn ? "text-white" : "text-[#0B1520]"}`}>{item.name}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-6">
                              {[
                                { title: "🔧 Tools & Spares", cat: "tools" as const },
                                { title: "🩹 Personal & Medical", cat: "personal" as const },
                              ].map(({ title, cat }) => (
                                <div key={cat}>
                                  <h5 className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-3">{title}</h5>
                                  <div className="space-y-2">
                                    {packingItems.filter((i) => i.category === cat).map((item) => (
                                      <label key={item.id} className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                                        item.packed
                                          ? headlightOn ? "bg-[#FF6B00]/8 border-[#FF6B00]/20" : "bg-orange-50 border-orange-100"
                                          : headlightOn ? "bg-white/3 border-white/5 hover:bg-white/6" : "bg-gray-50/80 border-black/5 hover:bg-gray-100/80"
                                      }`}>
                                        <input type="checkbox" checked={item.packed} onChange={() => togglePackItem(item.id)} className="checkbox-premium" />
                                        <span className={`text-xs font-semibold transition-all ${item.packed ? "line-through text-gray-500" : headlightOn ? "text-white" : "text-[#0B1520]"}`}>{item.name}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 7. EMERGENCY SOS TAB (Leaflet Location Preview) ── */}
                  {activeTab === "Emergency SOS" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Leaflet map preview coordinate location */}
                      <div className={`${cardClass} h-fit flex flex-col justify-between gap-6`}>
                        <div className="flex justify-between items-center border-b border-gray-400/10 pb-4">
                          <h4 className="text-lg font-black">GPS Satellite Coordinates</h4>
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">Active</span>
                        </div>
                        
                        {/* Interactive mini map of current coords */}
                        <div className="h-[220px] rounded-2xl overflow-hidden border border-white/5 bg-[#070e17] relative z-10">
                          <div ref={sosMapContainerRef} className="w-full h-full" />
                        </div>

                        <div className="space-y-3.5">
                          {[
                            { label: "Active Latitude Lock", value: gpsCoords.lat },
                            { label: "Active Longitude Lock", value: gpsCoords.lng },
                            { label: "Satellite Elevation Index", value: gpsCoords.alt },
                            { label: "Signal Strength (IRIDIUM)", value: "98% (Excellent)" },
                            { label: "Active Device Sync", value: activeBike.name },
                          ].map((loc) => (
                            <div key={loc.label} className="border-b border-gray-400/5 pb-2 flex justify-between text-xs">
                              <span className="text-gray-400 font-bold">{loc.label}</span>
                              <span className="font-black text-white">{loc.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-8">
                        <div className={`border rounded-3xl p-8 backdrop-blur-xl shadow-2xl min-h-[380px] flex flex-col justify-between transition-colors duration-500 ${
                          sosActive
                            ? "bg-red-950/80 border-red-500/40 text-white"
                            : headlightOn
                            ? "bg-[#0A131F]/80 border-[#16324F]/30 text-white shadow-black/30"
                            : "bg-white border-black/10 text-[#0B1520]"
                        }`}>
                          <div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-400/10 mb-6">
                              <h4 className="text-lg font-black text-red-500">Emergency Satellite Dispatch</h4>
                              <span className="text-xs text-gray-400 font-bold uppercase">Distress Beacon</span>
                            </div>

                            {!sosTriggered && !sosActive && (
                              <div className="text-center py-10 max-w-md mx-auto">
                                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                                <h5 className="text-sm font-black uppercase tracking-wider mb-2 text-white">Emergency Response Warning</h5>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">Triggering the SOS dispatch system transmits coordinates to Himalayan Search & Rescue networks. Only utilize in critical distress situations.</p>
                              </div>
                            )}

                            {sosTriggered && !sosActive && (
                              <div className="text-center py-10">
                                <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center font-black text-4xl text-red-500 mx-auto mb-4 animate-ping">{sosCountdown}</div>
                                <h5 className="text-sm font-black uppercase tracking-wider text-red-500">Transmitting Satellite Signal...</h5>
                                <p className="text-xs text-gray-400 mt-2">Click Cancel SOS immediately to abort launch sequence.</p>
                              </div>
                            )}

                            {sosActive && (
                              <div className="text-center py-6">
                                <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                                  <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" />
                                  <div className="absolute inset-2 rounded-full border-2 border-red-500/50 animate-pulse" />
                                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                                <h5 className="text-base font-black uppercase tracking-wider text-red-400">SOS ACTIVE & TRANSMITTING</h5>
                                <p className="text-xs text-white/80 max-w-md mx-auto mt-2 leading-relaxed font-bold">
                                  Emergency GPS: {gpsCoords.lat}, {gpsCoords.lng} ({gpsCoords.alt}) transmitted to Himalayan Rescuers. Dispatching search team. Helicopter unit notified.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-center gap-4 mt-6">
                            {!sosTriggered && !sosActive ? (
                              <button onClick={triggerSos} className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-widest uppercase rounded-2xl shadow-lg shadow-red-600/35 transition-colors">
                                Trigger Satellite SOS
                              </button>
                            ) : (
                              <button onClick={cancelSos} className="px-8 py-4 bg-black/60 border border-white/10 hover:border-white/20 text-white font-black text-sm tracking-widest uppercase rounded-2xl transition-all">
                                Cancel SOS Transmission
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={`${cardClass}`}>
                          <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 border-b border-gray-400/5 pb-2">Himalayan Emergency Registry</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            {[
                              { title: "Himalayan Rescue Command", number: "+91-177-2621401" },
                              { title: "Kaza Local Police Station", number: "+91-1906-222212" },
                              { title: "Manali Alpine Medical", number: "+91-1902-253385" },
                            ].map((call) => (
                              <div key={call.title} className="p-3 bg-black/15 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                  <p className="font-black text-[10px] text-gray-400">{call.title}</p>
                                  <p className="font-bold text-white mt-0.5">{call.number}</p>
                                </div>
                                <a href={`tel:${call.number}`} className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── 8. SETTINGS TAB (OpenWeather API key setup) ── */}
                  {activeTab === "Settings" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      
                      {/* OpenWeather setup */}
                      <div className={cardClass}>
                        <h3 className="text-xl font-black mb-6">Meteorological Settings</h3>
                        <form onSubmit={handleSaveApiKey} className="space-y-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                              OpenWeather Map API Key
                            </label>
                            <input
                              type="text"
                              value={openWeatherApiKey}
                              onChange={(e) => setOpenWeatherApiKey(e.target.value)}
                              placeholder="Enter your appid API key..."
                              className={`theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                              }`}
                            />
                            <p className="text-[10px] text-gray-500 leading-relaxed font-semibold mt-1">
                              Paste an OpenWeather API key to load live mountain conditions. If left blank, the dashboard automatically utilizes pre-computed Spiti valley metrics.
                            </p>
                          </div>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow shadow-[#FF6B00]/25 transition-all"
                          >
                            Save API Key
                          </button>
                        </form>
                      </div>

                      {/* App preferences settings */}
                      <div className={cardClass}>
                        <h3 className="text-xl font-black mb-6">Preferences</h3>
                        <div className="space-y-5">
                          {/* Theme settings */}
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/15 border border-white/5">
                            <div>
                              <p className="text-sm font-black">Headlight Theme</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Switch between Day and Night mode</p>
                            </div>
                            <button
                              onClick={handleToggleHeadlight}
                              className={`relative flex items-center rounded-xl overflow-hidden border transition-all duration-700 ${
                                headlightOn ? "border-[#FF6B00]/35" : "border-black/10"
                              }`}
                            >
                              <div className={`flex items-center gap-1.5 px-3 py-2 transition-all duration-700 ${!headlightOn ? "bg-amber-50 text-amber-700" : "bg-black/20 text-white/25"}`}>
                                <Sun className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black">Day</span>
                              </div>
                              <div className={`w-px self-stretch transition-colors duration-700 ${headlightOn ? "bg-[#FF6B00]/20" : "bg-black/10"}`} />
                              <div className={`flex items-center gap-1.5 px-3 py-2 transition-all duration-700 ${headlightOn ? "bg-[#FF6B00]/15 text-[#FF6B00]" : "bg-white/10 text-gray-400"}`}>
                                <Zap className={`w-3.5 h-3.5 ${headlightOn ? "fill-[#FF6B00]" : ""}`} />
                                <span className="text-[10px] font-black">Night</span>
                              </div>
                            </button>
                          </div>

                          {/* Active Bike selector */}
                          <div className="p-4 rounded-2xl bg-black/15 border border-white/5">
                            <p className="text-sm font-black mb-3">Active Motorcycle</p>
                            <div className="grid grid-cols-1 gap-2">
                              {MOTORCYCLES.map((bike) => (
                                <button
                                  key={bike.id}
                                  onClick={() => handleSelectBike(bike)}
                                  className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                                    activeBike.id === bike.id
                                      ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]"
                                      : headlightOn
                                      ? "border-white/5 hover:bg-white/5 text-white/60 hover:text-white"
                                      : "border-black/5 hover:bg-black/5 text-gray-500 hover:text-[#0B1520]"
                                  }`}
                                >
                                  <Bike className={`w-4 h-4 flex-shrink-0 ${activeBike.id === bike.id ? "text-[#FF6B00]" : ""}`} />
                                  <span className="truncate">{bike.name}</span>
                                  {activeBike.id === bike.id && <span className="ml-auto text-[8px] font-black bg-[#FF6B00] text-white px-2 py-0.5 rounded-full">Active</span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Logout button */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black text-red-400 border border-red-500/20 hover:bg-red-50/10 hover:border-red-500/35 transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ════════════════════════════════════════════
          FLOATING GLOBAL AI CHATBOX
      ════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        
        <AnimatePresence>
          {floatingChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`w-[340px] h-[480px] rounded-3xl border shadow-2xl backdrop-blur-2xl flex flex-col justify-between p-5 pointer-events-auto ${
                headlightOn
                  ? "bg-[#080F19]/95 border-[#16324F]/50 text-white shadow-black/50"
                  : "bg-white border-black/10 text-[#0B1520] shadow-black/15"
              }`}
            >
              <div className="flex justify-between items-center border-b border-gray-400/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black">AI Expedition Copilot</h4>
                    <p className="text-[8px] text-[#FF6B00] font-bold uppercase tracking-wider">Live Sat Link</p>
                  </div>
                </div>
                <button
                  onClick={() => setFloatingChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1 text-xs scrollbar-thin">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                        m.sender === "user"
                          ? "bg-[#FF6B00] text-white font-bold rounded-tr-none shadow-md shadow-[#FF6B00]/10"
                          : headlightOn
                          ? "bg-black/45 border border-white/5 text-white/90 rounded-tl-none"
                          : "bg-gray-100 border border-black/5 text-[#0B1520] rounded-tl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sugestion prompt chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[
                  `Range for ${activeBike.name}`,
                  "Spiti weather warnings",
                  "Tools checklists",
                ].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSendChat(sug)}
                    className="text-[9px] font-black bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border border-[#FF6B00]/25 text-[#FF6B00] px-2.5 py-1.5 rounded-full transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Inputs form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask satellite AI..."
                  className={`flex-1 theme-transition border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                    headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                  }`}
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-[#FF6B00] hover:bg-orange-600 flex items-center justify-center flex-shrink-0 transition-colors shadow-lg shadow-[#FF6B00]/20 text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global trigger FAB */}
        <motion.button
          onClick={() => setFloatingChatOpen(!floatingChatOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B00] to-orange-700 flex items-center justify-center shadow-2xl shadow-[#FF6B00]/40 pointer-events-auto border border-white/15 cursor-pointer relative"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
        </motion.button>

      </div>

      {/* ════════════════════════════════════════════
          MOBILE MENU DRAWER
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            <div onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 bg-[#060D15] h-full flex flex-col justify-between p-6 border-r border-[#16324F]/30 z-10 text-white"
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { setActiveTab("Overview"); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center">
                      <Map className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-black text-base text-white">RideSync</span>
                  </button>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {SIDEBAR_ITEMS.map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => { setActiveTab(item.tab); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                        activeTab === item.tab
                          ? "text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/25"
                          : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 scale-[0.8]">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div>
                <div className="border-t border-[#16324F]/25 pt-4 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    <span className="font-black text-xs text-[#FF6B00]">{userInitials}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{displayName}</span>
                    <span className="text-[10px] text-white/50 truncate">@{username}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Account</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Motorcycle Modal ── */}
      <AnimatePresence>
        {showAddBike && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div onClick={() => setShowAddBike(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-md border rounded-[28px] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 z-10 ${
                headlightOn ? "bg-[#080F19]/95 border-[#16324F]/50 text-white" : "bg-white border-black/10 text-[#0B1520]"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-base font-black">Add New Motorcycle</h4>
                <button onClick={() => setShowAddBike(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddBike} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Brand</label>
                    <input
                      type="text"
                      required
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="e.g. BMW"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Model</label>
                    <input
                      type="text"
                      required
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      placeholder="e.g. R1250 GS"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Year</label>
                    <input
                      type="text"
                      required
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Engine CC</label>
                    <input
                      type="text"
                      required
                      value={formEngineCc}
                      onChange={(e) => setFormEngineCc(e.target.value)}
                      placeholder="e.g. 1254"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={formRegNumber}
                    onChange={(e) => setFormRegNumber(e.target.value)}
                    placeholder="e.g. MH-12-RS-1250"
                    className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                      headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Select Bike Profile Image</label>
                  <select
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                      headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                    }`}
                  >
                    <option value="/bikes/bmw_gs.png">BMW GS Trophy</option>
                    <option value="/bikes/ktm_duke.png">KTM Duke Beast</option>
                    <option value="/bikes/re_himalayan.png">RE Himalayan Sherpa</option>
                    <option value="/bikes/apache_rr310.png">Apache RR310 Race</option>
                    <option value="/bikes/honda_cb350.png">Honda CB350 H&apos;ness</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBike(false)}
                    className={`px-4 py-2 rounded-xl border ${
                      headlightOn ? "border-white/10 text-white hover:bg-white/5" : "border-black/10 text-[#0B1520] hover:bg-black/5"
                    }`}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-black rounded-xl">
                    Add Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Motorcycle Modal ── */}
      <AnimatePresence>
        {showEditBike && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div onClick={() => setShowEditBike(null)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-md border rounded-[28px] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 z-10 ${
                headlightOn ? "bg-[#080F19]/95 border-[#16324F]/50 text-white" : "bg-white border-black/10 text-[#0B1520]"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-base font-black">Edit Motorcycle Details</h4>
                <button onClick={() => setShowEditBike(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditBike} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Brand</label>
                    <input
                      type="text"
                      required
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="e.g. BMW"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Model</label>
                    <input
                      type="text"
                      required
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      placeholder="e.g. R1250 GS"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Year</label>
                    <input
                      type="text"
                      required
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Engine CC</label>
                    <input
                      type="text"
                      required
                      value={formEngineCc}
                      onChange={(e) => setFormEngineCc(e.target.value)}
                      placeholder="e.g. 1254"
                      className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                        headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={formRegNumber}
                    onChange={(e) => setFormRegNumber(e.target.value)}
                    placeholder="e.g. MH-12-RS-1250"
                    className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                      headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Select Bike Profile Image</label>
                  <select
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className={`border rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] ${
                      headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                    }`}
                  >
                    <option value="/bikes/bmw_gs.png">BMW GS Trophy</option>
                    <option value="/bikes/ktm_duke.png">KTM Duke Beast</option>
                    <option value="/bikes/re_himalayan.png">RE Himalayan Sherpa</option>
                    <option value="/bikes/apache_rr310.png">Apache RR310 Race</option>
                    <option value="/bikes/honda_cb350.png">Honda CB350 H&apos;ness</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditBike(null)}
                    className={`px-4 py-2 rounded-xl border ${
                      headlightOn ? "border-white/10 text-white hover:bg-white/5" : "border-black/10 text-[#0B1520] hover:bg-black/5"
                    }`}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-black rounded-xl">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
