"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Thermometer,
  Star,
  Heart,
  Info,
  Save,
  Upload,
  Volume2,
  Shield,
  Mail,
  User,
} from "lucide-react";
import type L from "leaflet";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* â”€â”€â”€ Predefined Landmark Coordinates for Route Mapping â”€â”€â”€ */


/* â”€â”€â”€ Predefined Ride Images for Journal â”€â”€â”€ */
const SCENIC_IMAGES = [
  "/hero_day.png",
  "/hero_night.png",
  "/hero_rider_standing.png",
  "/hero_rider_ghat.png",
];

/* â”€â”€â”€ Interfaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  leanAngle?: string;
  elevation: string;
  notes: string;
  image?: string;
  motorcycle: string;
  rating?: number;
  favorite?: boolean;
  isRoute?: boolean;
  start?: string;
  end?: string;
  coordinates?: [number, number][];
  option?: "Scenic" | "Fastest" | "Highway";
  duration?: string;
  roadType?: string;
  fuelCost?: number;
  fuelRequired?: number;
}

interface SavedRoute {
  id: string;
  name: string;
  start: string;
  end: string;
  coordinates: [number, number][];
  option: "Scenic" | "Fastest" | "Highway";
  distance: string;
  duration: string;
  roadType: string;
  elevation: string;
  fuelCost: number;
  fuelRequired: number;
  date: string;
  motorcycle: string;
}

interface PackingItem {
  id: string;
  name: string;
  category: "gear" | "tools" | "docs" | "personal";
  packed: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

interface OpenWeatherForecast {
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    wind: {
      speed: number;
    };
    visibility: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    pop?: number;
  }>;
}

/* â”€â”€â”€ Constants & Reference Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
    rating: 5,
    favorite: true,
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
    rating: 4,
    favorite: false,
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
    rating: 5,
    favorite: true,
  },
];

const PACKING_TEMPLATES = {
  "Mountain Climb": [
    { id: "t1", name: "Heavy Woolen Socks & Thermals", category: "gear" as const, packed: false },
    { id: "t2", name: "High-Altitude Oxygen Canister", category: "personal" as const, packed: false },
    { id: "t3", name: "Chain Pulley & Tow Strap", category: "tools" as const, packed: false },
    { id: "t4", name: "Warm Balaclava / Neck Gaiter", category: "gear" as const, packed: false },
  ],
  "Coastal Cruise": [
    { id: "t1", name: "Sunscreen & Sunglasses", category: "personal" as const, packed: false },
    { id: "t2", name: "Microfiber Quick-dry Towel", category: "personal" as const, packed: false },
    { id: "t3", name: "Visor Cleaner Spray", category: "tools" as const, packed: false },
    { id: "t4", name: "Lightweight Mesh Riding Jacket", category: "gear" as const, packed: false },
  ],
  "Weekend Getaway": [
    { id: "t1", name: "Casual Clothes & Toiletries", category: "personal" as const, packed: false },
    { id: "t2", name: "Mobile Charger & Powerbank", category: "personal" as const, packed: false },
    { id: "t3", name: "Puncture Repair Kit", category: "tools" as const, packed: false },
    { id: "t4", name: "Copy of Hotel Booking", category: "docs" as const, packed: false },
  ]
};

const weatherCondition = {
  temp: "18Â°C",
  sky: "Partly Cloudy",
  wind: "16 km/h NNE",
  rainChance: "15%",
  feelsLike: "16Â°C",
  visibility: "12 km",
};

const formatTime = (timestamp: number): string => {
  if (!timestamp) return "--:--";
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const generateMockForecast = (city: string): OpenWeatherForecast => {
  const cleanCity = city.replace(/\s*(base\s*camp|camp|circuit|expedition|valley)\s*/i, "").trim() || city;
  const isSpiti = cleanCity.toLowerCase().includes("spiti") || cleanCity.toLowerCase().includes("kaza");
  const isLadakh = cleanCity.toLowerCase().includes("ladakh") || cleanCity.toLowerCase().includes("leh");
  const isGoa = cleanCity.toLowerCase().includes("goa");

  let baseTemp = 18;
  let humidity = 55;
  let pressure = 1012;
  let windSpeed = 3.5;
  let visibility = 10000;
  let description = "partly cloudy";
  let mainCondition = "Clouds";
  
  if (isSpiti || isLadakh) {
    baseTemp = 8;
    humidity = 35;
    pressure = 998;
    windSpeed = 7.2;
    visibility = 12000;
    description = "overcast clouds";
    mainCondition = "Clouds";
  } else if (isGoa) {
    baseTemp = 29;
    humidity = 85;
    pressure = 1009;
    windSpeed = 2.4;
    visibility = 8000;
    description = "heavy rain";
    mainCondition = "Rain";
  }

  const list = [];
  const now = Math.floor(Date.now() / 1000);
  for (let i = 0; i < 8; i++) {
    const dt = now + i * 3 * 3600;
    const tempVar = Math.sin(i) * 3;
    list.push({
      dt,
      main: {
        temp: baseTemp + tempVar,
        feels_like: baseTemp + tempVar - 1.5,
        humidity: Math.min(100, Math.max(10, humidity + Math.round(Math.sin(i) * 5))),
        pressure: pressure + Math.round(Math.cos(i) * 2),
      },
      wind: {
        speed: parseFloat((windSpeed + Math.sin(i) * 1.5).toFixed(1)),
      },
      visibility,
      weather: [{
        main: mainCondition,
        description: description,
        icon: mainCondition === "Rain" ? "10d" : "03d",
      }],
      pop: mainCondition === "Rain" ? 0.8 : 0.15,
    });
  }

  return {
    city: {
      name: cleanCity,
      country: isSpiti || isLadakh || isGoa ? "IN" : "US",
      sunrise: now - (now % 86400) + 6 * 3600 + 32 * 60,
      sunset: now - (now % 86400) + 18 * 3600 + 45 * 60,
    },
    list,
  };
};

const getDailyForecasts = (forecastList: OpenWeatherForecast['list']) => {
  const daily: OpenWeatherForecast['list'] = [];
  const datesSeen = new Set<string>();

  for (const item of forecastList) {
    const date = new Date(item.dt * 1000);
    const dateString = date.toDateString();
    const hours = date.getHours();
    
    if (!datesSeen.has(dateString)) {
      datesSeen.add(dateString);
      daily.push(item);
    } else {
      const idx = daily.findIndex(d => new Date(d.dt * 1000).toDateString() === dateString);
      const existingDate = new Date(daily[idx].dt * 1000);
      const existingDiff = Math.abs(existingDate.getHours() - 12);
      const currentDiff = Math.abs(hours - 12);
      if (currentDiff < existingDiff) {
        daily[idx] = item;
      }
    }
  }
  return daily;
};

const get7DayForecast = (forecastList: OpenWeatherForecast['list'] | null, destName: string) => {
  if (forecastList && forecastList.length > 0) {
    const dailyData = getDailyForecasts(forecastList);
    const results = dailyData.map((item) => {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      return {
        day: dayName,
        temp: `${Math.round(item.main.temp)}Â°C`,
        icon: item.weather[0].main === "Rain" ? "ðŸŒ§ï¸" : item.weather[0].main === "Clouds" ? "â›…" : "â˜€ï¸",
        cond: item.weather[0].description,
      };
    });
    
    while (results.length < 7) {
      const lastItem = dailyData[dailyData.length - 1] || ({ dt: Date.now() / 1000, main: { temp: 18, feels_like: 16.5, humidity: 55, pressure: 1012 }, wind: { speed: 3.5 }, visibility: 10000, weather: [{ main: "Clouds", description: "cloudy", icon: "03d" }] } as OpenWeatherForecast['list'][number]);
      const lastDate = new Date(lastItem.dt * 1000);
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + (results.length - dailyData.length + 1));
      
      const dayName = nextDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      const variance = Math.round((Math.random() * 4 - 2));
      const tempVal = Math.round(lastItem.main.temp) + variance;
      
      const conds = [
        { icon: "â˜€ï¸", cond: "Sunny Skies" },
        { icon: "â›…", cond: "Scattered Clouds" },
        { icon: "ðŸŒ¤ï¸", cond: "Partly Sunny" }
      ];
      const selectedCond = conds[results.length % conds.length];
      
      results.push({
        day: dayName,
        temp: `${tempVal}Â°C`,
        icon: selectedCond.icon,
        cond: selectedCond.cond,
      });
    }
    return results;
  }
  
  const results = [];
  const baseDate = new Date();
  const isSpiti = destName.toLowerCase().includes("spiti");
  const isGoa = destName.toLowerCase().includes("goa");
  const isLadakh = destName.toLowerCase().includes("ladakh");
  
  let tempRange = { min: 15, max: 22 };
  let defaultConds = [
    { icon: "ðŸŒ¤ï¸", cond: "Partly Sunny" },
    { icon: "â˜€ï¸", cond: "Bright Sunny" },
    { icon: "â›…", cond: "Scattered Clouds" },
    { icon: "ðŸŒ§ï¸", cond: "Light Showers" },
    { icon: "â›…", cond: "Partly Cloudy" },
    { icon: "â˜€ï¸", cond: "Clear Skies" },
    { icon: "â›ˆï¸", cond: "Lightning Storm" }
  ];
  
  if (isSpiti || isLadakh) {
    tempRange = { min: 5, max: 15 };
    defaultConds = [
      { icon: "â„ï¸", cond: "Chilly / Clear" },
      { icon: "ðŸ’¨", cond: "Gale Winds" },
      { icon: "â›…", cond: "Overcast" },
      { icon: "ðŸ”ï¸", cond: "Mountain Snow" },
      { icon: "â˜€ï¸", cond: "Clear Sunny" },
      { icon: "â›…", cond: "Passing Clouds" },
      { icon: "ðŸŒ¬ï¸", cond: "High Winds" }
    ];
  } else if (isGoa) {
    tempRange = { min: 26, max: 32 };
    defaultConds = [
      { icon: "â˜€ï¸", cond: "Tropical Sun" },
      { icon: "ðŸŒ§ï¸", cond: "Heavy Monsoon" },
      { icon: "â›…", cond: "Humid / Overcast" },
      { icon: "ðŸŒ§ï¸", cond: "Coastal Rain" },
      { icon: "â˜€ï¸", cond: "Clear Coastal" },
      { icon: "â›…", cond: "Scattered Clouds" },
      { icon: "ðŸŒ¤ï¸", cond: "Warm Sun" }
    ];
  }
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + i);
    const dayName = nextDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const tempVal = Math.floor(Math.random() * (tempRange.max - tempRange.min + 1)) + tempRange.min;
    const cond = defaultConds[i % defaultConds.length];
    results.push({
      day: dayName,
      temp: `${tempVal}Â°C / ${tempVal - 6}Â°C`,
      icon: cond.icon,
      cond: cond.cond
    });
  }
  return results;
};

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

const getBikeStats = (bike: Motorcycle) => {
  const tankCap = parseFloat(bike.tank) || 15;
  const ccVal = parseInt(bike.engineCc) || 350;
  let mileage = 25;
  if (ccVal > 1000) mileage = 16;
  else if (ccVal > 500) mileage = 20;
  else if (ccVal > 400) mileage = 22;
  else if (ccVal > 300) mileage = 26;
  else if (ccVal > 200) mileage = 30;
  else mileage = 35;
  
  const maxRange = Math.round(tankCap * mileage);
  return {
    mileage,
    tankCapacity: tankCap,
    maxRange
  };
};

const fetchRoute = async (start: [number, number], end: [number, number], mode: "Scenic" | "Fastest" | "Highway") => {
  let routeCoords: [number, number][] = [];
  let distanceKm = 0;
  let durationSec = 0;
  
  const startLon = start[1];
  const startLat = start[0];
  const endLon = end[1];
  const endLat = end[0];

  let success = false;

  const orsKey = typeof window !== "undefined" ? localStorage.getItem("openRouteServiceApiKey") : null;
  if (orsKey) {
    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsKey}&start=${startLon},${startLat}&end=${endLon},${endLat}`;
      if (mode === "Scenic") {
        const midLat = (startLat + endLat) / 2;
        const midLon = (startLon + endLon) / 2;
        const offsetLat = (endLon - startLon) * 0.05;
        const offsetLon = -(endLat - startLat) * 0.05;
        const body = {
          coordinates: [[startLon, startLat], [midLon + offsetLon, midLat + offsetLat], [endLon, endLat]],
          profile: "driving-car"
        };
        const res = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": orsKey
          },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.features && data.features[0]) {
            const feat = data.features[0];
            routeCoords = feat.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            distanceKm = feat.properties.summary.distance / 1000;
            durationSec = feat.properties.summary.duration;
            success = true;
          }
        }
      } else {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.features && data.features[0]) {
            const feat = data.features[0];
            routeCoords = feat.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            distanceKm = feat.properties.summary.distance / 1000;
            durationSec = feat.properties.summary.duration;
            success = true;
          }
        }
      }
    } catch (err) {
      console.warn("OpenRouteService failed, falling back to OSRM", err);
    }
  }

  if (!success) {
    try {
      let queryCoords = `${startLon},${startLat};${endLon},${endLat}`;
      if (mode === "Scenic") {
        const midLat = (startLat + endLat) / 2;
        const midLon = (startLon + endLon) / 2;
        const offsetLat = (endLon - startLon) * 0.08;
        const offsetLon = -(endLat - startLat) * 0.08;
        queryCoords = `${startLon},${startLat};${midLon + offsetLon},${midLat + offsetLat};${endLon},${endLat}`;
      } else if (mode === "Highway") {
        const midLat = (startLat + endLat) / 2;
        const midLon = (startLon + endLon) / 2;
        const offsetLat = -(endLon - startLon) * 0.04;
        const offsetLon = (endLat - startLat) * 0.04;
        queryCoords = `${startLon},${startLat};${midLon + offsetLon},${midLat + offsetLat};${endLon},${endLat}`;
      }

      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${queryCoords}?overview=full&geometries=geojson`);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          routeCoords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          distanceKm = route.distance / 1000;
          durationSec = route.duration;
          success = true;
        }
      }
    } catch (err) {
      console.error("OSRM Routing failed:", err);
    }
  }

  if (!success) {
    throw new Error("Routing failed. Please verify your internet connection and location inputs.");
  }

  return {
    coordinates: routeCoords,
    distanceKm,
    durationSec
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error" | "offline">("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isLoadedFromCloud, setIsLoadedFromCloud] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  // User Profile
  const [displayName, setDisplayName] = useState("Adventure Pilot");
  const [username, setUsername] = useState("Explorer");
  const [userInitials, setUserInitials] = useState("AP");
  const [riderEmail, setRiderEmail] = useState("pilot@ridesync.ai");
  const [riderPhone, setRiderPhone] = useState("+91-98765-43210");
  const [riderBloodGroup, setRiderBloodGroup] = useState("O+");
  const [riderBio, setRiderBio] = useState("Himalayan tourer, mountain explorer, asphalt enthusiast.");

  // Preferences Units
  const [distanceUnit, setDistanceUnit] = useState<"km" | "mi">("km");
  const [tempUnit, setTempUnit] = useState<"°C" | "°F">("°C");

  // Map & Route Settings
  const [mapTileProvider, setMapTileProvider] = useState<"osm" | "carto" | "topo">("osm");
  const [defaultRouteMode, setDefaultRouteMode] = useState<"Scenic" | "Fastest" | "Highway">("Scenic");

  // Notification Preferences
  const [notifPush, setNotifPush] = useState<boolean>(true);
  const [notifEmail, setNotifEmail] = useState<boolean>(true);
  const [notifSosAlerts, setNotifSosAlerts] = useState<boolean>(true);
  const [notifSound, setNotifSound] = useState<boolean>(true);

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
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

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
  // Saved and recent routes derived from shared journal entries below
  const [startCoords, setStartCoords] = useState<[number, number]>([32.2396, 77.1887]);
  const [endCoords, setEndCoords] = useState<[number, number]>([32.2276, 78.0706]);
  const [fuelPrice, setFuelPrice] = useState(105);
  const [fuelType, setFuelType] = useState<"Petrol" | "Diesel">("Petrol");
  const [activeRouteData, setActiveRouteData] = useState<{
    distance: string;
    duration: string;
    roadType: string;
    elevation: string;
    coordinates: [number, number][];
    fuelRequired: number;
    fuelCost: number;
    avgSpeed: string;
    fuelStopsText: string;
  } | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [fetchRouteError, setFetchRouteError] = useState<string | null>(null);
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

  const [startSuggestions, setStartSuggestions] = useState<LocationSuggestion[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<LocationSuggestion[]>([]);
  const [startTimer, setStartTimer] = useState<NodeJS.Timeout | null>(null);
  const [endTimer, setEndTimer] = useState<NodeJS.Timeout | null>(null);

  const routeError = useMemo(() => {
    if (!routeStart.trim() || !routeEnd.trim()) {
      return "Locations cannot be empty";
    }
    if (routeStart.trim().toLowerCase() === routeEnd.trim().toLowerCase() ||
        (startCoords[0] === endCoords[0] && startCoords[1] === endCoords[1])) {
      return "Start and Destination cannot be the same";
    }
    return fetchRouteError;
  }, [routeStart, routeEnd, startCoords, endCoords, fetchRouteError]);

  // Journal logs state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL);

  const savedRoutes: SavedRoute[] = useMemo(() => {
    return journalEntries
      .filter((entry) => entry.isRoute)
      .map((entry) => ({
        id: entry.id,
        name: entry.title,
        start: entry.start || "",
        end: entry.end || "",
        coordinates: entry.coordinates || [],
        option: entry.option || "Scenic",
        distance: entry.distance.includes("km") ? entry.distance : `${entry.distance} km`,
        duration: entry.duration || "0m",
        roadType: entry.roadType || "",
        elevation: entry.elevation.includes("m") ? entry.elevation : `${entry.elevation} m`,
        fuelCost: entry.fuelCost || 0,
        fuelRequired: entry.fuelRequired || 0,
        date: entry.date,
        motorcycle: entry.motorcycle
      }));
  }, [journalEntries]);

  const recentRoutes = useMemo(() => {
    return savedRoutes.slice(0, 5);
  }, [savedRoutes]);

  const journalStats = useMemo(() => {
    const totalDist = journalEntries.reduce((sum, entry) => sum + (parseFloat(entry.distance) || 0), 0);
    const avgRating = journalEntries.length > 0 
      ? (journalEntries.reduce((sum, entry) => sum + (entry.rating || 5), 0) / journalEntries.length).toFixed(1)
      : "5.0";
    const maxLean = journalEntries.reduce((max, entry) => Math.max(max, parseInt(entry.leanAngle || "0") || 0), 0);
    const totalClimb = journalEntries.reduce((sum, entry) => sum + (parseFloat(entry.elevation) || 0), 0);
    
    return {
      totalDistance: totalDist.toLocaleString(),
      avgRating,
      maxLean,
      totalClimb: totalClimb.toLocaleString(),
      totalRides: journalEntries.length
    };
  }, [journalEntries]);

  const [showAddJournal, setShowAddJournal] = useState(false);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalDate, setNewJournalDate] = useState("");
  const [newJournalDist, setNewJournalDist] = useState("");
  const [newJournalLean, setNewJournalLean] = useState("");
  const [newJournalElev, setNewJournalElev] = useState("");
  const [newJournalNotes, setNewJournalNotes] = useState("");
  const [newJournalImage, setNewJournalImage] = useState("/hero_rider_standing.png");
  const [newJournalRating, setNewJournalRating] = useState(5);
  const [newJournalFavorite, setNewJournalFavorite] = useState(false);
  const [expandedJournalId, setExpandedJournalId] = useState<string | null>(null);

  const handleToggleFavoriteJournal = (id: string) => {
    const updated = journalEntries.map((entry) =>
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    );
    setJournalEntries(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_journal", JSON.stringify(updated));
    }
  };

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
    lat: "32.2396Â° N",
    lng: "77.1887Â° E",
    alt: "3,450 m",
  });

  // Real GPS state
  const [realGpsCoords, setRealGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Emergency Contacts state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("");

  // Offline Safety Guide accordion
  const [openSafetySection, setOpenSafetySection] = useState<string | null>(null);

  // Settings states
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Leaflet refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const sosMapContainerRef = useRef<HTMLDivElement>(null);
  const sosMapInstanceRef = useRef<L.Map | null>(null);

  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const lastGeocodedStart = useRef<{ name: string; coords: [number, number] } | null>(null);
  const lastGeocodedEnd = useRef<{ name: string; coords: [number, number] } | null>(null);

  // Leaflet module loaded in client state
  const [leafletL, setLeafletL] = useState<typeof L | null>(null);

  // Load Leaflet once on mount in client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((module) => {
        setLeafletL(module);
        if (!document.getElementById("leaflet-style-link")) {
          const link = document.createElement("link");
          link.id = "leaflet-style-link";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }
      });
    }
  }, []);

  const syncDataToCloud = async (uid: string) => {
    if (!uid) return;
    setSyncStatus("syncing");
    setSyncError(null);
    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setSyncStatus("offline");
        return;
      }
      await setDoc(doc(db, "userData", uid), {
        displayName,
        username,
        riderEmail,
        riderPhone,
        riderBloodGroup,
        riderBio,
        distanceUnit,
        tempUnit,
        mapTileProvider,
        defaultRouteMode,
        notifPush,
        notifEmail,
        notifSosAlerts,
        notifSound,
        openWeatherApiKey,
        activeBikeId: activeBike.id,
        motorcycles: motorcyclesList,
        journalEntries,
        packingItems,
        emergencyContacts,
        updatedAt: new Date().toISOString(),
      });
      setSyncStatus("synced");
    } catch (err) {
      console.error("Cloud sync failed:", err);
      setSyncStatus("error");
      setSyncError(err instanceof Error ? err.message : "Unknown error during cloud sync");
    }
  };

  const loadDataFromCloud = async (uid: string) => {
    if (!uid) return;
    setSyncStatus("syncing");
    setSyncError(null);
    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setSyncStatus("offline");
        return;
      }
      const docSnap = await getDoc(doc(db, "userData", uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.displayName) setDisplayName(data.displayName);
        if (data.username) setUsername(data.username);
        if (data.riderEmail) setRiderEmail(data.riderEmail);
        if (data.riderPhone) setRiderPhone(data.riderPhone);
        if (data.riderBloodGroup) setRiderBloodGroup(data.riderBloodGroup);
        if (data.riderBio) setRiderBio(data.riderBio);
        if (data.distanceUnit) setDistanceUnit(data.distanceUnit);
        if (data.tempUnit) setTempUnit(data.tempUnit);
        if (data.mapTileProvider) setMapTileProvider(data.mapTileProvider);
        if (data.defaultRouteMode) setDefaultRouteMode(data.defaultRouteMode);
        if (data.notifPush !== undefined) setNotifPush(data.notifPush);
        if (data.notifEmail !== undefined) setNotifEmail(data.notifEmail);
        if (data.notifSosAlerts !== undefined) setNotifSosAlerts(data.notifSosAlerts);
        if (data.notifSound !== undefined) setNotifSound(data.notifSound);
        if (data.openWeatherApiKey) setOpenWeatherApiKey(data.openWeatherApiKey);
        
        if (data.motorcycles && data.motorcycles.length > 0) {
          setMotorcyclesList(data.motorcycles);
          const active = data.motorcycles.find((b: Motorcycle) => b.id === data.activeBikeId) || data.motorcycles[0];
          setActiveBike(active);
        }
        if (data.journalEntries) setJournalEntries(data.journalEntries);
        if (data.packingItems) setPackingItems(data.packingItems);
        if (data.emergencyContacts) setEmergencyContacts(data.emergencyContacts);
        
        setSyncStatus("synced");
      } else {
        await syncDataToCloud(uid);
      }
      setIsLoadedFromCloud(true);
    } catch (err) {
      console.error("Failed to load user cloud data:", err);
      setSyncStatus("error");
      setSyncError(err instanceof Error ? err.message : "Unknown error while loading cloud data");
      setIsLoadedFromCloud(true);
    }
  };

  // Observe active user to trigger load
  useEffect(() => {
    if (user && user.uid) {
      const loadTimer = setTimeout(() => {
        loadDataFromCloud(user.uid);
      }, 50);
      return () => clearTimeout(loadTimer);
    } else {
      const loadTimer = setTimeout(() => {
        setIsLoadedFromCloud(true);
      }, 50);
      return () => clearTimeout(loadTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Sync back to cloud on state changes
  useEffect(() => {
    if (user && user.uid && isLoadedFromCloud) {
      const timer = setTimeout(() => {
        syncDataToCloud(user.uid);
      }, 1200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    isLoadedFromCloud,
    displayName,
    username,
    riderEmail,
    riderPhone,
    riderBloodGroup,
    riderBio,
    distanceUnit,
    tempUnit,
    mapTileProvider,
    defaultRouteMode,
    notifPush,
    notifEmail,
    notifSosAlerts,
    notifSound,
    openWeatherApiKey,
    activeBike,
    motorcyclesList,
    journalEntries,
    packingItems,
    emergencyContacts,
  ]);

  // Initial Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFull = localStorage.getItem("fullName") || "Adventure Pilot";
      const storedUser = localStorage.getItem("username") || "Explorer";
      const storedBikeId = localStorage.getItem("activeBike");
      const storedTheme = localStorage.getItem("headlightTheme");
      const storedWeatherKey = localStorage.getItem("openWeatherApiKey") || "";
      const storedLastLocation = localStorage.getItem("lastWeatherLocation");
      const storedMotorcycles = localStorage.getItem("ridesync_motorcycles");
      const storedJournal = localStorage.getItem("ridesync_journal");
      let parsedJournal: JournalEntry[] = [];
      if (storedJournal) {
        try {
          parsedJournal = JSON.parse(storedJournal);
        } catch {
          console.error("Error parsing stored journal");
        }
      }

      const storedPacking = localStorage.getItem("ridesync_packing");
      let parsedPacking: PackingItem[] = [];
      if (storedPacking) {
        try {
          parsedPacking = JSON.parse(storedPacking);
        } catch {
          console.error("Error parsing stored packing");
        }
      }

      let fleet = MOTORCYCLES;
      if (storedMotorcycles) {
        try {
          fleet = JSON.parse(storedMotorcycles);
        } catch {
          console.error("Error parsing stored fleet, using defaults");
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
        if (storedLastLocation) {
          setWeatherCity(storedLastLocation);
        }
        if (parsedJournal && parsedJournal.length > 0) {
          setJournalEntries(parsedJournal);
        }
        if (parsedPacking && parsedPacking.length > 0) {
          setPackingItems(parsedPacking);
        }

        // Load Rider profile details
        setRiderEmail(localStorage.getItem("ridesync_rider_email") || "pilot@ridesync.ai");
        setRiderPhone(localStorage.getItem("ridesync_rider_phone") || "+91-98765-43210");
        setRiderBloodGroup(localStorage.getItem("ridesync_rider_blood") || "O+");
        setRiderBio(localStorage.getItem("ridesync_rider_bio") || "Himalayan tourer, mountain explorer, asphalt enthusiast.");

        // Load Units & Preferences
        setDistanceUnit((localStorage.getItem("ridesync_distance_unit") as "km" | "mi") || "km");
        setTempUnit((localStorage.getItem("ridesync_temp_unit") as "°C" | "°F") || "°C");
        setMapTileProvider((localStorage.getItem("ridesync_map_provider") as "osm" | "carto" | "topo") || "osm");
        setDefaultRouteMode((localStorage.getItem("ridesync_default_route_mode") as "Scenic" | "Fastest" | "Highway") || "Scenic");

        // Load Notification toggles
        setNotifPush(localStorage.getItem("ridesync_notif_push") !== "false");
        setNotifEmail(localStorage.getItem("ridesync_notif_email") !== "false");
        setNotifSosAlerts(localStorage.getItem("ridesync_notif_sos") !== "false");
        setNotifSound(localStorage.getItem("ridesync_notif_sound") !== "false");

        // Load emergency contacts
        const storedContacts = localStorage.getItem("ridesync_sos_contacts");
        if (storedContacts) {
          try {
            const parsedContacts: EmergencyContact[] = JSON.parse(storedContacts);
            if (parsedContacts && parsedContacts.length > 0) {
              setEmergencyContacts(parsedContacts);
            }
          } catch {
            console.error("Error parsing stored emergency contacts");
          }
        }

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

  // Update packing checklist when motorcycle updates, preserving existing packing states
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
      setPackingItems((prevItems) => {
        if (prevItems.length === 0) {
          return [...baseItems, ...bikeItems];
        }
        const cleaned = prevItems.filter((item) => !item.id.startsWith("pb"));
        const baseWithPacked = baseItems.map((bItem) => {
          const matched = prevItems.find((prev) => prev.id === bItem.id);
          return matched ? { ...bItem, packed: matched.packed } : bItem;
        });
        return [...baseWithPacked, ...cleaned.filter((item) => !baseItems.some(b => b.id === item.id)), ...bikeItems];
      });
    }, 0);
    return () => clearTimeout(timeout);
  }, [activeBike]);

  // Synchronize Weather location with Route Planner destination (routeEnd)
  useEffect(() => {
    if (routeEnd) {
      const cleanCity = routeEnd.replace(/\s*(base\s*camp|camp|circuit|expedition|valley)\s*/i, "").trim();
      const timer = setTimeout(() => {
        setWeatherCity(cleanCity || routeEnd);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [routeEnd]);

  // OpenWeather API Fetch
  useEffect(() => {
    const fetchRealWeather = async () => {
      if (!weatherCity) return;

      // Save weatherCity to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("lastWeatherLocation", weatherCity);
      }

      if (!openWeatherApiKey) {
        setWeatherForecast(null);
        setWeatherError(null);
        return;
      }

      setIsWeatherLoading(true);
      setWeatherError(null);

      try {
        const query = encodeURIComponent(weatherCity);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${openWeatherApiKey}&units=metric`
        );
        if (res.ok) {
          const data = await res.json();
          setWeatherForecast(data);
        } else {
          const errData = await res.json().catch(() => ({}));
          setWeatherError(errData.message || "Failed to load weather data for the specified location.");
          setWeatherForecast(null);
        }
      } catch (err) {
        console.error("Failed to fetch weather from OpenWeather:", err);
        setWeatherError("Network error. Please check your internet connection.");
        setWeatherForecast(null);
      } finally {
        setIsWeatherLoading(false);
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
        lat: `${curLat.toFixed(4)}Â° N`,
        lng: `${curLng.toFixed(4)}Â° E`,
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

  const handleStartChange = (val: string) => {
    setRouteStart(val);
    if (startTimer) clearTimeout(startTimer);
    if (val.trim().length < 3) {
      setStartSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setStartSuggestions(data);
        }
      } catch (err) {
        console.error(err);
      }
    }, 400);
    setStartTimer(t);
  };

  const handleEndChange = (val: string) => {
    setRouteEnd(val);
    if (endTimer) clearTimeout(endTimer);
    if (val.trim().length < 3) {
      setEndSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setEndSuggestions(data);
        }
      } catch (err) {
        console.error(err);
      }
    }, 400);
    setEndTimer(t);
  };

  // Route Calculation Loop
  useEffect(() => {
    if (activeTab !== "My Routes") return;

    const delayDebounceFn = setTimeout(async () => {
      if (!routeStart.trim() || !routeEnd.trim()) {
        setActiveRouteData(null);
        return;
      }

      setIsRouteLoading(true);
      setFetchRouteError(null);

      try {
        const tryGeocode = async (q: string): Promise<[number, number]> => {
          const fetchGeocode = async (queryStr: string) => {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}&limit=1`);
            if (res.ok) {
              const data = await res.json();
              if (data && data[0]) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
              }
            }
            return null;
          };

          let coords = await fetchGeocode(q);
          if (!coords) {
            // Fallback: strip "Base Camp" or similar
            const simplified = q.replace(/base camp/gi, "").trim();
            if (simplified && simplified !== q) {
              coords = await fetchGeocode(simplified);
            }
          }
          if (!coords) {
            throw new Error(`Could not find location: ${q}`);
          }
          return coords;
        };

        // Get starting coordinates
        let startLatLon: [number, number];
        if (lastGeocodedStart.current && lastGeocodedStart.current.name === routeStart) {
          startLatLon = lastGeocodedStart.current.coords;
        } else {
          startLatLon = await tryGeocode(routeStart);
          lastGeocodedStart.current = { name: routeStart, coords: startLatLon };
          setStartCoords(startLatLon);
        }

        // Get destination coordinates
        let endLatLon: [number, number];
        if (lastGeocodedEnd.current && lastGeocodedEnd.current.name === routeEnd) {
          endLatLon = lastGeocodedEnd.current.coords;
        } else {
          endLatLon = await tryGeocode(routeEnd);
          lastGeocodedEnd.current = { name: routeEnd, coords: endLatLon };
          setEndCoords(endLatLon);
        }

        if (startLatLon[0] === endLatLon[0] && startLatLon[1] === endLatLon[1]) {
          throw new Error("Start and destination coordinates cannot be the same.");
        }

        const bikeStats = getBikeStats(activeBike);
        const res = await fetchRoute(startLatLon, endLatLon, selectedRouteOption);
        
        const distNum = res.distanceKm;
        const durationSec = res.durationSec;
        const avgSpeedVal = Math.round(distNum / (durationSec / 3600)) || 50;
        const fuelReq = distNum / bikeStats.mileage;
        const fCost = Math.round(fuelReq * fuelPrice);
        
        let rType = "Standard Highway Route";
        if (selectedRouteOption === "Scenic") {
          rType = `Mountain Passes & Trails for ${activeBike.brand}`;
        } else if (selectedRouteOption === "Fastest") {
          rType = `Expressway Bypass for ${activeBike.brand}`;
        } else if (selectedRouteOption === "Highway") {
          rType = `Double-lane National Highway for ${activeBike.brand}`;
        }
        
        const elev = Math.round(Math.abs(startLatLon[0] - endLatLon[0]) * 4500 + Math.abs(startLatLon[1] - endLatLon[1]) * 2500 + (selectedRouteOption === "Scenic" ? 1200 : 300));
        
        let stopsText = "No stops required";
        if (distNum > bikeStats.maxRange) {
          const stopsNum = Math.ceil(distNum / bikeStats.maxRange) - 1;
          const stopInterval = Math.round(bikeStats.maxRange * 0.85);
          stopsText = `${stopsNum} stop${stopsNum > 1 ? "s" : ""} required (Refill after every ${stopInterval} km)`;
        }

        setActiveRouteData({
          distance: `${distNum.toFixed(1)} km`,
          duration: durationSec > 3600 
            ? `${Math.floor(durationSec / 3600)}h ${Math.floor((durationSec % 3600) / 60)}m` 
            : `${Math.floor(durationSec / 60)}m`,
          roadType: rType,
          elevation: `${elev.toLocaleString()} m`,
          coordinates: res.coordinates,
          fuelRequired: parseFloat(fuelReq.toFixed(1)),
          fuelCost: fCost,
          avgSpeed: `${avgSpeedVal} km/h`,
          fuelStopsText: stopsText
        });
      } catch (err) {
        console.error("Routing error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        setFetchRouteError(msg || "Failed to generate route. Please check coordinates.");
      } finally {
        setIsRouteLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeTab, routeStart, routeEnd, selectedRouteOption, activeBike, fuelPrice]);

  // Leaflet Map Initialization for Route Planner
  useEffect(() => {
    if (activeTab !== "My Routes" || typeof window === "undefined" || !leafletL || !activeRouteData) return;
    const container = mapContainerRef.current;
    if (!container) return;

    const L = leafletL;
    let map = mapInstanceRef.current;

    let tilesUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    if (mapTileProvider === "carto") {
      tilesUrl = headlightOn
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    } else if (mapTileProvider === "topo") {
      tilesUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
    } else {
      tilesUrl = headlightOn
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }

    const coords = activeRouteData.coordinates;

    const isValidLatLng = (pt: unknown): pt is [number, number] => {
      return Array.isArray(pt) && pt.length === 2 && typeof pt[0] === "number" && typeof pt[1] === "number" && !isNaN(pt[0]) && !isNaN(pt[1]);
    };

    if (!coords || !Array.isArray(coords) || coords.length < 2) return;
    const startPoint = coords[0];
    const endPoint = coords[coords.length - 1];

    if (!isValidLatLng(startPoint) || !isValidLatLng(endPoint)) return;

    if (!map) {
      map = L.map(container).setView(startPoint, 9);
      mapInstanceRef.current = map;

      const tiles = L.tileLayer(tilesUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);
      tileLayerRef.current = tiles;

      const startDiv = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #10B981; border: 2.5px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); width: 24px; height: 24px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900;">S</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const startMarker = L.marker(startPoint, { icon: startDiv })
        .bindPopup(`<strong>Start: ${routeStart}</strong>`)
        .addTo(map);
      startMarkerRef.current = startMarker;

      const endDiv = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #EF4444; border: 2.5px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); width: 24px; height: 24px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900;">E</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const endMarker = L.marker(endPoint, { icon: endDiv })
        .bindPopup(`<strong>Destination: ${routeEnd}</strong>`)
        .addTo(map);
      endMarkerRef.current = endMarker;

      polylineRef.current = L.polyline(coords, {
        color: "#FF6B00",
        weight: 4.5,
        opacity: 0.95,
        dashArray: "6, 5",
      }).addTo(map);

      const markerGroup = L.featureGroup([startMarker, endMarker]);
      map.fitBounds(markerGroup.getBounds(), { padding: [50, 50] });
    } else {
      // Dynamically update tile layers and markers without destroying/recreating the map
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(tilesUrl);
      }

      if (startMarkerRef.current) {
        startMarkerRef.current.setLatLng(startPoint);
        startMarkerRef.current.setPopupContent(`<strong>Start: ${routeStart}</strong>`);
      }

      if (endMarkerRef.current) {
        endMarkerRef.current.setLatLng(endPoint);
        endMarkerRef.current.setPopupContent(`<strong>Destination: ${routeEnd}</strong>`);
      }

      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }

      polylineRef.current = L.polyline(coords, {
        color: "#FF6B00",
        weight: 4.5,
        opacity: 0.95,
        dashArray: "6, 5",
      }).addTo(map);

      const markers = [];
      if (startMarkerRef.current) markers.push(startMarkerRef.current);
      if (endMarkerRef.current) markers.push(endMarkerRef.current);
      if (markers.length > 0) {
        const markerGroup = L.featureGroup(markers);
        map.fitBounds(markerGroup.getBounds(), { padding: [50, 50] });
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(container);

    const invalidateTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      clearTimeout(invalidateTimer);
      resizeObserver.disconnect();
    };
  }, [activeTab, leafletL, activeRouteData, headlightOn, routeStart, routeEnd, mapTileProvider]);

  // Handle map cleanup when switching tabs or unmounting
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
        startMarkerRef.current = null;
        endMarkerRef.current = null;
        polylineRef.current = null;
      }
    };
  }, [activeTab]);

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
    if (!activeRouteData) return;
    const routeName = `${routeStart.split(",")[0]} to ${routeEnd.split(",")[0]} Route`;
    const newEntry: JournalEntry = {
      id: `route-${Date.now()}`,
      title: routeName,
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      start: routeStart,
      end: routeEnd,
      coordinates: activeRouteData.coordinates,
      option: selectedRouteOption,
      distance: activeRouteData.distance.replace(" km", ""),
      duration: activeRouteData.duration,
      roadType: activeRouteData.roadType,
      elevation: activeRouteData.elevation.replace(" m", "").replace(/,/g, ""),
      fuelCost: activeRouteData.fuelCost,
      fuelRequired: activeRouteData.fuelRequired,
      motorcycle: activeBike.name,
      isRoute: true,
      notes: `Planned via OSRM (${selectedRouteOption} engine). Duration: ${activeRouteData.duration}. Fuel cost: â‚¹${activeRouteData.fuelCost}.`,
      rating: 5,
      favorite: false,
      image: "/hero_rider_standing.png"
    };

    const updatedJournal = [newEntry, ...journalEntries];
    setJournalEntries(updatedJournal);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_journal", JSON.stringify(updatedJournal));
    }
  };

  const handleDeleteSavedRoute = (id: string) => {
    const updated = journalEntries.filter((r) => r.id !== id);
    setJournalEntries(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_journal", JSON.stringify(updated));
    }
  };

  const handleLoadRoute = (route: SavedRoute) => {
    setRouteStart(route.start);
    setRouteEnd(route.end);
    setSelectedRouteOption(route.option);
    if (route.coordinates && route.coordinates.length > 0) {
      const sCoords = route.coordinates[0];
      const eCoords = route.coordinates[route.coordinates.length - 1];
      setStartCoords(sCoords);
      setEndCoords(eCoords);
      lastGeocodedStart.current = { name: route.start, coords: sCoords };
      lastGeocodedEnd.current = { name: route.end, coords: eCoords };
    }
    
    const bikeStats = getBikeStats(activeBike);
    const distNum = parseFloat(route.distance.replace(" km", "")) || 0;
    
    let stopsText = "No stops required";
    if (distNum > bikeStats.maxRange) {
      const stopsNum = Math.ceil(distNum / bikeStats.maxRange) - 1;
      const stopInterval = Math.round(bikeStats.maxRange * 0.85);
      stopsText = `${stopsNum} stop${stopsNum > 1 ? "s" : ""} required (Refill after every ${stopInterval} km)`;
    }

    setActiveRouteData({
      distance: route.distance,
      duration: route.duration,
      roadType: route.roadType,
      elevation: route.elevation,
      coordinates: route.coordinates,
      fuelRequired: route.fuelRequired || parseFloat((distNum / bikeStats.mileage).toFixed(1)),
      fuelCost: route.fuelCost,
      avgSpeed: "60 km/h",
      fuelStopsText: stopsText
    });
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
      rating: newJournalRating,
      favorite: newJournalFavorite,
    };
    const updatedJournal = [newLog, ...journalEntries];
    setJournalEntries(updatedJournal);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_journal", JSON.stringify(updatedJournal));
    }
    setNewJournalTitle("");
    setNewJournalDate("");
    setNewJournalDist("");
    setNewJournalLean("");
    setNewJournalElev("");
    setNewJournalNotes("");
    setNewJournalRating(5);
    setNewJournalFavorite(false);
    setShowAddJournal(false);
  };

  // Toggle Packing Checkbox
  const togglePackItem = (id: string) => {
    const updated = packingItems.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    setPackingItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_packing", JSON.stringify(updated));
    }
  };

  const handleApplyTemplate = (templateName: keyof typeof PACKING_TEMPLATES) => {
    const templateItems = PACKING_TEMPLATES[templateName].map((item) => ({
      ...item,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    const updated = [...packingItems, ...templateItems];
    setPackingItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_packing", JSON.stringify(updated));
    }
  };

  const handleResetPacking = () => {
    const reset = packingItems.map((item) => ({ ...item, packed: false }));
    setPackingItems(reset);
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_packing", JSON.stringify(reset));
    }
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
  // Emergency Contact CRUD Handlers
  const persistContacts = (contacts: EmergencyContact[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_sos_contacts", JSON.stringify(contacts));
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newContact: EmergencyContact = {
      id: `contact_${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation.trim() || "Emergency Contact",
      isPrimary: emergencyContacts.length === 0,
    };
    const updated = [...emergencyContacts, newContact];
    setEmergencyContacts(updated);
    persistContacts(updated);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelation("");
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    const filtered = emergencyContacts.filter((c) => c.id !== id);
    // If deleted contact was primary, set the first remaining as primary
    const updated = filtered.map((c, idx) =>
      idx === 0 ? { ...c, isPrimary: true } : c
    );
    setEmergencyContacts(updated);
    persistContacts(updated);
  };

  const handleSetPrimaryContact = (id: string) => {
    const updated = emergencyContacts.map((c) => ({ ...c, isPrimary: c.id === id }));
    setEmergencyContacts(updated);
    persistContacts(updated);
  };

  // Real GPS Handler
  const handleGetGPS = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        setRealGpsCoords({ lat: latitude, lng: longitude });
        setGpsCoords({
          lat: `${Math.abs(latitude).toFixed(4)}Â° ${latitude >= 0 ? "N" : "S"}`,
          lng: `${Math.abs(longitude).toFixed(4)}Â° ${longitude >= 0 ? "E" : "W"}`,
          alt: altitude ? `${Math.round(altitude)} m` : "N/A",
        });
        // Pan SOS map to real location if map is loaded
        if (sosMapInstanceRef.current) {
          sosMapInstanceRef.current.setView([latitude, longitude], 14);
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(`GPS Error: ${err.message}`);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Export GPX

  const exportGPX = () => {
    if (!activeRouteData) {
      alert("Please configure and select a route in the Route Planner tab first before exporting GPX.");
      return;
    }
    const coords = activeRouteData.coordinates;
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

  // Export JSON
  const exportJSON = () => {
    if (!activeRouteData) {
      alert("Please configure and select a route in the Route Planner tab first before exporting JSON.");
      return;
    }
    const routeJSON = {
      name: `${routeStart} to ${routeEnd} Route`,
      start: routeStart,
      end: routeEnd,
      option: selectedRouteOption,
      distance: activeRouteData.distance,
      duration: activeRouteData.duration,
      roadType: activeRouteData.roadType,
      elevation: activeRouteData.elevation,
      fuelCost: activeRouteData.fuelCost,
      fuelRequired: activeRouteData.fuelRequired,
      coordinates: activeRouteData.coordinates,
      motorcycle: activeBike.name,
      date: new Date().toLocaleDateString()
    };
    const blob = new Blob([JSON.stringify(routeJSON, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${routeStart.replace(/\s+/g, "_")}_to_${routeEnd.replace(/\s+/g, "_")}_${selectedRouteOption.toLowerCase()}.json`;
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

  // Rider Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("fullName", displayName);
      localStorage.setItem("username", username);
      localStorage.setItem("ridesync_rider_email", riderEmail);
      localStorage.setItem("ridesync_rider_phone", riderPhone);
      localStorage.setItem("ridesync_rider_blood", riderBloodGroup);
      localStorage.setItem("ridesync_rider_bio", riderBio);
    }
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    setUserInitials(initials || "AP");
    alert("Rider Profile updated successfully!");
  };

  // Settings & Preferences Update
  const handleSavePreferences = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("ridesync_distance_unit", distanceUnit);
      localStorage.setItem("ridesync_temp_unit", tempUnit);
      localStorage.setItem("ridesync_map_provider", mapTileProvider);
      localStorage.setItem("ridesync_default_route_mode", defaultRouteMode);
      
      localStorage.setItem("ridesync_notif_push", String(notifPush));
      localStorage.setItem("ridesync_notif_email", String(notifEmail));
      localStorage.setItem("ridesync_notif_sos", String(notifSosAlerts));
      localStorage.setItem("ridesync_notif_sound", String(notifSound));
    }
    alert("Preferences saved successfully!");
  };

  // Export all RideSync data as JSON
  const handleExportAllData = () => {
    if (typeof window === "undefined") return;
    const keys = [
      "fullName", "username", "activeBike", "headlightTheme", "openWeatherApiKey",
      "lastWeatherLocation", "ridesync_motorcycles", "ridesync_journal",
      "ridesync_packing", "ridesync_sos_contacts", "ridesync_rider_email",
      "ridesync_rider_phone", "ridesync_rider_blood", "ridesync_rider_bio",
      "ridesync_distance_unit", "ridesync_temp_unit", "ridesync_map_provider",
      "ridesync_default_route_mode", "ridesync_notif_push", "ridesync_notif_email",
      "ridesync_notif_sos", "ridesync_notif_sound"
    ];
    const exportData: Record<string, string | null> = {};
    keys.forEach((key) => {
      exportData[key] = localStorage.getItem(key);
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ridesync_all_data_export_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const handleImportAllData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === "object") {
          Object.keys(parsed).forEach((key) => {
            if (parsed[key] !== null && parsed[key] !== undefined) {
              localStorage.setItem(key, String(parsed[key]));
            }
          });
          alert("RideSync data imported successfully! Page will reload to apply your changes.");
          window.location.reload();
        } else {
          alert("Failed to import: Invalid data format.");
        }
      } catch {
        alert("Failed to import data: File is not valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Clear all local data
  const handleClearAllData = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      alert("All local data cleared. Redirecting you to login...");
      router.push("/login");
    }
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

  if (!isLoadedFromCloud && user) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-3xl theme-transition ${
        headlightOn ? "bg-[#060D15] text-white" : "bg-[#F0F2F5] text-[#0B1520]"
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-orange-600 p-[1.5px] shadow-lg shadow-[#FF6B00]/25 animate-pulse mb-6 flex items-center justify-center">
          <div className={`w-full h-full rounded-[14px] flex items-center justify-center theme-transition ${
            headlightOn ? "bg-[#060D15]" : "bg-white"
          }`}>
            <Map className="w-8 h-8 text-[#FF6B00] animate-spin" />
          </div>
        </div>
        <h2 className="text-sm font-black tracking-widest uppercase">Initializing Telemetry</h2>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1.5 animate-pulse">Syncing satellite link...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen theme-transition flex relative overflow-x-hidden ${
        headlightOn ? "night-theme bg-[#060D15] text-white" : "day-theme bg-[#F0F2F5] text-[#0B1520]"
      }`}
    >
      {/* â”€â”€ Ambient Background Glows â”€â”€ */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#FF6B00]/5 blur-[220px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/4 blur-[200px] pointer-events-none z-0" />
      {headlightOn && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-[#FF6B00]/3 blur-[300px] pointer-events-none z-0" />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LEFT SIDEBAR (Desktop Only)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MAIN WORKSPACE
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
            {/* Cloud Sync Status Indicator */}
            {user && (
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider theme-transition ${
                syncStatus === "syncing"
                  ? headlightOn ? "bg-sky-500/10 border-sky-500/25 text-sky-400" : "bg-sky-50 border-sky-200 text-sky-600"
                  : syncStatus === "synced"
                  ? headlightOn ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : syncStatus === "offline"
                  ? headlightOn ? "bg-amber-500/10 border-amber-500/25 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"
                  : syncStatus === "error"
                  ? headlightOn ? "bg-red-500/10 border-red-500/25 text-red-400 animate-pulse" : "bg-red-50 border-red-200 text-red-600 animate-pulse"
                  : headlightOn ? "bg-white/4 border-white/8 text-white/40" : "bg-black/3 border-black/8 text-gray-400"
              }`} title={syncStatus === "error" && syncError ? syncError : `Cloud Sync Status: ${syncStatus}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === "syncing" ? "bg-sky-400 animate-pulse" :
                  syncStatus === "synced" ? "bg-emerald-400" :
                  syncStatus === "offline" ? "bg-amber-400" :
                  syncStatus === "error" ? "bg-red-400 animate-ping" : "bg-gray-400"
                }`} />
                <span>
                  {syncStatus === "syncing" ? "Syncing" :
                   syncStatus === "synced" ? "Synced" :
                   syncStatus === "offline" ? "Offline" :
                   syncStatus === "error" ? "Sync Err" : "Cloud"}
                </span>
              </div>
            )}

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
              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  DASHBOARD HOME VIEW (Overview tab)
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                            {activeBike.name} Â· {activeBike.edition}
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

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SUB-MODULE VIEWS (Back-button wrapper)
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

                  {/* â”€â”€ 1. MY GARAGE TAB â”€â”€ */}
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
                                <p className="text-xs text-gray-400 font-semibold mt-2">{activeBike.edition} Â· {activeBike.type}</p>
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
                              Plan Expedition â†’
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

                  {/* â”€â”€ 2. AI TRIP PLANNER TAB â”€â”€ */}
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
                                        const dayIcons = ["ðŸ§­", "â›°ï¸", "ðŸŒŠ", "ðŸ›£ï¸", "ðŸ"];
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
                                                <span className="text-base">{dayIcons[idx % dayIcons.length] || "ðŸï¸"}</span>
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

                  {/* â”€â”€ 3. ROUTE PLANNER TAB (Leaflet Integration) â”€â”€ */}
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
                            <div className="flex flex-col gap-1.5 relative">
                              <label className="text-[10px] font-black uppercase text-gray-400">Current Location (Start)</label>
                              <input
                                type="text"
                                value={routeStart}
                                onChange={(e) => handleStartChange(e.target.value)}
                                placeholder="Search start location..."
                                className={`theme-transition border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                              {startSuggestions.length > 0 && (
                                <div className={`absolute left-0 right-0 top-[100%] mt-1 z-50 rounded-xl border max-h-48 overflow-y-auto ${
                                  headlightOn ? "bg-[#0b1420] border-white/10 text-white shadow-2xl" : "bg-white border-black/10 text-[#0b1420] shadow-lg"
                                }`}>
                                  {startSuggestions.map((item, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => {
                                        setRouteStart(item.display_name);
                                        const coords: [number, number] = [parseFloat(item.lat), parseFloat(item.lon)];
                                        setStartCoords(coords);
                                        lastGeocodedStart.current = { name: item.display_name, coords };
                                        setStartSuggestions([]);
                                      }}
                                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] border-b border-white/5 last:border-b-0 truncate`}
                                      title={item.display_name}
                                    >
                                      {item.display_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 relative">
                              <label className="text-[10px] font-black uppercase text-gray-400">Destination Search (End)</label>
                              <input
                                type="text"
                                value={routeEnd}
                                onChange={(e) => handleEndChange(e.target.value)}
                                placeholder="Search destination..."
                                className={`theme-transition border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                              {endSuggestions.length > 0 && (
                                <div className={`absolute left-0 right-0 top-[100%] mt-1 z-50 rounded-xl border max-h-48 overflow-y-auto ${
                                  headlightOn ? "bg-[#0b1420] border-white/10 text-white shadow-2xl" : "bg-white border-black/10 text-[#0b1420] shadow-lg"
                                }`}>
                                  {endSuggestions.map((item, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => {
                                        setRouteEnd(item.display_name);
                                        const coords: [number, number] = [parseFloat(item.lat), parseFloat(item.lon)];
                                        setEndCoords(coords);
                                        lastGeocodedEnd.current = { name: item.display_name, coords };
                                        setEndSuggestions([]);
                                      }}
                                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] border-b border-white/5 last:border-b-0 truncate`}
                                      title={item.display_name}
                                    >
                                      {item.display_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Fuel pricing adjustment */}
                          <div className="flex gap-2">
                            <div className="flex flex-col gap-1.5 flex-1">
                              <label className="text-[10px] font-black uppercase text-gray-400">Fuel Type</label>
                              <select
                                value={fuelType}
                                onChange={(e) => {
                                  const type = e.target.value as "Petrol" | "Diesel";
                                  setFuelType(type);
                                  setFuelPrice(type === "Petrol" ? 105 : 95);
                                }}
                                className={`theme-transition border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5 w-24">
                              <label className="text-[10px] font-black uppercase text-gray-400">Price (â‚¹/L)</label>
                              <input
                                type="number"
                                value={fuelPrice}
                                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                                className={`theme-transition border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Route Options (Scenic, Fastest, Highway) */}
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

                          {/* Error block */}
                          {routeError && (
                            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-500" />
                              <span>{routeError}</span>
                            </div>
                          )}

                          {/* Route Details and Calculations */}
                          {activeRouteData ? (
                            <div className="space-y-4 pt-4 border-t border-gray-400/10">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">Distance</p>
                                  <p className="text-base font-black mt-0.5">{activeRouteData.distance}</p>
                                </div>
                                <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">ETA</p>
                                  <p className="text-base font-black mt-0.5">{activeRouteData.duration}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">Est. Fuel Cost</p>
                                  <p className="text-base font-black mt-0.5 text-[#FF6B00]">â‚¹{activeRouteData.fuelCost.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">Fuel Required</p>
                                  <p className="text-base font-black mt-0.5 text-[#FF6B00]">{activeRouteData.fuelRequired} L</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">Average Speed</p>
                                  <p className="text-base font-black mt-0.5">{activeRouteData.avgSpeed}</p>
                                </div>
                                <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">Elevation Gain</p>
                                  <p className="text-base font-black mt-0.5">{activeRouteData.elevation}</p>
                                </div>
                              </div>

                              <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Fuel Stop Advisory</p>
                                <p className="text-xs font-black mt-0.5 text-orange-400">{activeRouteData.fuelStopsText}</p>
                              </div>

                              <div className="p-3 bg-black/20 rounded-2xl border border-white/5 text-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Road Surface</p>
                                <p className="text-[10px] font-black mt-0.5 leading-tight truncate" title={activeRouteData.roadType}>{activeRouteData.roadType}</p>
                              </div>

                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={handleSaveRoute}
                                  className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs rounded-xl tracking-widest uppercase shadow shadow-[#FF6B00]/15 transition-colors"
                                >
                                  Save Route
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={exportGPX}
                                    className={`px-3 py-2.5 rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                                      headlightOn ? "border-white/10 hover:bg-white/5 text-white" : "border-black/10 hover:bg-black/5 text-[#0B1520]"
                                    }`}
                                    title="Export GPX"
                                  >
                                    <FileDown className="w-3.5 h-3.5" /> <span className="text-[9px] font-black">GPX</span>
                                  </button>
                                  <button
                                    onClick={exportJSON}
                                    className={`px-3 py-2.5 rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                                      headlightOn ? "border-white/10 hover:bg-white/5 text-white" : "border-black/10 hover:bg-black/5 text-[#0B1520]"
                                    }`}
                                    title="Export JSON"
                                  >
                                    <FileDown className="w-3.5 h-3.5" /> <span className="text-[9px] font-black">JSON</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 rounded-2xl bg-black/10 border border-white/5 text-center text-gray-500 text-xs">
                              <p className="font-bold">Provide location coordinates to calculate route logistics & analytics.</p>
                            </div>
                          )}
                        </div>

                        {/* Interactive Leaflet Map */}
                        <div className="lg:col-span-2 space-y-6 relative">
                          <div className={`${cardClass} flex flex-col h-full relative`}>
                            <div className="flex justify-between items-center mb-6">
                              <div>
                                <h4 className="text-lg font-black">Interactive Sat-Nav Map</h4>
                                <p className="text-xs text-gray-400 font-semibold mt-1">Real-time Leaflet GIS mapping engine.</p>
                              </div>
                            </div>

                            <div className="flex-1 w-full h-full min-h-[380px] md:min-h-[480px] rounded-3xl overflow-hidden border border-white/5 relative z-10 bg-[#070e17]" style={{ height: "100%", width: "100%" }}>
                              {isRouteLoading && (
                                <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center text-white gap-2">
                                  <div className="w-8 h-8 border-4 border-t-[#FF6B00] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">Loading dynamic GIS route...</span>
                                </div>
                              )}
                              <div ref={mapContainerRef} className="w-full h-full" style={{ height: "100%", width: "100%" }} />
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
                            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                              {savedRoutes.map((route) => (
                                <div
                                  key={route.id}
                                  onClick={() => handleLoadRoute(route)}
                                  className="flex items-center justify-between p-3 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/5 cursor-pointer hover:scale-[1.01] transition-all duration-200 group"
                                >
                                  <div className="text-xs flex-1 min-w-0 pr-2">
                                    <p className="font-black text-white group-hover:text-[#FF6B00] transition-colors truncate">{route.name}</p>
                                    <p className="text-[9px] text-[#FF6B00] font-semibold truncate">{route.start.split(",")[0]} âž” {route.end.split(",")[0]}</p>
                                    <p className="text-[8px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider truncate">
                                      {route.option} Â· {route.distance} Â· {route.duration} Â· â‚¹{route.fuelCost} Â· {route.motorcycle}
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
                          <h4 className="text-base font-black mb-4 pb-2 border-b border-gray-400/10 flex justify-between items-center">
                            <span>Recent Routes</span>
                            <span className="text-[10px] font-black text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {recentRoutes.length} Recent
                            </span>
                          </h4>

                          {recentRoutes.length === 0 ? (
                            <div className="py-8 text-center flex flex-col items-center justify-center text-gray-500">
                              <Clock className="w-10 h-10 mb-2 opacity-30 text-sky-400" />
                              <p className="text-xs font-black uppercase tracking-wider text-gray-400">No Recent Searches</p>
                              <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Searched routes will appear here for fast dynamic retrieval.</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                              {recentRoutes.map((route, idx) => (
                                <div
                                  key={route.id || idx}
                                  onClick={() => handleLoadRoute(route)}
                                  className="p-3 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/5 cursor-pointer hover:scale-[1.01] transition-all duration-200 flex justify-between items-center group"
                                >
                                  <div className="text-xs flex-1 min-w-0 pr-2">
                                    <p className="font-black text-white group-hover:text-sky-400 transition-colors truncate">{route.name || `${route.start.split(",")[0]} âž” ${route.end.split(",")[0]}`}</p>
                                    <p className="text-[8px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider truncate">
                                      {route.option} Â· {route.distance} Â· {route.duration} Â· {route.motorcycle || "BMW R1250 GS"}
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

                  {/* â”€â”€ 4. WEATHER TAB (OpenWeather Integration) â”€â”€ */}
                  {activeTab === "Weather Forecast" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-black">Weather Radar</h2>
                          <p className="text-xs text-gray-400 font-semibold mt-1">
                            {openWeatherApiKey ? `Live OpenWeather feed for ${weatherCity}` : "Simulated Microclimate Meteorological Radar"}
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

                      {/* Offline & Connection Banners */}
                      {!openWeatherApiKey && (
                        <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-500/25 text-[#FF6B00] text-xs font-semibold flex items-center gap-3">
                          <Cloud className="w-5 h-5 flex-shrink-0 text-[#FF6B00]" />
                          <span><strong>Offline Mode</strong>: Utilizing simulated microclimate meteorological engine for <strong>{weatherCity}</strong>. Provide an OpenWeather API key in Settings to connect to live radar.</span>
                        </div>
                      )}

                      {openWeatherApiKey && weatherError && (
                        <div className="p-4 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
                          <span><strong>API Connection Failed</strong>: {weatherError}. Falling back to simulated climate radar for <strong>{weatherCity}</strong>.</span>
                        </div>
                      )}

                      {isWeatherLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Skeleton Loader 1: Overview */}
                          <div className={`${cardClass} animate-pulse min-h-[320px] flex flex-col justify-between`}>
                            <div>
                              <div className="h-3 bg-white/10 rounded w-1/4 mb-4" />
                              <div className="flex justify-between items-center my-6">
                                <div>
                                  <div className="h-12 bg-white/10 rounded w-24 mb-2" />
                                  <div className="h-4 bg-white/10 rounded w-32" />
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-full" />
                              </div>
                            </div>
                            <div className="space-y-4 border-t border-white/5 pt-4">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between">
                                  <div className="h-3 bg-white/10 rounded w-1/3" />
                                  <div className="h-3 bg-white/10 rounded w-16" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Skeleton Loader 2: Details */}
                          <div className={`${cardClass} animate-pulse min-h-[320px] flex flex-col justify-between`}>
                            <div className="space-y-4">
                              <div className="h-3 bg-white/10 rounded w-1/3 mb-4" />
                              <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                  <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                                    <div className="h-3 bg-white/10 rounded w-12" />
                                    <div className="h-4 bg-white/10 rounded w-16" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Skeleton Loader 3: 12-Hour Forecast */}
                          <div className={`${cardClass} animate-pulse min-h-[320px] flex flex-col justify-between`}>
                            <div>
                              <div className="h-3 bg-white/10 rounded w-1/3 mb-4" />
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                  <div key={i} className="h-28 bg-white/5 border border-white/5 rounded-2xl" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const activeData = weatherForecast || generateMockForecast(weatherCity);
                          const current = activeData.list[0];
                          
                          // Condition icon picker
                          const mainCond = current.weather[0].main.toLowerCase();
                          let weatherIconElement = <Cloud className="w-16 h-16 text-gray-400 drop-shadow-[0_0_10px_rgba(156,163,175,0.3)]" />;
                          if (mainCond.includes("rain") || mainCond.includes("drizzle")) {
                            weatherIconElement = <Cloud className="w-16 h-16 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.35)]" />;
                          } else if (mainCond.includes("snow")) {
                            weatherIconElement = <Cloud className="w-16 h-16 text-sky-200 drop-shadow-[0_0_10px_rgba(224,242,254,0.35)]" />;
                          } else if (mainCond.includes("clear") || mainCond.includes("sun")) {
                            weatherIconElement = <Sun className="w-16 h-16 text-[#FF6B00] drop-shadow-[0_0_10px_rgba(255,107,0,0.35)] animate-spin" style={{ animationDuration: '25s' }} />;
                          }

                          // 12-Hour Forecast calculation
                          const hourlyList = activeData.list.slice(0, 4).map((item) => {
                            const date = new Date(item.dt * 1000);
                            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const isNight = date.getHours() < 6 || date.getHours() > 18;
                            const itemCond = item.weather[0].main.toLowerCase();
                            
                            let emoji = "â˜€ï¸";
                            if (itemCond.includes("rain")) emoji = "ðŸŒ§ï¸";
                            else if (itemCond.includes("cloud")) emoji = "â›…";
                            else if (itemCond.includes("snow")) emoji = "â„ï¸";
                            
                            return {
                              time: timeStr,
                              temp: `${Math.round(item.main.temp)}Â°C`,
                              icon: emoji,
                              rain: item.pop !== undefined ? `${Math.round(item.pop * 100)}%` : "15%",
                              wind: `${item.wind.speed} m/s`,
                              isNight
                            };
                          });

                          // 7-Day Forecast calculation
                          const sevenDayList = get7DayForecast(weatherForecast ? weatherForecast.list : null, weatherCity);

                          return (
                            <>
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* 1. OVERVIEW CARD */}
                                <div className={`${cardClass} flex flex-col justify-between hover:border-white/10 hover:shadow-lg hover:shadow-[#FF6B00]/5 transition-all duration-300`}>
                                  <div>
                                    <div className="flex justify-between items-center border-b border-gray-400/10 pb-3 mb-4">
                                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Active Station Radar</span>
                                      <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 rounded bg-white/5 capitalize">{current.weather[0].description}</span>
                                    </div>
                                    <div className="flex justify-between items-center my-4">
                                      <div>
                                        <h4 className="text-5xl font-black tracking-tighter">
                                          {Math.round(current.main.temp)}Â°C
                                        </h4>
                                        <p className="text-sm text-white font-bold mt-1.5 flex items-center gap-1">
                                          {activeData.city.name}, {activeData.city.country}
                                        </p>
                                      </div>
                                      <div className="animate-bounce" style={{ animationDuration: '4s' }}>
                                        {weatherIconElement}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3.5 border-t border-gray-400/10 pt-4 mt-4">
                                    <div className="flex justify-between text-xs border-b border-gray-400/5 pb-2">
                                      <span className="text-gray-400 font-bold flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-[#FF6B00]" /> Feels-Like Index</span>
                                      <span className="font-black">{Math.round(current.main.feels_like)}Â°C</span>
                                    </div>
                                    <div className="flex justify-between text-xs border-b border-gray-400/5 pb-2">
                                      <span className="text-gray-400 font-bold flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-[#FF6B00]" /> Wind Speed & Vectors</span>
                                      <span className="font-black">{current.wind.speed} m/s</span>
                                    </div>
                                    <div className="flex justify-between text-xs pb-1">
                                      <span className="text-gray-400 font-bold flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-[#FF6B00]" /> Humidity Level</span>
                                      <span className="font-black">{current.main.humidity}%</span>
                                    </div>
                                  </div>
                                </div>

                                {/* 2. DEEP DIVE METEOROLOGICAL CARD */}
                                <div className={`${cardClass} flex flex-col justify-between hover:border-white/10 hover:shadow-lg hover:shadow-[#FF6B00]/5 transition-all duration-300`}>
                                  <div>
                                    <div className="border-b border-gray-400/10 pb-3 mb-4">
                                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Meteorological Deep Dive</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3">
                                        <Gauge className="w-8 h-8 text-[#FF6B00] flex-shrink-0 opacity-80" />
                                        <div>
                                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Pressure</p>
                                          <p className="text-sm font-black text-white mt-0.5">{current.main.pressure} hPa</p>
                                        </div>
                                      </div>
                                      <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3">
                                        <Eye className="w-8 h-8 text-[#FF6B00] flex-shrink-0 opacity-80" />
                                        <div>
                                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Visibility</p>
                                          <p className="text-sm font-black text-white mt-0.5">{(current.visibility / 1000).toFixed(1)} km</p>
                                        </div>
                                      </div>
                                      <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3 col-span-2">
                                        <Sunrise className="w-7 h-7 text-[#FF6B00] flex-shrink-0 opacity-80" />
                                        <div className="flex-1 flex justify-between items-center pr-2">
                                          <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Sunrise</p>
                                            <p className="text-xs font-black text-white mt-0.5">{formatTime(activeData.city.sunrise)}</p>
                                          </div>
                                          <Sunset className="w-7 h-7 text-orange-600 flex-shrink-0 opacity-80 ml-4" />
                                          <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Sunset</p>
                                            <p className="text-xs font-black text-white mt-0.5">{formatTime(activeData.city.sunset)}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-bold leading-relaxed pt-4 border-t border-gray-400/10 mt-4">
                                    Daylight duration calculated dynamically relative to geographical coordinates.
                                  </div>
                                </div>

                                {/* 3. 12-HOUR EXPEDITION FORECAST */}
                                <div className={`${cardClass} flex flex-col justify-between hover:border-white/10 hover:shadow-lg hover:shadow-[#FF6B00]/5 transition-all duration-300`}>
                                  <div>
                                    <div className="flex justify-between items-center border-b border-gray-400/10 pb-3 mb-4">
                                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">12-Hour Chrono Forecast</span>
                                      <span className="text-[9px] font-black text-sky-400 uppercase flex items-center gap-1"><Wind className="w-2.5 h-2.5" /> Pass Alert Active</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2.5">
                                      {hourlyList.map((hr, idx) => (
                                        <div
                                          key={idx}
                                          className={`border rounded-2xl p-2.5 text-center flex flex-col items-center hover:scale-[1.05] transition-all duration-200 cursor-default ${
                                            headlightOn
                                              ? hr.isNight
                                                ? "bg-indigo-950/40 border-indigo-800/20 shadow shadow-indigo-900/20"
                                                : "bg-sky-900/20 border-sky-800/15 shadow shadow-sky-900/10"
                                              : "bg-white border-black/8 shadow-sm"
                                          }`}
                                        >
                                          <span className="text-[9px] text-gray-400 font-bold">{hr.time}</span>
                                          <span className="text-xl my-1.5 inline-block animate-weather-float" style={{ animationDelay: `${idx * 0.35}s` }}>
                                            {hr.icon}
                                          </span>
                                          <span className="text-xs font-black">{hr.temp}</span>
                                          <span className="text-[8px] text-sky-400 font-bold mt-1 flex items-center gap-0.5">
                                            <Droplets className="w-2 h-2" /> {hr.rain}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="p-3 bg-orange-600/10 border border-orange-500/20 rounded-xl mt-4">
                                    <p className="text-[9px] text-[#FF6B00] font-medium leading-relaxed">
                                      <strong>Rider Safety</strong>: Wind vectors at {current.wind.speed} m/s. Keep pannier loads balanced.
                                    </p>
                                  </div>
                                </div>

                              </div>

                              {/* 4. 7-DAY OUTLOOK */}
                              <div className="pt-4">
                                <h4 className="text-lg font-black mb-6">7-Day Mountain Outlook</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
                                  {sevenDayList.map((d, i) => (
                                    <div
                                      key={i}
                                      className={`border rounded-2xl p-4 backdrop-blur-md hover:scale-[1.04] hover:border-white/20 transition-all duration-300 ${
                                        headlightOn ? "bg-[#0A131F]/50 border-[#16324F]/30 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                      }`}
                                    >
                                      <p className="text-[10px] text-gray-400 font-black leading-none">{d.day}</p>
                                      <span className="text-3xl my-3 block">{d.icon}</span>
                                      <p className="text-sm font-black">{d.temp}</p>
                                      <p className="text-[9px] text-[#FF6B00] font-black uppercase mt-2 tracking-wider truncate" title={d.cond}>
                                        {d.cond}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          );
                        })()
                      )}
                    </motion.div>
                  )}

                  {/* â”€â”€ 5. RIDE JOURNAL TAB â”€â”€ */}
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

                      {/* Statistics Dashboard Banner */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                          { label: "Total Distance", val: `${journalStats.totalDistance} km`, icon: <Compass className="w-4 h-4 text-orange-500" /> },
                          { label: "Rides Logged", val: journalStats.totalRides, icon: <Bike className="w-4 h-4 text-emerald-500" /> },
                          { label: "Avg Ride Rating", val: `${journalStats.avgRating} / 5.0`, icon: <Star className="fill-orange-500 text-orange-500 w-4 h-4" /> },
                          { label: "Max Lean Angle", val: `${journalStats.maxLean}Â°`, icon: <Zap className="w-4 h-4 text-amber-500" /> },
                          { label: "Total Elevation Climb", val: `${journalStats.totalClimb} m`, icon: <Cloud className="w-4 h-4 text-sky-500" /> },
                        ].map((stat, idx) => (
                          <div key={idx} className={`${cardClass} p-4 flex flex-col justify-between`} style={{ padding: "16px" }}>
                            <div className="flex justify-between items-center text-gray-400">
                              <span className="text-[9px] font-black uppercase tracking-wider">{stat.label}</span>
                              {stat.icon}
                            </div>
                            <span className={`text-lg font-black mt-2 ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{stat.val}</span>
                          </div>
                        ))}
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
                              { label: "Max Lean Angle (Â°)", val: newJournalLean, set: setNewJournalLean, placeholder: "e.g. 42", required: false },
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

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Rating</label>
                              <div className="flex gap-1.5 items-center h-10">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewJournalRating(star)}
                                    className="focus:outline-none"
                                  >
                                    <Star className={`w-5 h-5 transition-colors ${newJournalRating >= star ? "fill-[#FF6B00] text-[#FF6B00]" : "text-gray-400"}`} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Mark Favorite</label>
                              <button
                                type="button"
                                onClick={() => setNewJournalFavorite(!newJournalFavorite)}
                                className={`flex items-center justify-center h-10 w-24 rounded-xl border transition-all ${
                                  newJournalFavorite
                                    ? "bg-red-500/10 border-red-500 text-red-500"
                                    : "border-white/10 text-gray-400 hover:text-white"
                                }`}
                              >
                                <Heart className={`w-4 h-4 mr-1.5 ${newJournalFavorite ? "fill-red-500" : ""}`} />
                                <span className="text-[10px] font-black uppercase">{newJournalFavorite ? "Yes" : "No"}</span>
                              </button>
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
                              <div
                                className={`${cardClass} hover:scale-[1.01] transition-transform duration-300 cursor-pointer`}
                                onClick={() => setExpandedJournalId(expandedJournalId === log.id ? null : log.id)}
                              >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                  
                                  {log.image && (
                                    <div className="md:col-span-3 relative h-28 rounded-2xl overflow-hidden border border-white/5">
                                      <Image src={log.image} alt={log.title} fill className="object-cover" />
                                    </div>
                                  )}

                                  <div className={log.image ? "md:col-span-9 space-y-3" : "md:col-span-12 space-y-3"}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-gray-400/10 pb-3">
                                      <div className="flex justify-between items-start w-full md:w-auto">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h4 className="text-base font-black leading-tight text-[#FF6B00]">{log.title}</h4>
                                            {log.isRoute && (
                                              <span className="text-[8px] bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                                                Route
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{log.date} Â· {log.motorcycle}</p>
                                          <div className="flex gap-0.5 mt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                              <Star key={i} className={`w-3 h-3 ${i < (log.rating || 5) ? "fill-[#FF6B00] text-[#FF6B00]" : "text-gray-600"}`} />
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                        <div className="flex flex-wrap gap-2 text-[10px] font-black">
                                          <span className="bg-black/45 border border-white/5 text-gray-300 px-3 py-1.5 rounded-full">
                                            Dist: {log.distance} km
                                          </span>
                                          {log.leanAngle && (
                                            <span className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] px-3 py-1.5 rounded-full">
                                              Lean: {log.leanAngle}Â°
                                            </span>
                                          )}
                                          <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1.5 rounded-full">
                                            Alt: {log.elevation}m
                                          </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleToggleFavoriteJournal(log.id);
                                            }}
                                            className={`p-2 rounded-xl border transition-all ${
                                              log.favorite
                                                ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                                                : "border-white/5 text-gray-500 hover:text-red-500 hover:bg-white/5"
                                            }`}
                                            title="Mark as Favorite"
                                          >
                                            <Heart className={`w-3.5 h-3.5 ${log.favorite ? "fill-red-500 text-red-500" : ""}`} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-xs leading-relaxed text-gray-300 font-medium">{log.notes}</p>
                                    
                                    {expandedJournalId === log.id && (
                                      <div className="pt-4 border-t border-white/5 space-y-4 text-xs text-gray-400 font-semibold">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                          {log.isRoute ? (
                                            <>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Start Location</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{log.start}</span>
                                              </div>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Destination</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{log.end}</span>
                                              </div>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Est. Duration</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{log.duration}</span>
                                              </div>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Fuel Cost</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>â‚¹{log.fuelCost} ({log.fuelRequired ? `${log.fuelRequired.toFixed(1)} L` : "N/A"})</span>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Motorcycle Used</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{log.motorcycle}</span>
                                              </div>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Expedition Rating</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{log.rating} / 5 Stars</span>
                                              </div>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Peak Altitude</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{log.elevation} m</span>
                                              </div>
                                              <div>
                                                <span className="text-[10px] text-gray-500 uppercase block">Lean Angle Reach</span>
                                                <span className={`font-black ${headlightOn ? "text-white" : "text-[#0B1520]"}`}>{log.leanAngle || "0"}Â°</span>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                        
                                        <div className="flex gap-3 pt-2">
                                          {log.isRoute && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleLoadRoute({
                                                  id: log.id,
                                                  name: log.title,
                                                  start: log.start || "",
                                                  end: log.end || "",
                                                  coordinates: log.coordinates || [],
                                                  option: log.option || "Scenic",
                                                  distance: log.distance,
                                                  duration: log.duration || "",
                                                  roadType: log.roadType || "",
                                                  elevation: log.elevation,
                                                  fuelCost: log.fuelCost || 0,
                                                  fuelRequired: log.fuelRequired || 0,
                                                  date: log.date,
                                                  motorcycle: log.motorcycle
                                                });
                                                setActiveTab("My Routes");
                                              }}
                                              className="px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-[10px] font-black transition-all"
                                            >
                                              Load Route in Planner
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteSavedRoute(log.id);
                                            }}
                                            className="px-4 py-2 border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-[10px] font-black transition-all"
                                          >
                                            Delete Log
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* â”€â”€ 6. PACKING ASSISTANT TAB (Circular Progress) â”€â”€ */}
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

                          {/* Trip Templates & Reset */}
                          <div className="w-full mt-6 space-y-4 pt-4 border-t border-white/5">
                            <div className="flex flex-col gap-1.5 text-left">
                              <label className="text-[10px] font-black uppercase text-gray-400">Apply Trip Template</label>
                              <div className="grid grid-cols-2 gap-2">
                                {(["Mountain Climb", "Coastal Cruise", "Weekend Getaway"] as const).map((template) => (
                                  <button key={template} type="button" onClick={() => handleApplyTemplate(template)} className="py-2 px-3 text-[9px] font-black uppercase tracking-wider rounded-xl border transition-all duration-200 border-white/10 text-white/70 hover:text-white hover:bg-white/5">
                                    {template}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  onClick={handleResetPacking}
                                  className="col-span-2 py-2 px-3 text-[9px] font-black uppercase tracking-wider rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                                >
                                  Reset Packed Items
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`lg:col-span-2 ${cardClass}`}>
                          <h4 className="text-lg font-black mb-6 pb-4 border-b border-gray-400/10">Expedition Checklists</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              {[
                                { title: "ðŸ›¡ï¸ Riding Gear", cat: "gear" as const },
                                { title: "ðŸ“‹ Documentation", cat: "docs" as const },
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
                                { title: "ðŸ”§ Tools & Spares", cat: "tools" as const },
                                { title: "ðŸ©¹ Personal & Medical", cat: "personal" as const },
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

                  {/* â”€â”€ 7. EMERGENCY SOS TAB â”€â”€ */}
                  {activeTab === "Emergency SOS" && (
                    <div className="space-y-8">

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-black">Emergency SOS & Safety Hub</h2>
                          <p className="text-xs text-gray-400 font-semibold mt-1">One-tap SOS dispatch, emergency contacts, GPS tracking, and offline safety guide.</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black ${
                          sosActive ? "bg-red-500/15 border-red-500/40 text-red-400 animate-pulse" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${sosActive ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
                          {sosActive ? "SOS TRANSMITTING" : "System Ready"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className={`${cardClass} flex flex-col gap-5`}>
                          <div className="flex justify-between items-center border-b border-gray-400/10 pb-4">
                            <h4 className="text-base font-black">GPS Location</h4>
                            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                              {realGpsCoords ? "Live" : "Simulated"}
                            </span>
                          </div>

                          <div className="h-[180px] rounded-2xl overflow-hidden border border-white/5 bg-[#070e17] relative z-10">
                            <div ref={sosMapContainerRef} className="w-full h-full" />
                          </div>

                          <div className="space-y-2">
                            {[
                              { label: "Latitude", value: gpsCoords.lat },
                              { label: "Longitude", value: gpsCoords.lng },
                              { label: "Altitude", value: gpsCoords.alt },
                              { label: "Device Sync", value: activeBike.name },
                            ].map((loc) => (
                              <div key={loc.label} className="border-b border-gray-400/5 pb-1.5 flex justify-between text-xs">
                                <span className="text-gray-400 font-bold">{loc.label}</span>
                                <span className="font-black text-white truncate max-w-[140px] text-right">{loc.value}</span>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={handleGetGPS}
                            disabled={gpsLoading}
                            className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                          >
                            {gpsLoading ? (
                              <><span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> Acquiring Signal...</>
                            ) : (
                              <><Compass className="w-3.5 h-3.5" /> Get Real GPS Location</>
                            )}
                          </button>
                          {gpsError && <p className="text-[10px] text-red-400 font-semibold text-center -mt-2">{gpsError}</p>}
                          {realGpsCoords && (
                            <a
                              href={`https://www.google.com/maps?q=${realGpsCoords.lat},${realGpsCoords.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-400 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5"
                            >
                              <Map className="w-3 h-3" /> Open in Google Maps
                            </a>
                          )}
                        </div>

                        <div className={`border rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between transition-colors duration-500 ${
                          sosActive
                            ? "bg-red-950/80 border-red-500/40 text-white"
                            : headlightOn
                            ? "bg-[#0A131F]/80 border-[#16324F]/30 text-white shadow-black/30"
                            : "bg-white border-black/10 text-[#0B1520]"
                        }`}>
                          <div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-400/10 mb-5">
                              <h4 className="text-base font-black text-red-500">Emergency Satellite Dispatch</h4>
                              <span className="text-[10px] text-gray-400 font-bold uppercase">Distress Beacon</span>
                            </div>

                            {!sosTriggered && !sosActive && (
                              <div className="text-center py-8 max-w-xs mx-auto">
                                <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-3 animate-bounce" />
                                <h5 className="text-xs font-black uppercase tracking-wider mb-2 text-white">Emergency Response Warning</h5>
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Triggering the SOS dispatch transmits coordinates to Search & Rescue networks. Only use in critical distress situations.</p>
                              </div>
                            )}

                            {sosTriggered && !sosActive && (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center font-black text-3xl text-red-500 mx-auto mb-3 animate-ping">{sosCountdown}</div>
                                <h5 className="text-xs font-black uppercase tracking-wider text-red-500">Transmitting Satellite Signal...</h5>
                                <p className="text-[10px] text-gray-400 mt-1">Click Cancel SOS to abort immediately.</p>
                              </div>
                            )}

                            {sosActive && (
                              <div className="text-center py-5">
                                <div className="relative w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                                  <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" />
                                  <div className="absolute inset-2 rounded-full border-2 border-red-500/50 animate-pulse" />
                                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                                <h5 className="text-sm font-black uppercase tracking-wider text-red-400">SOS ACTIVE & TRANSMITTING</h5>
                                <p className="text-[10px] text-white/80 max-w-xs mx-auto mt-1.5 leading-relaxed font-bold">
                                  GPS: {gpsCoords.lat}, {gpsCoords.lng} transmitted. Dispatching search team.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-center gap-3 mt-5">
                            {!sosTriggered && !sosActive ? (
                              <button onClick={triggerSos} className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs tracking-widest uppercase rounded-2xl shadow-lg shadow-red-600/35 transition-colors">
                                Trigger Satellite SOS
                              </button>
                            ) : (
                              <button onClick={cancelSos} className="px-6 py-3.5 bg-black/60 border border-white/10 hover:border-white/20 text-white font-black text-xs tracking-widest uppercase rounded-2xl transition-all">
                                Cancel SOS Transmission
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={`${cardClass} flex flex-col gap-4`}>
                          <div className="flex justify-between items-center border-b border-gray-400/10 pb-4">
                            <h4 className="text-base font-black">Emergency Contacts</h4>
                            <button
                              onClick={() => setShowAddContact(!showAddContact)}
                              className="w-7 h-7 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center text-[#FF6B00] hover:bg-[#FF6B00]/20 transition-all"
                            >
                              {showAddContact ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {showAddContact && (
                            <form onSubmit={handleAddContact} className="space-y-2.5 p-3 rounded-xl bg-black/15 border border-white/5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#FF6B00] mb-1">New Contact</p>
                              {[
                                { placeholder: "Full Name *", value: newContactName, setter: setNewContactName },
                                { placeholder: "Phone Number *", value: newContactPhone, setter: setNewContactPhone },
                                { placeholder: "Relation (e.g. Father)", value: newContactRelation, setter: setNewContactRelation },
                              ].map((field, i) => (
                                <input
                                  key={i}
                                  type={i === 1 ? "tel" : "text"}
                                  placeholder={field.placeholder}
                                  value={field.value}
                                  onChange={(e) => field.setter(e.target.value)}
                                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                    headlightOn ? "bg-black/45 border-white/10 text-white placeholder-gray-600" : "bg-white border-black/10 text-[#0B1520]"
                                  }`}
                                />
                              ))}
                              <button type="submit" className="w-full py-2 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all">
                                Save Contact
                              </button>
                            </form>
                          )}

                          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[280px]">
                            {emergencyContacts.length === 0 ? (
                              <div className="text-center py-8">
                                <Phone className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-500 font-semibold">No emergency contacts yet.</p>
                                <p className="text-[10px] text-gray-600 mt-0.5">Click + to add your first contact.</p>
                              </div>
                            ) : (
                              emergencyContacts.map((contact) => (
                                <div key={contact.id} className={`p-3 rounded-xl border transition-all ${
                                  contact.isPrimary
                                    ? "bg-[#FF6B00]/10 border-[#FF6B00]/30"
                                    : headlightOn ? "bg-black/20 border-white/5" : "bg-gray-50 border-black/5"
                                }`}>
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-black truncate">{contact.name}</p>
                                        {contact.isPrimary && (
                                          <span className="flex-shrink-0 text-[8px] bg-[#FF6B00] text-white px-1.5 py-0.5 rounded-full font-black">PRIMARY</span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{contact.relation}</p>
                                      <p className="text-[10px] font-black text-emerald-400 mt-0.5">{contact.phone}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <a
                                        href={`tel:${contact.phone}`}
                                        className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                        title="Call"
                                      >
                                        <Phone className="w-3 h-3" />
                                      </a>
                                      {!contact.isPrimary && (
                                        <button
                                          onClick={() => handleSetPrimaryContact(contact.id)}
                                          className="w-7 h-7 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center text-[#FF6B00] hover:bg-[#FF6B00]/30 transition-all"
                                          title="Set as Primary"
                                        >
                                          <Star className="w-3 h-3" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteContact(contact.id)}
                                        className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className={cardClass}>
                          <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 border-b border-gray-400/5 pb-2">National Emergency Helplines</h4>
                          <div className="space-y-2.5">
                            {[
                              { title: "National Emergency", number: "112" },
                              { title: "Police Control Room", number: "100" },
                              { title: "Ambulance Services", number: "108" },
                              { title: "Fire Brigade", number: "101" },
                              { title: "Himalayan Rescue CMD", number: "+91-177-2621401" },
                              { title: "Kaza Police Station", number: "+91-1906-222212" },
                              { title: "Manali Alpine Medical", number: "+91-1902-253385" },
                              { title: "Highway Helpline (NH)", number: "1033" },
                            ].map((call) => (
                              <div key={call.title} className="p-2.5 bg-black/15 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                  <p className="font-black text-[9px] text-gray-400">{call.title}</p>
                                  <p className="font-bold text-white text-xs mt-0.5">{call.number}</p>
                                </div>
                                <a
                                  href={`tel:${call.number}`}
                                  className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={cardClass}>
                          <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 border-b border-gray-400/5 pb-2">Nearby Essential Services</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mb-4">
                            {realGpsCoords ? "Using your real GPS location." : "Using simulated location. Get GPS for accurate results."}
                          </p>
                          <div className="space-y-3">
                            {[
                              { label: "Nearest Hospitals", query: "hospitals near me", icon: "ðŸ¥", desc: "Emergency medical facilities" },
                              { label: "Petrol / Fuel Stations", query: "petrol pump near me", icon: "â›½", desc: "Refuel points along your route" },
                              { label: "Motorcycle Service Centers", query: "motorcycle service center near me", icon: "ðŸ”§", desc: "Repairs and breakdown support" },
                              { label: "Police Stations", query: "police station near me", icon: "ðŸš”", desc: "Law enforcement & assistance" },
                              { label: "Pharmacies", query: "pharmacy near me", icon: "ðŸ’Š", desc: "Medications and first-aid supplies" },
                            ].map((place) => {
                              const mapsUrl = realGpsCoords
                                ? `https://www.google.com/maps/search/${encodeURIComponent(place.query)}/@${realGpsCoords.lat},${realGpsCoords.lng},14z`
                                : `https://www.google.com/maps/search/${encodeURIComponent(place.query)}`;
                              return (
                                <a
                                  key={place.label}
                                  href={mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] ${
                                    headlightOn ? "bg-black/20 border-white/5 hover:bg-white/5" : "bg-gray-50 border-black/5 hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="w-9 h-9 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center flex-shrink-0 text-base">
                                    {place.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black truncate">{place.label}</p>
                                    <p className="text-[9px] text-gray-500 font-semibold">{place.desc}</p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                </a>
                              );
                            })}
                          </div>
                        </div>

                        <div className={cardClass}>
                          <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 border-b border-gray-400/5 pb-2">Offline Safety Guide</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mb-4">Critical procedures â€” available offline, no internet required.</p>
                          <div className="space-y-2">
                            {[
                              {
                                id: "accident", title: "Accident First Response", icon: "ðŸš‘",
                                steps: [
                                  "Move to a safe zone â€” off the road and away from traffic.",
                                  "Check yourself for injuries before helping others.",
                                  "Call 112 (National Emergency) immediately.",
                                  "Do NOT move an injured person unless there is immediate danger.",
                                  "Apply direct pressure to bleeding wounds with cloth.",
                                  "Keep the injured person warm and calm.",
                                  "Share your GPS coordinates with rescue teams.",
                                ],
                              },
                              {
                                id: "tyre", title: "Tyre Puncture Procedure", icon: "🛞",
                                steps: [
                                  "Grip handlebars firmly — do NOT brake suddenly.",
                                  "Gradually reduce speed and ease to the road shoulder.",
                                  "Turn on hazard lights / use reflective triangles.",
                                  "Locate your puncture repair kit.",
                                  "Remove the wheel and locate the puncture source.",
                                  "Use tyre plugs for tubeless or patch kit for tubes.",
                                  "Re-inflate to correct pressure (check tyre sidewall).",
                                ],
                              },
                              {
                                id: "stall", title: "Engine Stall Recovery", icon: "⚡",
                                steps: [
                                  "Coast to a safe stop on the road shoulder.",
                                  "Check fuel level — empty? Call for fuel delivery.",
                                  "Check kill switch — must be in ON position.",
                                  "Check choke setting for cold weather starts.",
                                  "Inspect spark plug connections for loose contacts.",
                                  "Check battery terminals for corrosion.",
                                  "If no fix, call roadside: 1033 (NH Helpline).",
                                ],
                              },
                              {
                                id: "weather", title: "Severe Weather Protocol", icon: "â›ˆï¸",
                                steps: [
                                  "Pull over immediately during lightning or hail.",
                                  "Seek shelter under a bridge or solid structure.",
                                  "Never shelter under isolated trees.",
                                  "Wait for storm to fully pass before riding.",
                                  "In fog: use low-beam headlights and hazard flashers.",
                                  "In snow/ice: shift to low gear and reduce speed by 50%.",
                                  "Black ice: do NOT brake â€” release throttle slowly.",
                                ],
                              },
                              {
                                id: "rescue", title: "Mountain Rescue Signals", icon: "ðŸ”ï¸",
                                steps: [
                                  "International distress: 6 signals per minute (any form).",
                                  "Mirror flash: reflect sunlight toward rescuers.",
                                  "Whistle: 3 short blasts = distress signal.",
                                  "Bright clothing: spread on open ground for aerial visibility.",
                                  "HELP in stones/snow: arrange large letters in clearing.",
                                  "Fire signal: 3 fires in triangle — universal distress.",
                                  "GPS: share coordinates from this app with rescue teams.",
                                ],
                              },
                            ].map((section) => (
                              <div key={section.id} className={`rounded-xl border overflow-hidden ${headlightOn ? "border-white/5" : "border-black/5"}`}>
                                <button
                                  onClick={() => setOpenSafetySection(openSafetySection === section.id ? null : section.id)}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black transition-all ${
                                    openSafetySection === section.id
                                      ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                                      : headlightOn ? "bg-black/20 hover:bg-white/5 text-white" : "bg-gray-50 hover:bg-gray-100 text-[#0B1520]"
                                  }`}
                                >
                                  <span className="flex items-center gap-2"><span>{section.icon}</span>{section.title}</span>
                                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${openSafetySection === section.id ? "rotate-90" : ""}`} />
                                </button>
                                {openSafetySection === section.id && (
                                  <div className="px-4 py-3 space-y-1.5 border-t border-white/5">
                                    {section.steps.map((step, i) => (
                                      <div key={i} className="flex gap-2.5 text-[10px] font-semibold text-gray-400">
                                        <span className="w-4 h-4 flex-shrink-0 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] flex items-center justify-center font-black text-[8px]">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* ── 8. SETTINGS TAB ── */}
                  {activeTab === "Settings" && (
                    <div className="space-y-8">
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl font-black">Settings &amp; User Preferences</h2>
                        <p className="text-xs text-gray-400 font-semibold mt-1">Configure your pilot profile, units, navigation map styles, notification feeds, and local backups.</p>
                      </div>

                      {/* Main Settings Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Section 1: Rider Profile */}
                        <div className={cardClass}>
                          <div className="flex items-center gap-2 mb-6 border-b border-gray-400/10 pb-4">
                            <User className="w-5 h-5 text-[#FF6B00]" />
                            <h3 className="text-base font-black">Rider Profile</h3>
                          </div>
                          
                          <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Full Name</label>
                                <input
                                  type="text"
                                  value={displayName}
                                  onChange={(e) => setDisplayName(e.target.value)}
                                  className={`theme-transition border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                    headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                  }`}
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Username</label>
                                <input
                                  type="text"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  className={`theme-transition border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                    headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Email Address</label>
                                <input
                                  type="email"
                                  value={riderEmail}
                                  onChange={(e) => setRiderEmail(e.target.value)}
                                  className={`theme-transition border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                    headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                  }`}
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Phone / Sat Connection</label>
                                <input
                                  type="text"
                                  value={riderPhone}
                                  onChange={(e) => setRiderPhone(e.target.value)}
                                  className={`theme-transition border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                    headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Emergency Blood Group</label>
                              <select
                                value={riderBloodGroup}
                                onChange={(e) => setRiderBloodGroup(e.target.value)}
                                className={`theme-transition border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              >
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                  <option key={bg} value={bg} className={headlightOn ? "bg-[#0b131f] text-white" : "bg-white text-black"}>{bg}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Bio &amp; Rider Description</label>
                              <textarea
                                value={riderBio}
                                onChange={(e) => setRiderBio(e.target.value)}
                                rows={2}
                                className={`theme-transition border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                            </div>

                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" /> Save Rider Profile
                            </button>
                          </form>
                        </div>

                        {/* Section 2: Preferences & Units */}
                        <div className={cardClass}>
                          <div className="flex items-center gap-2 mb-6 border-b border-gray-400/10 pb-4">
                            <Compass className="w-5 h-5 text-[#FF6B00]" />
                            <h3 className="text-base font-black">Ride Preferences &amp; Units</h3>
                          </div>

                          <form onSubmit={handleSavePreferences} className="space-y-5">
                            {/* Units Toggles */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Distance Units</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {(["km", "mi"] as const).map((unit) => (
                                    <button
                                      key={unit}
                                      type="button"
                                      onClick={() => setDistanceUnit(unit)}
                                      className={`py-2 text-xs font-black rounded-xl border transition-all ${
                                        distanceUnit === unit
                                          ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]"
                                          : headlightOn ? "border-white/5 hover:bg-white/5 text-white/60" : "border-black/5 hover:bg-black/5 text-gray-500"
                                      }`}
                                    >
                                      {unit.toUpperCase()}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Temperature Units</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {(["°C", "°F"] as const).map((unit) => (
                                    <button
                                      key={unit}
                                      type="button"
                                      onClick={() => setTempUnit(unit)}
                                      className={`py-2 text-xs font-black rounded-xl border transition-all ${
                                        tempUnit === unit
                                          ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]"
                                          : headlightOn ? "border-white/5 hover:bg-white/5 text-white/60" : "border-black/5 hover:bg-black/5 text-gray-500"
                                      }`}
                                    >
                                      {unit}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Default Route Option */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Default Route Mode</label>
                              <select
                                value={defaultRouteMode}
                                onChange={(e) => setDefaultRouteMode(e.target.value as "Scenic" | "Fastest" | "Highway")}
                                className={`theme-transition border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              >
                                {["Scenic", "Fastest", "Highway"].map((mode) => (
                                  <option key={mode} value={mode} className={headlightOn ? "bg-[#0b131f] text-white" : "bg-white text-black"}>{mode}</option>
                                ))}
                              </select>
                            </div>

                            {/* Active Motorcycle */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Default Motorcycle</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {motorcyclesList.map((bike) => (
                                  <button
                                    key={bike.id}
                                    type="button"
                                    onClick={() => handleSelectBike(bike)}
                                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-all border ${
                                      activeBike.id === bike.id
                                        ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]"
                                        : headlightOn ? "border-white/5 hover:bg-white/5 text-white/60" : "border-black/5 hover:bg-black/5 text-gray-500"
                                    }`}
                                  >
                                    <Bike className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{bike.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" /> Save Ride Preferences
                            </button>
                          </form>
                        </div>

                        {/* Section 3: Theme & Map Settings */}
                        <div className={cardClass}>
                          <div className="flex items-center gap-2 mb-6 border-b border-gray-400/10 pb-4">
                            <Map className="w-5 h-5 text-[#FF6B00]" />
                            <h3 className="text-base font-black">Theme &amp; Map Settings</h3>
                          </div>

                          <div className="space-y-4">
                            {/* Headlight Mode */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/15 border border-white/5">
                              <div>
                                <p className="text-xs font-black">Headlight Theme</p>
                                <p className="text-[9px] text-gray-400 font-medium mt-0.5">Switch day (light) and night (dark) views</p>
                              </div>
                              <button
                                onClick={handleToggleHeadlight}
                                className={`relative flex items-center rounded-xl overflow-hidden border transition-all duration-500 ${
                                  headlightOn ? "border-[#FF6B00]/35" : "border-black/10"
                                }`}
                              >
                                <div className={`flex items-center gap-1 px-2.5 py-1.5 transition-all duration-500 ${!headlightOn ? "bg-amber-55 text-amber-700 font-bold" : "bg-black/20 text-white/20"}`}>
                                  <Sun className="w-3 h-3" />
                                  <span className="text-[9px] font-black">Day</span>
                                </div>
                                <div className={`flex items-center gap-1 px-2.5 py-1.5 transition-all duration-500 ${headlightOn ? "bg-[#FF6B00]/15 text-[#FF6B00] font-bold" : "bg-white/10 text-gray-400"}`}>
                                  <Zap className="w-3 h-3" />
                                  <span className="text-[9px] font-black">Night</span>
                                </div>
                              </button>
                            </div>

                            {/* Map Provider Selector */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">Map Tile Provider</label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { value: "osm", label: "OpenStreetMap" },
                                  { value: "carto", label: "CARTO Matter" },
                                  { value: "topo", label: "OpenTopoMap" },
                                ].map((prov) => (
                                  <button
                                    key={prov.value}
                                    type="button"
                                    onClick={() => setMapTileProvider(prov.value as "osm" | "carto" | "topo")}
                                    className={`py-2 text-[10px] font-black rounded-xl border transition-all ${
                                      mapTileProvider === prov.value
                                        ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]"
                                        : headlightOn ? "border-white/5 hover:bg-white/5 text-white/60" : "border-black/5 hover:bg-black/5 text-gray-500"
                                    }`}
                                  >
                                    {prov.label}
                                  </button>
                                ))}
                              </div>
                              <p className="text-[9px] text-gray-500 font-semibold mt-1">
                                Map provider tiles update dynamically on your Route Planner map views.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Meteorological Settings */}
                        <div className={cardClass}>
                          <div className="flex items-center gap-2 mb-6 border-b border-gray-400/10 pb-4">
                            <Cloud className="w-5 h-5 text-[#FF6B00]" />
                            <h3 className="text-base font-black">Meteorological Settings</h3>
                          </div>

                          <form onSubmit={handleSaveApiKey} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase text-gray-400">OpenWeather Map API Key</label>
                              <input
                                type="text"
                                value={openWeatherApiKey}
                                onChange={(e) => setOpenWeatherApiKey(e.target.value)}
                                placeholder="Enter your OpenWeather appid..."
                                className={`theme-transition border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF6B00] ${
                                  headlightOn ? "bg-black/45 border-white/10 text-white" : "bg-white border-black/10 text-[#0B1520]"
                                }`}
                              />
                              <p className="text-[9px] text-gray-500 font-semibold leading-relaxed mt-1">
                                Paste your API key to load live mountain radar feeds. If blank, RideSync defaults to Spiti valley simulated pass conditions.
                              </p>
                            </div>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all"
                            >
                              Save API Key
                            </button>
                          </form>
                        </div>

                        {/* Section 5: Notification Preferences */}
                        <div className={cardClass}>
                          <div className="flex items-center gap-2 mb-6 border-b border-gray-400/10 pb-4">
                            <Bell className="w-5 h-5 text-[#FF6B00]" />
                            <h3 className="text-base font-black">Notification Settings</h3>
                          </div>

                          <div className="space-y-3">
                            {[
                              { label: "Push Notifications", desc: "Real-time navigation and speed alarms", state: notifPush, setter: setNotifPush, icon: <Compass className="w-3.5 h-3.5 text-sky-400" /> },
                              { label: "Email Alerts", desc: "Weekly ride summary reports and backup syncs", state: notifEmail, setter: setNotifEmail, icon: <Mail className="w-3.5 h-3.5 text-emerald-400" /> },
                              { label: "SOS Incident Feeds", desc: "High-priority crash & distress satellite alerts", state: notifSosAlerts, setter: setNotifSosAlerts, icon: <Shield className="w-3.5 h-3.5 text-red-400" /> },
                              { label: "Alert Sound FX", desc: "Acoustic audio cues for radar warnings", state: notifSound, setter: setNotifSound, icon: <Volume2 className="w-3.5 h-3.5 text-amber-400" /> },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-black/15 border border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-black/20 border border-white/5 flex items-center justify-center flex-shrink-0">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <p className="text-xs font-black">{item.label}</p>
                                    <p className="text-[9px] text-gray-500 font-semibold">{item.desc}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => item.setter(!item.state)}
                                  className={`w-10 h-6 rounded-full p-0.5 transition-all duration-300 ${
                                    item.state ? "bg-[#FF6B00]" : "bg-gray-700"
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-full bg-white transition-all duration-300 transform ${
                                    item.state ? "translate-x-4" : "translate-x-0"
                                  }`} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 6: Backup & Data Operations */}
                        <div className={cardClass}>
                          <div className="flex items-center gap-2 mb-6 border-b border-gray-400/10 pb-4">
                            <FileDown className="w-5 h-5 text-[#FF6B00]" />
                            <h3 className="text-base font-black">Local Backups &amp; Data Control</h3>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Export JSON */}
                              <button
                                type="button"
                                onClick={handleExportAllData}
                                className="py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-400 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
                              >
                                <FileDown className="w-4 h-4" /> Export Data (JSON)
                              </button>

                              {/* Import JSON */}
                              <label className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center">
                                <Upload className="w-4 h-4" /> Import Data (JSON)
                                <input
                                  type="file"
                                  accept=".json"
                                  onChange={handleImportAllData}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            <div className="border-t border-white/5 pt-4 space-y-3">
                              {/* Clear Storage */}
                              <button
                                type="button"
                                onClick={() => setShowClearConfirm(true)}
                                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
                              >
                                <Trash2 className="w-4 h-4" /> Clear All Local Data
                              </button>

                              {/* Logout */}
                              <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full py-3 bg-black/45 border border-white/5 hover:bg-white/5 text-gray-400 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
                              >
                                <LogOut className="w-4 h-4" /> Logout Account
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Section 7: About RideSync */}
                      <div className={cardClass}>
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-400/10 pb-4">
                          <Info className="w-5 h-5 text-[#FF6B00]" />
                          <h3 className="text-base font-black">About RideSync AI</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-400">
                          <div>
                            <p className="font-bold text-white mb-1">Release Version</p>
                            <p className="font-semibold text-gray-500">v1.4.2-Himalayan (Production)</p>
                            <p className="font-semibold text-gray-500 mt-2">Active telemetry sync link established via Himalayan Rescue Command.</p>
                          </div>
                          <div>
                            <p className="font-bold text-white mb-1">Telemetry Sync Status</p>
                            <p className="font-semibold text-emerald-400">Connected &amp; Secure (Iridium-9)</p>
                            <p className="font-semibold text-gray-500 mt-2">Designed for motorcycle tours in high-altitude extreme terrain environments.</p>
                          </div>
                          <div>
                            <p className="font-bold text-white mb-1">Rescue Support Registry</p>
                            <p className="font-semibold text-gray-500">Official Himalayan Rescue CMD Satellite Link</p>
                            <a
                              href="tel:+91-177-2621401"
                              className="inline-block mt-2 text-[#FF6B00] hover:underline font-black"
                            >
                              Emergency Helpline: +91-177-2621401
                            </a>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-600 font-semibold text-center border-t border-white/5 mt-6 pt-4">
                          &copy; 2026 RideSync AI System Command. Built for Himalayan Explorers. All rights reserved.
                        </p>
                      </div>

                      {/* Custom Glassmorphism Confirm Modal for Clear Storage */}
                      {showClearConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                          <div className={`w-full max-w-sm rounded-3xl border p-6 text-center ${
                            headlightOn ? "bg-[#0b1320] border-white/10 text-white" : "bg-white border-black/10 text-black"
                          }`}>
                            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mx-auto mb-4">
                              <AlertTriangle className="w-6 h-6 animate-pulse" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-wider mb-2">Delete Local Data?</h4>
                            <p className="text-xs text-gray-400 font-semibold leading-relaxed mb-6">
                              This will permanently delete your custom motorcycles, journal entries, packing lists, and emergency contacts. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setShowClearConfirm(false)}
                                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                                  headlightOn ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-black"
                                }`}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowClearConfirm(false);
                                  handleClearAllData();
                                }}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all"
                              >
                                Delete Everything
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FLOATING GLOBAL AI CHATBOX
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MOBILE MENU DRAWER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â”€â”€ Add Motorcycle Modal â”€â”€ */}
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

      {/* â”€â”€ Edit Motorcycle Modal â”€â”€ */}
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

