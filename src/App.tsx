import React, { useState, useEffect } from "react";
import { 
  Home, 
  LayoutDashboard, 
  PlusCircle, 
  HelpCircle, 
  Activity, 
  FileText, 
  History, 
  LineChart, 
  Video, 
  User, 
  ShieldAlert, 
  Menu, 
  X, 
  Radio
} from "lucide-react";

import { MedicalScan, WellnessRecord } from "./types";
import HomeView from "./components/HomeView";
import DashboardView from "./components/DashboardView";
import ImageAnalysisView from "./components/ImageAnalysisView";
import AiAssistantView from "./components/AiAssistantView";
import WellnessMonitoringView from "./components/WellnessMonitoringView";
import ReportsView from "./components/ReportsView";
import HistoryListView from "./components/HistoryListView";
import AnalyticsView from "./components/AnalyticsView";
import TelemedicineView from "./components/TelemedicineView";
import ProfileView from "./components/ProfileView";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [scans, setScans] = useState<MedicalScan[]>([]);
  const [wellness, setWellness] = useState<WellnessRecord[]>([]);
  const [selectedScan, setSelectedScan] = useState<MedicalScan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Email injected by platform or fallback standard onc email
  const clinicianEmail = "av7065304@gmail.com";

  // Navigation schema matches requirements
  const navigationItems = [
    { name: "Home", icon: Home },
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Image Analysis", icon: PlusCircle },
    { name: "AI Assistant", icon: HelpCircle },
    { name: "Wellness Monitoring", icon: Activity },
    { name: "Reports", icon: FileText },
    { name: "History", icon: History },
    { name: "Analytics", icon: LineChart },
    { name: "Telemedicine", icon: Video },
    { name: "Profile", icon: User },
    { name: "Admin Panel", icon: ShieldAlert }
  ];

  // Fetch scans and wellness indicators from backend Express routes
  const loadClinicalData = async () => {
    try {
      const responseScans = await fetch("/api/scans");
      if (responseScans.ok) {
        setScans(await responseScans.json());
      }
      const responseWel = await fetch("/api/wellness");
      if (responseWel.ok) {
        setWellness(await responseWel.json());
      }
    } catch (err) {
      console.error("Clinical fetching failure", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClinicalData();
  }, []);

  const handleScanSaved = (newScan: MedicalScan) => {
    setScans(prev => [newScan, ...prev]);
  };

  const handleAddWellness = (newRecord: WellnessRecord) => {
    setWellness(prev => [...prev, newRecord]);
  };

  const handleDeleteScan = (id: string) => {
    setScans(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateScanNotes = (id: string, notes: string) => {
    setScans(prev => prev.map(s => s.id === id ? { ...s, notes } : s));
  };

  // Launch XAI / detailed view overlay trigger
  const handleSelectScanForAnalysis = (scan: MedicalScan) => {
    setSelectedScan(scan);
    setActiveTab("Image Analysis");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row antialiased">
      
      {/* Sidebar Navigation Bar */}
      <aside className="w-full md:w-64 max-w-xs shrink-0 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between py-6 md:h-screen sticky top-0 z-40">
        <div className="space-y-6">
          
          {/* Clinic Branding Head */}
          <div className="px-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-500/10 text-teal-400 border border-teal-500/25 rounded-xl">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h1 className="font-bold text-base leading-none tracking-tight font-sans">CancerVision <span className="text-teal-400 font-extrabold text-sm font-mono block mt-0.5">ONCOLOGY AI</span></h1>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Links Nav */}
          <nav className={`px-4 space-y-1 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  id={`nav-tab-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-200 uppercase font-mono tracking-wider ${
                    isActive 
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clinician Profile Summary Foot */}
        <div className="px-5 hidden md:block border-t border-slate-800/80 pt-4 text-left">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">Assigned Oncologist</span>
          <p className="text-xs font-bold text-slate-350 truncate">{clinicianEmail}</p>
          <div className="flex gap-2 items-center mt-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-[10px] text-teal-400 font-semibold font-mono tracking-wide uppercase">Secured Session active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header telemetry */}
        <header className="bg-slate-900/40 border-b border-slate-800/60 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 text-xs font-mono font-bold">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="text-[10px] text-slate-400 font-mono tracking-wide">HIPAA CLOUD ACCESSIBLE</span>
            </div>
            <div className="h-6 w-px bg-slate-850 hidden sm:block" />
            <span className="text-[10px] text-slate-400 font-mono">UTC TIME: 2026-06-04</span>
          </div>
        </header>

        {/* Content body switcher */}
        <div className="p-6 md:p-8 flex-1">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-24">
              <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-mono text-slate-400 animate-pulse">Establishing clinical secure connection...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto h-full">
              {activeTab === "Home" && (
                <HomeView setActiveTab={setActiveTab} />
              )}
              {activeTab === "Dashboard" && (
                <DashboardView 
                  scans={scans} 
                  wellness={wellness} 
                  onSelectScan={handleSelectScanForAnalysis}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === "Image Analysis" && (
                <ImageAnalysisView 
                  onScanSaved={handleScanSaved}
                  userEmail={clinicianEmail}
                />
              )}
              {activeTab === "AI Assistant" && (
                <AiAssistantView userEmail={clinicianEmail} />
              )}
              {activeTab === "Wellness Monitoring" && (
                <WellnessMonitoringView 
                  wellness={wellness}
                  onAddRecord={handleAddWellness}
                />
              )}
              {activeTab === "Reports" && (
                <ReportsView scans={scans} />
              )}
              {activeTab === "History" && (
                <HistoryListView 
                  scans={scans} 
                  onSelectScan={handleSelectScanForAnalysis}
                  onDeleteScan={handleDeleteScan}
                  onUpdateNotes={handleUpdateScanNotes}
                />
              )}
              {activeTab === "Analytics" && (
                <AnalyticsView />
              )}
              {activeTab === "Telemedicine" && (
                <TelemedicineView />
              )}
              {activeTab === "Profile" && (
                <ProfileView userEmail={clinicianEmail} />
              )}
              {activeTab === "Admin Panel" && (
                <AdminPanel />
              )}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
