import React, { useState } from "react";
import { 
  MedicalScan, 
  WellnessRecord 
} from "../types";
import { 
  Activity, 
  AlertTriangle, 
  Brain, 
  Heart, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingDown
} from "lucide-react";

interface DashboardProps {
  scans: MedicalScan[];
  wellness: WellnessRecord[];
  onSelectScan: (scan: MedicalScan) => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({ scans, wellness, onSelectScan, setActiveTab }: DashboardProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Compute stats
  const totalScans = scans.length;
  const highRiskScans = scans.filter(s => s.riskLevel === 'High').length;
  const pendingScans = scans.filter(s => s.status === 'Pending').length;
  const currentWellness = wellness[wellness.length - 1] || {
    bmi: 23.2,
    weight: 67.8,
    heartRate: 70,
    systolicBP: 117,
    diastolicBP: 77,
    sleepHours: 7.2,
    steps: 12500
  };

  // High quality SVG Trend charts
  const renderMiniChart = (data: number[], color: string) => {
    const maxVal = Math.max(...data, 1);
    const minVal = Math.min(...data, 0);
    const range = maxVal - minVal;
    
    const width = 120;
    const height = 40;
    const padding = 5;
    
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-[0_2px_4px_rgba(20,184,166,0.2)]"
        />
        {/* Glow effect */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeOpacity="0.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const stepsData = wellness.map(w => w.steps);
  const heartRateData = wellness.map(w => w.heartRate);
  const weightData = wellness.map(w => w.weight);
  const bpData = wellness.map(w => w.systolicBP);

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-teal-400 font-sans tracking-tight">Oncology Command Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time telemetry, model performance triggers, and urgent oncology triage queues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            Clinical Nodes online
          </span>
          <span className="text-slate-500 text-xs font-mono">UTC 2026-06-04</span>
        </div>
      </div>

      {/* Main Grid: Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Urgent Triage Card */}
        <div 
          onClick={() => setActiveTab("History")}
          className="bg-slate-900/60 hover:bg-slate-900 border border-red-950/45 hover:border-red-900/60 p-5 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-950/30 text-red-400 border border-red-900/40 rounded-xl">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded-md border border-red-900/30">Action Needed</span>
          </div>
          <div className="mt-4">
            <h3 className="text-slate-400 text-xs uppercase font-semibold font-mono tracking-wider">Urgent High-Risk</h3>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{highRiskScans}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-red-400" />
              <span>Requires immediate oncology review</span>
            </p>
          </div>
        </div>

        {/* Pending Analysis Card */}
        <div 
          onClick={() => setActiveTab("Image Analysis")}
          className="bg-slate-900/60 hover:bg-slate-900 border border-yellow-950/40 hover:border-yellow-900/60 p-5 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-yellow-950/30 text-yellow-400 border border-yellow-900/40 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-medium text-yellow-400 bg-yellow-950/40 px-2 py-0.5 rounded-md border border-yellow-900/30">In-Queue</span>
          </div>
          <div className="mt-4">
            <h3 className="text-slate-400 text-xs uppercase font-semibold font-mono tracking-wider">Unresolved Scans</h3>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{pendingScans}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-yellow-400" />
              <span>Diagnostic pipelines active</span>
            </p>
          </div>
        </div>

        {/* Total Scans Card */}
        <div 
          onClick={() => setActiveTab("History")}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-900/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-800/80 text-teal-400 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-medium text-teal-400 bg-teal-950/35 px-2 py-0.5 rounded-md border border-teal-900/30">ML Checked</span>
          </div>
          <div className="mt-4">
            <h3 className="text-slate-400 text-xs uppercase font-semibold font-mono tracking-wider">Processed Studies</h3>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{totalScans}</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>All validation bounds secure</span>
            </p>
          </div>
        </div>

        {/* Active Patients Card */}
        <div 
          onClick={() => setActiveTab("Reports")}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-900/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-800/80 text-blue-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-medium text-blue-400 bg-blue-950/35 px-2 py-0.5 rounded-md border border-blue-900/30 font-semibold">Active</span>
          </div>
          <div className="mt-4">
            <h3 className="text-slate-400 text-xs uppercase font-semibold font-mono tracking-wider">Oncology Patients</h3>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">42</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>96.8% Patient retention accuracy</span>
            </p>
          </div>
        </div>
      </div>

      {/* Wellness & Fitness Real-Time Telemetry Row */}
      <h3 className="text-lg font-bold text-slate-200 mt-8 mb-4 font-sans tracking-tight">Active Patient Wellness Vitals</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate and Graph */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between h-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-slate-300 text-sm font-medium">Heart Rate</span>
            </div>
            <span className="text-red-400 text-xs font-mono lowercase">{currentWellness.heartRate} bpm</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-2xl font-extrabold text-slate-100">{currentWellness.heartRate}</p>
              <span className="text-slate-500 text-xs">Standard resting</span>
            </div>
            <div>{renderMiniChart(heartRateData, "#ef4444")}</div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between h-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300 text-sm font-medium">Blood Pressure</span>
            </div>
            <span className="text-blue-400 text-xs font-mono">systolic/diastolic</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-2xl font-extrabold text-slate-100">{currentWellness.systolicBP}/{currentWellness.diastolicBP}</p>
              <span className="text-slate-500 text-xs">mmHg normal bounds</span>
            </div>
            <div>{renderMiniChart(bpData, "#60a5fa")}</div>
          </div>
        </div>

        {/* Patient Weight */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between h-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300 text-sm font-medium">Active Weight</span>
            </div>
            <span className="text-emerald-400 text-xs font-mono">-0.4 kg change</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-2xl font-extrabold text-slate-100">{currentWellness.weight} kg</p>
              <span className="text-slate-500 text-xs">BMI Index: {currentWellness.bmi}</span>
            </div>
            <div>{renderMiniChart(weightData, "#34d399")}</div>
          </div>
        </div>

        {/* Patient Steps & Activity */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between h-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300 text-sm font-medium">Activity Trends</span>
            </div>
            <span className="text-yellow-400 text-xs font-mono">Steps/Day</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-2xl font-extrabold text-slate-100">{currentWellness.steps}</p>
              <span className="text-slate-500 text-xs">Daily active count</span>
            </div>
            <div>{renderMiniChart(stepsData, "#fbbf24")}</div>
          </div>
        </div>
      </div>

      {/* Grid: Scan Triage and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Side: Recent Active Scan Panel */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl lg:col-span-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Critical Patient Studies Queue</h3>
              <p className="text-slate-400 text-xs mt-1">Multi-modal AI predictions and risk triage profiles.</p>
            </div>
            <button 
              onClick={() => setActiveTab("History")}
              className="text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1 font-mono hover:underline"
            >
              See all scans <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300 text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-mono">
                  <th className="py-3 px-2">Patient</th>
                  <th className="py-3">Anatomy/Study</th>
                  <th className="py-3">AI Prediction</th>
                  <th className="py-3 text-center">Confidence</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-center">Triage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {scans.slice(0, 3).map((scan) => (
                  <tr 
                    key={scan.id} 
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    onClick={() => onSelectScan(scan)}
                  >
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-slate-100 group-hover:text-teal-400 transition-colors">{scan.patientName}</p>
                      <span className="text-xs text-slate-400">{scan.patientAge}y • {scan.patientSex}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs font-mono border border-slate-700/80 mr-2 text-slate-300">{scan.scanType}</span>
                      <span className="text-slate-300 font-medium text-xs">{scan.cancerType}</span>
                    </td>
                    <td className="py-3.5 max-w-[200px] truncate text-slate-300">
                      {scan.prediction}
                    </td>
                    <td className="py-3.5 text-center font-mono">
                      <span className="text-teal-400 font-semibold">{scan.confidence.toFixed(1)}%</span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-mono border ${
                        scan.riskLevel === 'High' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/25' 
                          : scan.riskLevel === 'Medium'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                      }`}>
                        {scan.riskLevel} Risk
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectScan(scan);
                        }}
                        className="font-mono text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 px-2.5 py-1 rounded-md border border-teal-500/30 transition-all"
                      >
                        Launch XAI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Quick Action and System Telemetry */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-100 font-bold mb-3">CancerVision Clinic Status</h3>
            <p className="text-slate-400 text-xs mb-4">Current clinical pipelines processing state.</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <span className="text-slate-300">ResNet34 Tumor Segmenter</span>
                  <span className="text-teal-400">98.2% Latency Secure</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: "98.2%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <span className="text-slate-300">EfficientNet Tumor Boundary Bounding</span>
                  <span className="text-teal-400">95.1% Complete</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: "95.1%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <span className="text-slate-300">Vision Transformer Ensemble</span>
                  <span className="text-blue-400">92.4% Diagnostic Yield</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: "92.4%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <h4 className="text-slate-300 text-xs uppercase font-semibold font-mono tracking-wider">Fast-Track Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setActiveTab("Image Analysis")}
                className="bg-slate-800 hover:bg-slate-700/80 text-teal-400 border border-slate-700/50 hover:border-teal-500/30 text-xs font-semibold py-2 px-3 rounded-lg transition-all"
              >
                Upload Scans
              </button>
              <button 
                onClick={() => setActiveTab("AI Assistant")}
                className="bg-slate-800 hover:bg-slate-700/80 text-teal-400 border border-slate-700/50 hover:border-teal-500/30 text-xs font-semibold py-2 px-3 rounded-lg transition-all"
              >
                Launch Chatbot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
