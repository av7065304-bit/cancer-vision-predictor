import React, { useState } from "react";
import { WellnessRecord } from "../types";
import { 
  Dumbbell, 
  PlusCircle, 
  TrendingUp, 
  Activity, 
  Heart, 
  CheckCircle,
  Calendar
} from "lucide-react";

interface WellnessProps {
  wellness: WellnessRecord[];
  onAddRecord: (record: WellnessRecord) => void;
}

export default function WellnessMonitoringView({ wellness, onAddRecord }: WellnessProps) {
  // Input fields
  const [weight, setWeight] = useState(68);
  const [heightCm, setHeightCm] = useState(170);
  const [heartRate, setHeartRate] = useState(72);
  const [systolicBP, setSystolicBP] = useState(120);
  const [diastolicBP, setDiastolicBP] = useState(80);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [steps, setSteps] = useState(9000);
  const [isSuccess, setIsSuccess] = useState(false);

  // Compute automatic BMI
  const computedBMI = Number((weight / Math.pow(heightCm / 100, 2)).toFixed(1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recordPayload: WellnessRecord = {
      id: `wel-${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString().split('T')[0],
      bmi: computedBMI,
      weight,
      heartRate,
      systolicBP,
      diastolicBP,
      sleepHours,
      steps
    };

    onAddRecord(recordPayload);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
      
      {/* Left Input Data Column */}
      <form onSubmit={handleSubmit} className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-400" />
            <h3 className="text-slate-100 font-bold text-sm tracking-tight">Log Vital Indicators</h3>
          </div>

          <div className="space-y-3 text-left">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  id="in-weight"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Height (cm)</label>
                <input
                  type="number"
                  id="in-height"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-teal-400">
                <span>Computed Body Mass Index (BMI)</span>
                <span>{computedBMI}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Normal category bounds: 18.5 – 24.9</span>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Resting Heart Rate (BPM)</label>
              <input
                type="number"
                id="in-heart-rate"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  id="in-systolic-bp"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  id="in-diastolic-bp"
                  value={diastolicBP}
                  onChange={(e) => setDiastolicBP(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Sleep (Hrs)</label>
                <input
                  type="number"
                  step="0.1"
                  id="in-sleep-hours"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Steps Count</label>
                <input
                  type="number"
                  id="in-steps"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          {isSuccess && (
            <p className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4 animate-bounce" /> Vitals submitted to Clinical Ledger.
            </p>
          )}

          <button
            type="submit"
            id="btn-submit-wellness"
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" /> Save Vital Ledger
          </button>
        </div>
      </form>

      {/* Right Visualization Trends Column */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
        
        <div>
          <div className="border-b border-slate-850 pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <h3 className="text-slate-100 font-bold text-sm tracking-tight">Active Progression Trends</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Simulated Clinical Cohort Log</span>
          </div>

          {/* Table displaying historical records */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 font-mono uppercase">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Weight (kg)</th>
                  <th className="py-2.5">Core BMI</th>
                  <th className="py-2.5">resting BPM</th>
                  <th className="py-2.5">Blood Pressure</th>
                  <th className="py-2.5">Sleep Profile</th>
                  <th className="py-2.5">Steps Loop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {wellness.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-2.5 font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" /> {rec.date}
                    </td>
                    <td className="py-2.5 font-bold">{rec.weight} kg</td>
                    <td className="py-2.5 font-mono text-teal-400 font-semibold">{rec.bmi}</td>
                    <td className="py-2.5 text-red-400 font-mono">{rec.heartRate} bpm</td>
                    <td className="py-2.5 text-blue-400 font-mono font-medium">{rec.systolicBP}/{rec.diastolicBP}</td>
                    <td className="py-2.5 font-mono">{rec.sleepHours} hrs</td>
                    <td className="py-2.5 text-yellow-400 font-mono font-bold">{rec.steps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informative advice based on patient compliance */}
        <div className="mt-8 bg-slate-950 p-4 border border-slate-850/80 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400">
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Clinical Pulmonology & Dermal Care Advice</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed leading-normal">
            Your metrics represent strong active cardiorespiratory output with an average daily walk loop of <strong>{(wellness.reduce((acc, c) => acc + c.steps, 0) / wellness.length).toFixed(0)} steps</strong>. Retaining adequate BMI balance reduces cellular micro-inflammation indices, significantly reducing secondary oncological development probabilities. Keep records updated.
          </p>
        </div>

      </div>

    </div>
  );
}
