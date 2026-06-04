import React, { useState } from "react";
import { 
  User, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  ToggleLeft, 
  Clipboard, 
  Lock 
} from "lucide-react";

interface ProfileProps {
  userEmail: string;
}

export default function ProfileView({ userEmail }: ProfileProps) {
  const [clinicianName, setClinicianName] = useState("Dr. Al-Sabah Vance, MD");
  const [licenseNumber, setLicenseNumber] = useState("MD-O-902-892");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("Metro Oncology Labs (HOS-89)");
  const [clinicRole, setClinicRole] = useState("Consultant Pathologist Specialist");

  // Local settings switches
  const [hfaConsent, setHfaConsent] = useState(true);
  const [multiModelCascade, setMultiModelCascade] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      
      {/* Left Settings Profile Card */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-left">
        <div className="border-b border-slate-850 pb-3">
          <h3 className="text-slate-100 font-bold text-base tracking-tight">Oncology Clinician Account</h3>
          <p className="text-slate-400 text-xs mt-0.5">Control your profile identity credentials and role assignments.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Clinician Name</label>
              <input
                type="text"
                id="profile-clinician-name"
                value={clinicianName}
                onChange={(e) => setClinicianName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-teal-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Oncology License Number</label>
              <input
                type="text"
                id="profile-license-number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-teal-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Hospital Affiliation</label>
              <input
                type="text"
                id="profile-hospital"
                value={hospitalAffiliation}
                onChange={(e) => setHospitalAffiliation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-teal-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Pathologist Clinic Role</label>
              <input
                type="text"
                id="profile-role"
                value={clinicRole}
                onChange={(e) => setClinicRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-teal-500/50"
              />
            </div>
          </div>

          {/* Email proxy from workspace variables */}
          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Verified clinician Email</label>
            <div className="w-full bg-slate-950 border border-slate-850 text-slate-400 text-xs px-3 py-2.5 rounded-lg select-none font-mono flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" /> {userEmail || "av7065304@gmail.com"}
            </div>
          </div>

          {/* Settings checkboxes */}
          <div className="border-t border-slate-850 pt-5 space-y-3">
            <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider font-mono">System Preferences</h4>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-200 text-xs font-bold block">Patient HIPAA Consent lock</span>
                <span className="text-[11px] text-slate-500 block">Requires manual patient consent before cloud scan uploads.</span>
              </div>
              <input 
                type="checkbox" 
                checked={hfaConsent}
                onChange={(e) => setHfaConsent(e.target.checked)}
                className="w-4 h-4 accent-teal-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-200 text-xs font-bold block">Multi-model Cascade Ensembling</span>
                <span className="text-[11px] text-slate-500 block">Enforces simultaneous ResNet + EfficientNet prediction pipelines.</span>
              </div>
              <input 
                type="checkbox" 
                checked={multiModelCascade}
                onChange={(e) => setMultiModelCascade(e.target.checked)}
                className="w-4 h-4 accent-teal-400"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-850 flex items-center gap-4">
          <button
            type="submit"
            id="btn-update-profile"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
          >
            Update Profile Credentials
          </button>
          {isSaved && (
            <p className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
              ✓ Credentials secured. Diagnostic stamps updated.
            </p>
          )}
        </div>
      </form>

      {/* Right Identity Verification details */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between text-left">
        <div className="space-y-4">
          <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            <h3 className="text-slate-100 font-bold text-sm tracking-tight font-sans">Active Certifications</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
              <span className="text-teal-450 font-mono text-[9px] uppercase font-bold tracking-widest block">American Board of Oncology</span>
              <p className="text-slate-200 text-xs font-bold">Diplomate Certification</p>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Verified: Yes</span>
                <span>Expiry: 2030</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
              <span className="text-teal-450 font-mono text-[9px] uppercase font-bold tracking-widest block">European Radiology Guild</span>
              <p className="text-slate-200 text-xs font-bold">Interactive Mammography Cert</p>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Verified: Yes</span>
                <span>Expiry: 2028</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl mt-6 space-y-1.5">
          <span className="text-teal-400 font-mono text-[9px] uppercase font-bold tracking-widest block">Biopsy Access Security</span>
          <p className="text-[11px] text-slate-400 leading-normal">
            Your login identity belongs to a registered pathologist group. Audited action stamps apply for all processed MRI/CT tumors. Ensure credentials safety.
          </p>
        </div>
      </div>

    </div>
  );
}
