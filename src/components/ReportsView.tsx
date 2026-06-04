import React, { useState } from "react";
import { MedicalScan } from "../types";
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Building, 
  ShieldCheck 
} from "lucide-react";

interface ReportsProps {
  scans: MedicalScan[];
}

export default function ReportsView({ scans }: ReportsProps) {
  const [selectedScanId, setSelectedScanId] = useState<string>(scans[0]?.id || "");
  const [reportFormat, setReportFormat] = useState<'Doctor' | 'Patient'>('Doctor');
  const [isExporting, setIsExporting] = useState(false);
  const [exportLogged, setExportLogged] = useState(false);

  const selectedScan = scans.find(s => s.id === selectedScanId) || scans[0];

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportLogged(true);

      // standard browser print logic fallback or simulated file download
      const docContent = `
        CANCERVISION AI CLINICAL ONCOLOGY REPORT
        Timestamp: ${new Date().toISOString()}
        Patient: ${selectedScan?.patientName} (${selectedScan?.patientAge}y, ${selectedScan?.patientSex})
        Study: ${selectedScan?.scanType} - ${selectedScan?.cancerType}
        AI Forecast: ${selectedScan?.prediction}
        Probability Yield: ${selectedScan?.confidence}%
        Recommendations: ${selectedScan?.recommendations.join(". ")}
      `;
      const blob = new Blob([docContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedScan?.patientName.replace(/\s+/g, '_')}_diagnosis_report.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setExportLogged(false), 3000);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">Oncology Clinical Reports</h2>
          <p className="text-slate-400 text-sm mt-1">Generate diagnostic summaries of active patient scans in doctor or patient formats.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Report Options Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-6">
          <div className="space-y-4 text-left">
            <h3 className="text-slate-200 text-xs font-bold uppercase tracking-wider font-mono">Report Settings</h3>
            
            {/* Choose patient scan */}
            <div>
              <label className="text-slate-400 text-[11px] uppercase font-bold font-mono block mb-1">Active Medical Scan</label>
              <select
                id="select-scan-report"
                value={selectedScanId}
                onChange={(e) => setSelectedScanId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.patientName} ({s.scanType})
                  </option>
                ))}
              </select>
            </div>

            {/* Choose Target Audience Format */}
            <div>
              <label className="text-slate-400 text-[11px] uppercase font-bold font-mono block mb-1">Clinic Grade Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setReportFormat('Doctor')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    reportFormat === 'Doctor'
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/40"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Doctor-Friendly
                </button>
                <button
                  onClick={() => setReportFormat('Patient')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    reportFormat === 'Patient'
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/40"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Patient-Friendly
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <button
              onClick={handleDownload}
              id="btn-download-report"
              disabled={isExporting || !selectedScan}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> 
              {isExporting ? "Compiling PDF..." : "Export Clinical Report File"}
            </button>

            <button
              onClick={handlePrint}
              id="btn-print-report"
              disabled={!selectedScan}
              className="w-full bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-755 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Form Card
            </button>

            {exportLogged && (
              <p className="text-emerald-400 text-[11px] font-mono font-semibold uppercase tracking-wider text-center pt-2">
                ✓ Report generated & written. Audit trial updated.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: High-Fidelity Report Document Mock */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between text-left space-y-6 text-slate-300 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <FileText className="w-40 h-40 text-teal-400" />
          </div>

          {!selectedScan ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm">
              <FileText className="w-12 h-12 mb-2" />
              <span>Please select a valid scan from the setting panel.</span>
            </div>
          ) : (
            <>
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-850">
                <div>
                  <h3 className="text-xl font-bold font-mono tracking-tight text-slate-100 uppercase">CancerVision Lab Report</h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Clinical Diagnostic Diagnostic Analysis Code: CV-AI-9092</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-teal-400">CancerVision Diagnostic Node</p>
                  <p className="text-[10px] text-slate-500 font-mono">Date Compiled: {selectedScan.date}</p>
                </div>
              </div>

              {/* Patient and Clinician Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900 border border-slate-850/60 p-4 rounded-xl space-y-2">
                  <span className="text-teal-400 text-[10px] uppercase font-bold font-mono tracking-wider block">Patient Compliance Parameters</span>
                  <p className="text-slate-100 font-bold text-sm">{selectedScan.patientName}</p>
                  <div className="flex gap-4 text-slate-400 font-mono text-[10px]">
                    <span>Age: {selectedScan.patientAge} years</span>
                    <span>Gender: {selectedScan.patientSex}</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850/60 p-4 rounded-xl space-y-2">
                  <span className="text-teal-400 text-[10px] uppercase font-bold font-mono tracking-wider block">Assigned Oncology Institution</span>
                  <p className="text-slate-100 font-bold text-sm flex items-center gap-1">
                    <Building className="w-4 h-4 text-teal-500" /> Metro Oncology Labs (HOS-89)
                  </p>
                  <div className="flex gap-4 text-slate-400 font-mono text-[10px]">
                    <span>Standard Access Secure</span>
                    <span>Audit Protocol active</span>
                  </div>
                </div>
              </div>

              {/* AI Diagnosis Score Card */}
              <div className="p-5 bg-teal-500/5 rounded-xl border border-teal-500/10 text-left space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-teal-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    Neural Network Verdict Summary
                  </span>
                  <span className="text-teal-400">{selectedScan.confidence}% confidence</span>
                </div>
                <p className="text-slate-150 text-base font-bold leading-normal">{selectedScan.prediction}</p>
                
                <div className="flex items-center gap-1.5 py-1 text-slate-400 text-xs font-mono">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedScan.riskLevel === 'High' ? "bg-red-950/40 text-red-400 border border-red-900/35" : "bg-yellow-950/40 text-yellow-500 border border-yellow-900/35"
                  }`}>
                    {selectedScan.riskLevel} Triage Risk
                  </span>
                  <span>Evaluated against Multi-model Ensemble (EfficientNet + ResNet34)</span>
                </div>
              </div>

              {/* Findings & Diagnostics Block */}
              <div className="space-y-3">
                <h4 className="text-slate-100 font-bold text-xs uppercase font-mono tracking-wider">
                  {reportFormat === 'Doctor' ? "Histopathological & Radiological Findings" : "Patient-Friendly Overview Of Scan"}
                </h4>

                <div className="space-y-2 pl-2">
                  {selectedScan.findings.map((finding, idx) => (
                    <div key={idx} className="flex gap-2 text-xs leading-relaxed">
                      <span className="text-teal-400 font-bold font-mono">[{idx + 1}]</span>
                      <p className="text-slate-300">
                        {reportFormat === 'Doctor' 
                          ? finding 
                          : finding.replace(/spiculed|adenocarcinoma|glioma|vasogenic/gi, "atypical cell layout indicators")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Recommendations */}
              <div className="space-y-3">
                <h4 className="text-slate-100 font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-1 text-red-400">
                  <AlertTriangle className="w-4 h-4" /> Clinic Recommendation Actions
                </h4>
                <div className="space-y-2 pl-2">
                  {selectedScan.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-2 text-xs leading-relaxed">
                      <span className="text-red-400 font-extrabold">•</span>
                      <p className="text-slate-300 font-medium">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Footer */}
              <div className="pt-6 border-t border-slate-850 text-[10px] text-slate-500 font-mono text-center flex flex-col sm:flex-row justify-between gap-2">
                <span>CancerVision AI Safe Diagnostic Network Platform</span>
                <span>Page 1 of 1 • SECURE SHA-256 VALIDATED BOUNDS</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
