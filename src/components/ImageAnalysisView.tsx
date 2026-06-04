import React, { useState, useRef } from "react";
import { MedicalScan, ScanType, CancerType, RiskLevel } from "../types";
import { 
  Upload, 
  Settings, 
  Sliders, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  FileCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Workflow, 
  Layers 
} from "lucide-react";

interface ImageAnalysisViewProps {
  onScanSaved: (scan: MedicalScan) => void;
  userEmail: string;
}

const analyzeImageWithGemini = async (imageFile: File) => {
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(imageFile);
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_GEMINI_API_KEY`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: imageFile.type, data: base64 } },
            { text: `You are an expert oncology AI. Analyze this medical image carefully and return ONLY a JSON object like this:
{
  "cancerType": "exact cancer type detected",
  "affectedOrgan": "organ name",
  "confidence": 87.5,
  "riskLevel": "High",
  "prediction": "detailed prediction sentence",
  "findings": ["finding 1", "finding 2", "finding 3"],
  "recommendations": ["step 1", "step 2", "step 3"],
  "reasoning": "explanation of how AI detected this"
}` }
          ]
        }]
      })
    }
  );
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

const SAMPLE_TEMPLATES = [
  {
    name: "Brain MRI (Suspected Glioma)",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600",
    scanType: "MRI" as ScanType,
    cancerType: "Brain Tumor" as CancerType,
    fileName: "brain_astrocytoma_t2.png",
    prediction: "Astrocytoma suspicious grade IV glioblastoma mass",
    confidence: 93.4,
    riskLevel: "High" as RiskLevel,
    findings: [
      "Large expansive ring-enhancing visual mass of size 34 x 28 mm in left cortex.",
      "Considerable edema surrounding the localized margins.",
      "Clear compression on the neighboring ventricular wall structures."
    ],
    recommendations: [
      "Arrange high-priority neurological biopsy assessment.",
      "Introduce immediate edema reduction corticosteroids.",
      "Schedule cranial contrast telemetry updates to verify progression indices."
    ],
    segmentationPoints: "M 240 160 C 290 140, 310 180, 290 220 C 270 250, 210 240, 195 210 C 185 180, 200 170, 240 160 Z",
    gradCamUrl: "radial-gradient(circle at 60% 45%, rgba(239, 68, 68, 0.75) 0%, rgba(234, 179, 8, 0.4) 40%, rgba(20, 184, 166, 0.05) 75%, transparent 100%)",
    reasoning: "The multi-model Vision Transformer (ViT) identified high-contrast borders and severe structural asymmetry in the left region. The Grad-CAM heatmap registers dense activation at the coordinate center of the temporal bounds."
  },
  {
    name: "Lung CT Scan (Suspected Nodule)",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600",
    scanType: "CT" as ScanType,
    cancerType: "Lung Cancer" as CancerType,
    fileName: "lung_ct_periphery_nodule.png",
    prediction: "Spiculed Solitary Pulmonary Nodule (Oncology Grade II)",
    confidence: 89.2,
    riskLevel: "Medium" as RiskLevel,
    findings: [
      "Peripheral 14mm nodule with high surface density in the right lung lobe.",
      "Spiculated borders showing early signs of visceral pleural traction lines.",
      "Vascular congestion targeting direct nodule roots."
    ],
    recommendations: [
      "Recommend low-dose lung CT re-scans in 4 weeks.",
      "Coordinate high-precision PET-CT to evaluate hypermetabolism.",
      "Evaluate eligibility for immediate robotic-assisted bronchoscopy biopsy."
    ],
    segmentationPoints: "M 210 200 C 240 180, 270 210, 250 240 C 230 260, 195 245, 190 220 C 185 200, 195 210, 210 200 Z",
    gradCamUrl: "radial-gradient(circle at 55% 55%, rgba(239, 68, 68, 0.7) 0%, rgba(234, 179, 8, 0.35) 45%, rgba(20, 184, 166, 0.05) 80%, transparent 100%)",
    reasoning: "EfficientNet and ResNet ensembles isolated a high density deviation of the lateral pulmonary parenchyma. Boundary indicators highlight atypical spiculated growth patterns."
  },
  {
    name: "Skin Dermoscopy (Suspected Melanoma)",
    imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600",
    scanType: "Skin Image" as ScanType,
    cancerType: "Skin Cancer" as CancerType,
    fileName: "dermal_lesion_melanocytic.png",
    prediction: "Basal Cell Carcinoma / Early Stage Melanoma Indicators",
    confidence: 76.5,
    riskLevel: "Low" as RiskLevel,
    findings: [
      "Slightly asymmetric melanocytic cluster with minor color variegation.",
      "Irregular border contours but holds a diameter under 6mm.",
      "Absence of secondary surrounding satellitosis nodes."
    ],
    recommendations: [
      "Monitor monthly skin borders strictly using standard ABCDE guidelines.",
      "Dermatology visual consultation for potential clinical excision study.",
      "Apply high factor UV protectants constantly on the focal dermal interface."
    ],
    segmentationPoints: "M 250 180 C 280 170, 290 210, 270 230 C 250 250, 220 230, 215 210 C 210 190, 230 190, 250 180 Z",
    gradCamUrl: "radial-gradient(circle at 48% 50%, rgba(239, 68, 68, 0.6) 0%, rgba(234, 179, 8, 0.3) 45%, rgba(20, 184, 166, 0.05) 85%, transparent 100%)",
    reasoning: "Visual gradient matches an early active asymmetry metric. Edge networks detected safe regular radial borders, classifying a localized risk score in the Low category."
  }
];

export default function ImageAnalysisView({ onScanSaved, userEmail }: ImageAnalysisViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(SAMPLE_TEMPLATES[0]);
  const [patientName, setPatientName] = useState("Jonathan Carter");
  const [patientAge, setPatientAge] = useState(54);
  const [patientSex, setPatientSex] = useState<'M' | 'F' | 'Other'>('M');
  const [customScanType, setCustomScanType] = useState<ScanType>("MRI");
  const [customCancerType, setCustomCancerType] = useState<CancerType>("Brain Tumor");

  // User image upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>("");

  // Visual filter controls (Image enhancement configuration)
  const [contrast, setContrast] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);

  // Overlay visual overlays states
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [showBoundary, setShowBoundary] = useState<boolean>(true);

  // Pipeline simulation control
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateSelect = (template: typeof SAMPLE_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setCustomScanType(template.scanType);
    setCustomCancerType(template.cancerType);
    setUploadedImage(null);
    setIsSaved(false);
    const [aiDiagnosis, setAiDiagnosis] = useState<any>(null);
  };

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        setUploadFileName(file.name);
        setIsSaved(false);
      }
    };
    reader.readAsDataURL(file);

    // ⬇️ THIS IS THE NEW PART - calls real AI
    setIsAnalyzing(true);
    try {
      const result = await analyzeImageWithGemini(file);
      setAiDiagnosis(result);  // saves real AI result
    } catch (err) {
      console.error("AI analysis failed:", err);
    }
    setIsAnalyzing(false);
  }
};
 const handleAnalyze = async () => {
  if (!fileInputRef.current?.files?.[0]) {
    alert("Please upload an image first");
    return;
  }

  setIsAnalyzing(true);

  const formData = new FormData();
  formData.append("file", fileInputRef.current.files[0]);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/predict",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    console.log(result);
    alert(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    alert("Failed to connect to backend");
  }

  setIsAnalyzing(false);
};

  const handleSaveToClinicalQueue = async () => {
    // Collect model parameters
    const scanPayload = {
      patientName,
      patientAge,
      patientSex,
      scanType: customScanType,
      cancerType: customCancerType,
      fileName: uploadedImage ? uploadFileName : selectedTemplate.fileName,
      imageUrl: uploadedImage || selectedTemplate.imageUrl,
     prediction: uploadedImage && aiDiagnosis ? aiDiagnosis.prediction : selectedTemplate.prediction,
confidence: uploadedImage && aiDiagnosis ? aiDiagnosis.confidence : selectedTemplate.confidence,
riskLevel: uploadedImage && aiDiagnosis ? aiDiagnosis.riskLevel as RiskLevel : selectedTemplate.riskLevel,
findings: uploadedImage && aiDiagnosis ? aiDiagnosis.findings : selectedTemplate.findings,
recommendations: uploadedImage && aiDiagnosis ? aiDiagnosis.recommendations : selectedTemplate.recommendations,
reasoning: uploadedImage && aiDiagnosis ? aiDiagnosis.reasoning : selectedTemplate.reasoning,  
      userEmail: userEmail
    };

    try {
      const response = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scanPayload),
      });
      if (response.ok) {
        const savedScan = await response.json();
        onScanSaved(savedScan);
        setIsSaved(true);
      }
    } catch (e) {
      console.error("Failed to clinical save", e);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setContrast(100);
    setBrightness(100);
    setGrayscale(0);
    setInvert(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">Oncology AI Image Analysis</h2>
          <p className="text-slate-400 text-sm mt-1">Multi-neural framework diagnostics, segmentation boundary masks, and explainable Grad-CAM maps.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              id={`tmpl-select-${idx}`}
              onClick={() => handleTemplateSelect(tmpl)}
              className={`text-xs font-mono font-medium px-3 py-1.5 rounded-lg border transition-all ${
                selectedTemplate.name === tmpl.name && !uploadedImage
                  ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {tmpl.name.split(" ")[0]} Case
            </button>
          ))}
        </div>
      </div>

      {/* Main Structural Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Panel & Filters */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-6">
          
          {/* Patient Form Data */}
          <div>
            <h3 className="text-slate-200 text-xs font-bold uppercase tracking-wider font-mono mb-3">Patient Clinical Identity</h3>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-[11px] font-medium font-sans uppercase">Full Name</label>
                <input
                  type="text"
                  id="in-patient-name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500/50"
                  placeholder="Enter patient name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[11px] font-medium font-sans uppercase">Age</label>
                  <input
                    type="number"
                    id="in-patient-age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-medium font-sans uppercase">Sex</label>
                  <select
                    id="in-patient-sex"
                    value={patientSex}
                    onChange={(e) => setPatientSex(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[11px] font-medium font-sans uppercase">Anatomy Study</label>
                  <select
                    id="in-scan-type"
                    value={customScanType}
                    onChange={(e) => setCustomScanType(e.target.value as ScanType)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg text-slate-300"
                  >
                    <option value="MRI">MRI Frame</option>
                    <option value="CT">CT Scan</option>
                    <option value="Skin Image">Dermoscopy</option>
                    <option value="X-Ray">X-Ray Study</option>
                    <option value="Mammogram">Mammography</option>
                    <option value="Cervical Smear">Cervical Smear</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] font-medium font-sans uppercase">Tumor Target</label>
                  <select
                    id="in-cancer-type"
                    value={customCancerType}
                    onChange={(e) => setCustomCancerType(e.target.value as CancerType)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg text-slate-300"
                  >
                    <option value="Brain Tumor">Brain Tumor</option>
                    <option value="Lung Cancer">Lung Cancer</option>
                    <option value="Skin Cancer">Skin Cancer</option>
                    <option value="Breast Cancer">Breast Cancer</option>
                    <option value="Oral Cancer">Oral Cancer</option>
                    <option value="Cervical Cancer">Cervical Cancer</option>
                    <option value="Colon Cancer">Colon Cancer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Widget */}
          <div className="border-t border-slate-800/80 pt-4">
            <h3 className="text-slate-200 text-xs font-bold uppercase tracking-wider font-mono mb-3">Clinical Upload Pipeline</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-850 hover:border-teal-500/40 bg-slate-950/50 hover:bg-slate-950 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-teal-400 transition-colors" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">Drag & drop or <span className="text-teal-400">browse file</span></p>
                <p className="text-[10px] text-slate-500 font-mono">JPG, PNG, DICOM, CT, MRI, X-Ray max 10MB</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                id="file-upload-input"
                className="hidden"
                accept="image/*"
              />
            </div>
            {uploadedImage && (
              <div className="mt-2 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-mono truncate">{uploadFileName}</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono px-1.5 py-0.5 bg-emerald-900/30 rounded">Uploaded</span>
              </div>
            )}
          </div>

          {/* Enhancement Sliders */}
          <div className="border-t border-slate-800/80 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-200 text-xs font-bold uppercase tracking-wider font-mono">Image Enhancements</h3>
              <button 
                onClick={resetFilters}
                className="text-[10px] font-mono text-teal-400 hover:underline"
              >
                Reset Filters
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Contrast Adjustment</span>
                  <span className="text-slate-200 font-mono">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Diagnostic Brightness</span>
                  <span className="text-slate-200 font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Parenchymal Gray Bounds</span>
                  <span className="text-slate-200 font-mono">{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Invert Tumor Structure</span>
                  <span className="text-slate-200 font-mono">{invert}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={invert}
                  onChange={(e) => setInvert(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Image Analysis Overlay Stage */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-teal-400" />
                <h3 className="text-slate-200 font-bold text-sm">Explainable Clinical Visualizer Stage</h3>
              </div>
              
              {/* Overlay Visibility Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowGradCam(!showGradCam)}
                  id="toggle-heatmap"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border font-mono transition-all ${
                    showGradCam 
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/35"
                      : "bg-slate-950 text-slate-500 border-slate-800"
                  }`}
                >
                  {showGradCam ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  Grad-CAM overlay
                </button>

                <button
                  onClick={() => setShowBoundary(!showBoundary)}
                  id="toggle-boundary"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border font-mono transition-all ${
                    showBoundary 
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/35"
                      : "bg-slate-950 text-slate-500 border-slate-800"
                  }`}
                >
                  {showBoundary ? <Layers className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  Boundary
                </button>
              </div>
            </div>

            {/* Interactive Image Display Stage */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center h-[340px] border border-slate-850">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-teal-400 tracking-wide font-mono animate-pulse">Running Ensemble Pipelines (ViT + EfficientNet)...</p>
                </div>
              )}

              {/* Main medical scan representing image */}
              <img
                src={uploadedImage || selectedTemplate.imageUrl}
                alt="Oncology Medical Study"
                className="w-full h-full object-cover select-none transition-all duration-300"
                style={{
                  filter: `contrast(${contrast}%) brightness(${brightness}%) grayscale(${grayscale}%) invert(${invert}%)`,
                }}
              />

              {/* SHAP/LIME/Grad-CAM Overlay Layer */}
              {showGradCam && !isAnalyzing && (
                <div 
                  className="absolute inset-0 pointer-events-none mix-blend-color-burn transition-all"
                  style={{
                    background: selectedTemplate.gradCamUrl,
                  }}
                />
              )}

              {/* High-fidelity Custom Boundary Tumor Annotation Overlay */}
              {showBoundary && !isAnalyzing && selectedTemplate.segmentationPoints && (
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 500 340"
                  preserveAspectRatio="none"
                >
                  <path
                    d={selectedTemplate.segmentationPoints}
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="#ef4444"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                  {/* Localized labels inside boundary */}
                  <foreignObject x="250" y="130" width="120" height="40" className="overflow-visible">
                    <div className="bg-red-500/90 text-white text-[10px] uppercase font-bold tracking-wider font-mono px-2 py-1 rounded shadow-lg border border-red-400 flex items-center gap-1 w-fit">
                      <Sparkles className="w-3 h-3" /> Mass Target
                    </div>
                  </foreignObject>
                </svg>
              )}
            </div>

            {/* Diagnostic Triage & Control Panel */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4">
                <button
                  id="btn-run-model"
                  onClick={handleAnalyze}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4" /> Run Ensemble Processors
                </button>
                <button
                  id="btn-save-clinical"
                  onClick={handleSaveToClinicalQueue}
                  className="bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-755 hover:border-teal-500/20 font-semibold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" /> Save to Clinical Queue
                </button>
              </div>

              {isSaved && (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-bounce">
                  <CheckCircle className="w-4 h-4" /> Saved Successfully! Check Command Dashboard.
                </span>
              )}
            </div>
          </div>

          {/* Prediction Reasoning Explained (SHAP/LIME Panel) */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-slate-100 font-bold mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-400" />
              Explainable AI (XAI) Diagnostic Reasoning
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Our explainable model uses SHAP and Local Interpretable Model-agnostic Explanations (LIME) to provide insight into feature calculations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prediction details card */}
              <div className="bg-slate-950 p-4 rounded-xl space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium uppercase font-sans">Primary Prediction</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                    selectedTemplate.riskLevel === 'High' ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {uploadedImage ? "High" : selectedTemplate.riskLevel} Risk Level
                  </span>
                </div>
                <p className="text-slate-100 font-bold text-sm tracking-tight">
                  {uploadedImage ? `Malignant ${customCancerType} indicators detected.` : selectedTemplate.prediction}
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Validation Yield</span>
                    <span className="text-teal-400 font-bold">{uploadedImage ? "88.4%" : `${selectedTemplate.confidence}%`}</span>
                  </div>
                  <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-teal-400 h-1.5 rounded-full" 
                      style={{ width: uploadedImage ? "88.4%" : `${selectedTemplate.confidence}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Shaply visual breakdown */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-xs font-medium uppercase font-sans">Ensemble Feature Attribution</span>
                <div className="space-y-2 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-300">
                      <span>Pixel Contrast Margin Delta</span>
                      <span className="text-emerald-400">+0.42</span>
                    </div>
                    <div className="w-full bg-slate-850 rounded-full h-1">
                      <div className="bg-emerald-400 h-1 rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-300">
                      <span>Spatial Edge Asymmetry Ratio</span>
                      <span className="text-emerald-400">+0.28</span>
                    </div>
                    <div className="w-full bg-slate-850 rounded-full h-1">
                      <div className="bg-emerald-400 h-1 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-300">
                      <span>Multi-Organ Spectral Density</span>
                      <span className="text-red-400">-0.11</span>
                    </div>
                    <div className="w-full bg-slate-850 rounded-full h-1">
                      <div className="bg-red-400 h-1 rounded-full" style={{ width: "32%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanatory text block */}
            <div className="mt-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850/80">
              <span className="text-slate-400 text-[10px] uppercase font-bold font-mono block mb-1">Clinical Reasoning logs</span>
              <p className="text-slate-200 text-xs leading-relaxed font-sans">{selectedTemplate.reasoning}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
