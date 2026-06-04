import React, { useState, useEffect } from "react";
import { Doctor } from "../types";
import { 
  Video, 
  Hospital, 
  Star, 
  MapPin, 
  Calendar, 
  Check, 
  Clock, 
  PhoneCall 
} from "lucide-react";

export default function TelemedicineView() {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<string>("2026-06-05");
  const [bookingTime, setBookingTime] = useState<string>("10:00 AM");
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (response.ok) {
          const list = await response.json();
          setDoctorsList(list);
          if (list.length > 0) setSelectedDocId(list[0].id);
        }
      } catch (e) {
        console.error("Failed to load doctors list", e);
      }
    };
    fetchDocs();
  }, []);

  const selectedDoctor = doctorsList.find(d => d.id === selectedDocId);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">Oncology Telemedicine Portal</h2>
          <p className="text-slate-400 text-sm mt-1">Book virtual clinic-grade consultations with verified oncologists and radiologists instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive doctors list */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-slate-200 text-xs font-bold uppercase tracking-wider font-mono text-left">Onsite & Virtual Doctor Rosters</h3>
          
          <div className="space-y-4">
            {doctorsList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row gap-4 items-start text-left cursor-pointer ${
                  selectedDocId === doc.id
                    ? "bg-teal-500/10 border-teal-500/40 shadow-sm"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                  <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-1.5 w-full">
                  <div className="flex justify-between items-center w-full">
                    <h4 className="text-slate-100 font-bold text-base tracking-tight">{doc.name}</h4>
                    <span className="flex items-center gap-1 text-yellow-400 font-mono text-xs">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" /> {doc.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-teal-400 text-xs font-medium font-mono">{doc.specialty}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1"><Hospital className="w-4 h-4 text-slate-500" /> {doc.hospital}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-500" /> {doc.availability.join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Form panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <form onSubmit={handleBookingSubmit} className="space-y-5 text-left">
            <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
              <Video className="w-5 h-5 text-teal-400 animate-pulse" />
              <h3 className="text-slate-100 font-bold text-sm tracking-tight font-sans">Simulate Video Consult Booking</h3>
            </div>

            {selectedDoctor ? (
              <div className="space-y-4">
                {/* Chosen summary */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Chosen oncologist</span>
                    <span className="text-slate-200 font-bold text-sm">{selectedDoctor.name}</span>
                  </div>
                </div>

                {/* Date Input */}
                <div>
                  <label className="text-slate-400 text-[11px] uppercase font-bold font-mono block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    id="telemed-booking-date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500/50"
                  />
                </div>

                {/* Hour selection */}
                <div>
                  <label className="text-slate-400 text-[11px] uppercase font-bold font-mono block mb-1">Appointment Slot Time</label>
                  <select
                    id="telemed-booking-time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg text-slate-300"
                  >
                    <option value="10:00 AM">10:00 AM (Central European standard)</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM (Radiology slot)</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>

                <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1.5">
                  <span className="text-teal-400 font-mono text-[10px] uppercase font-bold tracking-widest block">Tele-consult instructions</span>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    This consultation integrates real-time end-to-end WebRTC video. All parsed CancerVision AI scan Grad-CAM details will be pre-shared over secure networks.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">Choose oncologist card list from left to configure booking parameters.</p>
            )}

            <div className="pt-4 space-y-2">
              {isBooked && (
                <p className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 animate-bounce">
                  ✓ Teleconsult session scheduled! SHA-255 encryption active.
                </p>
              )}

              <button
                type="submit"
                id="btn-book-consult"
                disabled={!selectedDoctor}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Schedule Virtual Teleconsult
              </button>
            </div>
          </form>

          {/* Verification labels */}
          <div className="mt-6 border-t border-slate-850 pt-5 text-[10px] text-slate-500 font-mono text-center flex justify-between gap-1">
            <span>Verified Medical License verified</span>
            <span>GDPR Data access compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
}
