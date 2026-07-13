"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Map,
  Compass,
  Bike,
  Cloud,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Navigation,
  Activity,
  Calendar,
  AlertCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const menuItems = [
    { label: "Overview", icon: <Compass className="w-5 h-5" /> },
    { label: "My Routes", icon: <Map className="w-5 h-5" /> },
    { label: "Garage", icon: <Bike className="w-5 h-5" /> },
    { label: "Weather Radar", icon: <Cloud className="w-5 h-5" /> },
    { label: "Ride Journal", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    // Redirect back to login with a logout confirmation message
    router.push("/login?message=You+have+been+logged+out+successfully.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#16324F]">
      
      {/* ─── SIDEBAR (Desktop) ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200/80 p-6 flex-shrink-0 justify-between">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00] flex items-center justify-center shadow-md shadow-[#FF6B00]/30">
              <Map className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-md tracking-tight">
              RideSync <span className="text-[#FF6B00]">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.label
                    ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                    : "text-[#16324F]/65 hover:text-[#16324F] hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Bottom */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50/50 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-[#16324F]/70 hover:bg-gray-50"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black tracking-tight">RideSync Control Center</h1>
          </div>

          {/* User profile + Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#16324F]/10 border-2 border-[#FF6B00] flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-[#16324F]" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Rider</p>
                <p className="text-sm font-black -mt-0.5">Welcome Rider</p>
              </div>
            </div>
            
            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/30 text-gray-400 hover:text-red-600 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#16324F] to-[#1e4a70] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden mb-6 shadow-lg shadow-[#16324F]/15">
            {/* Background elements */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-12 bottom-0 w-80 h-full opacity-10 pointer-events-none flex items-end">
              <Bike className="w-64 h-64" />
            </div>

            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold mb-4 text-[#FF6B00]">
                <Activity className="w-3.5 h-3.5" />
                Active Riding Season
              </div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2">Welcome Back, Rider!</h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Your BMW R1250 GS is ready. Weather is optimal, and 3 AI recommended curvy routes are mapped for your weekend tour.
              </p>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Garage Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Motorcycle</span>
                  <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">Connected</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center">
                    <Bike className="w-6 h-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#16324F]">BMW R1250 GS</h3>
                    <p className="text-xs text-[#FF6B00] font-semibold">Trophy Edition (2024)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-xs text-gray-400 font-medium">Odometer</p>
                    <p className="text-lg font-black mt-0.5">12,480 km</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-xs text-gray-400 font-medium">Range</p>
                    <p className="text-lg font-black mt-0.5 text-[#FF6B00]">385 km</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 border border-gray-200 hover:border-[#FF6B00]/50 hover:bg-gray-50 text-sm font-semibold rounded-2xl transition-all">
                Bike Diagnostics
              </button>
            </div>

            {/* Route Map Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recommended Route</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold">Best Curves</span>
                </div>
                
                {/* Simulated Map */}
                <div className="relative h-32 rounded-2xl bg-[#16324F]/5 border border-gray-100 overflow-hidden mb-4 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full opacity-10">
                    <defs>
                      <pattern id="dash-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="16" stroke="#16324F" strokeWidth="0.5" />
                        <line x1="0" y1="0" x2="16" y2="0" stroke="#16324F" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dash-grid)" />
                  </svg>
                  <svg className="absolute inset-0 w-full h-full">
                    <path d="M 20 100 Q 100 40 180 80 T 320 20" stroke="#FF6B00" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="6 3" />
                    <circle cx="20" cy="100" r="5" fill="#FF6B00" />
                    <circle cx="320" cy="20" r="5" fill="#16324F" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-gray-100 px-2 py-0.5 rounded-lg">
                    <p className="text-[9px] font-black text-[#16324F]">Manali → Spiti Circuit</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Total Distance</p>
                    <p className="font-bold">482 km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Est. Time</p>
                    <p className="font-bold">9h 45m</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Elevation Peak</p>
                    <p className="font-bold">4,590 m</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-[#16324F] hover:bg-[#1a4065] text-white text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF6B00]" />
                Send to GPS
              </button>
            </div>

            {/* Weather Radar Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weather Status</span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Updated Live</span>
                </div>
                
                <div className="flex items-center justify-between mb-4 bg-gradient-to-br from-blue-50/50 to-blue-50/10 border border-blue-50/20 rounded-2xl p-4">
                  <div>
                    <p className="text-3xl font-black text-[#16324F]">18°C</p>
                    <p className="text-xs text-gray-500 font-medium">Spiti Valley · Clear Sky</p>
                  </div>
                  <Cloud className="w-12 h-12 text-[#FF6B00]/80" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-semibold py-1 border-b border-gray-100">
                    <span className="text-gray-400">Rain Probability</span>
                    <span className="text-green-600">8% (Low)</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold py-1 border-b border-gray-100">
                    <span className="text-gray-400">Wind Velocity</span>
                    <span>22 km/h</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold py-1">
                    <span className="text-gray-400">Visibility Score</span>
                    <span className="text-green-600">Optimal (9.5/10)</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 border border-gray-200 hover:border-[#FF6B00]/50 hover:bg-gray-50 text-sm font-semibold rounded-2xl transition-all">
                Full Meteorological Map
              </button>
            </div>

          </div>

          {/* Upcoming Schedule / Recent Logs Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            
            {/* Upcoming Rides */}
            <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-md font-black mb-4">Scheduled Group Expeditions</h3>
              <div className="space-y-3">
                {[
                  { title: "Zanskar Explorer Tour", date: "July 18, 2026", riders: 6, dist: "750 km", active: true },
                  { title: "Shimla Weekend Ride", date: "August 01, 2026", riders: 4, dist: "320 km", active: false }
                ].map((ride, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-gray-50/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-[#FF6B00]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{ride.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{ride.date}</p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center gap-4 text-xs font-semibold">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{ride.riders} Riders</span>
                      <span className="px-2.5 py-1 rounded-full bg-[#16324F]/5 text-[#16324F]">{ride.dist}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Alerts */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-md font-black mb-4">Rider Alerts & Tips</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-yellow-50/50 border border-yellow-100 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-yellow-800">Altitude Adjustment</h4>
                    <p className="text-[11px] text-yellow-700/80 mt-0.5 leading-relaxed">
                      Kunzum Pass route features rapid elevation change. Take adequate hydration stops.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-2xl">
                  <TrendingUp className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#FF6B00]">Chain Service Recommended</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      You are approaching 500 km since your last clean/lube diagnostics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ─── MOBILE DRAWER MENU ────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          {/* Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer content */}
          <div className="relative w-64 max-w-[280px] bg-white h-full flex flex-col justify-between p-6 animate-slide-right">
            <div className="flex flex-col gap-8">
              {/* Drawer Header */}
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] flex items-center justify-center">
                    <Map className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-black text-md">RideSync</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveTab(item.label);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === item.label
                        ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                        : "text-[#16324F]/65 hover:text-[#16324F] hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Logout drawer bottom */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50/50 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
