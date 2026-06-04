import React from "react";
import { 
  Shield, 
  Cpu, 
  Activity, 
  Brain, 
  Award, 
  UserCheck, 
  Lock, 
  FileText, 
  Radio 
} from "lucide-react";

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
}

export default function HomeView({ setActiveTab }: HomeViewProps) {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-black border border-slate-800 p-8 md:p-12 text-left">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Clinic-Grade Multi-Model AI Diagnostics
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight font-sans leading-tight">
            CancerVision <span className="text-teal-400">AI</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
            A secure clinical-grade web platform utilizing multi-model ensemble intelligence (EfficientNet, ResNet, & ViT) for automated detection, high-fidelity boundary segmentation, and medical chatbot consulting.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              id="btn-get-started"
              onClick={() => setActiveTab("Image Analysis")}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Analyze Medical Scan
            </button>
            <button 
              id="btn-launch-chat"
              onClick={() => setActiveTab("AI Assistant")}
              className="bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-700/80 hover:border-teal-500/30 font-bold px-6 py-3 rounded-xl transition-all duration-300"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Capabilities Multi-column Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-200 tracking-tight font-sans">AI Diagnostic Capabilities</h2>
        <p className="text-slate-400 text-sm max-w-xl">
          Highly specialized convolutional neural networks trained to detect anomalies across multiple oncological domains.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-teal-500/20 transition-all duration-300">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-slate-200 font-bold mt-4 text-base">Neurology (Brain)</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Detection of Ring-Enhancing masses, Gliomas, and Astrocytomas securely using structural MRI sequences.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-teal-500/20 transition-all duration-300">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-slate-200 font-bold mt-4 text-base">Pulmonology (Lung)</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Identifies peripheral spiculed nodules, regional calcification, and signs of NSCLC/Adenocarcinoma in CT scans.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-teal-500/20 transition-all duration-300">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-slate-200 font-bold mt-4 text-base">Dermatology (Skin)</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Visual evaluation of ABCDE criteria for Melanoma, basal cell carcinoma, and atypical melanocytic lesions.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-teal-500/20 transition-all duration-300">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-slate-200 font-bold mt-4 text-base">Gynecology & Breast</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Mammography structural breast tissue density and cervical smear classification arrays.
            </p>
          </div>
        </div>
      </div>

      {/* Trust, Security, Credentials & Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-sm">Role-Based Access & Audit Logging</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Secure clinician authentications, tamper-proof audit trails, and strict patient consent logs are stored securely.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-sm">Clinical Synergy Ensemble</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Fused prediction models provide confidence scores alongside Grad-CAM activation maps to assist oncology clinics.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-sm">Patient-Centric Reports</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Instantly generate doctor-friendly and patient-friendly multi-page reports complete with risk recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/20 border border-slate-800/60 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-teal-400 text-xs font-mono font-bold uppercase tracking-widest block mb-1">Clinical Disclaimer</span>
          <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
            CancerVision AI is a medical validation and simulation utility built to assist radiologists. It is not a medical device. All clinical interpretations should be authenticated by a qualified pathologist.
          </p>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-500 text-xs font-mono font-medium">HIPAA Simulated Compliance</span>
          <span className="text-slate-500 text-xs font-mono font-medium">ISO 27001 Secure</span>
        </div>
      </div>
    </div>
  );
}
