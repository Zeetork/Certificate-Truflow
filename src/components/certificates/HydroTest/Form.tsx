"use client";

import React, { useState, useEffect } from "react";
import {
  HydroTestCertificateData,
  MaterialHydroPressureTestItem,
} from "@/types/certificate";
import {
  FileText,
  CheckCircle2,
  Activity,
  UserCheck,
  ShieldCheck,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

interface SignatoryUser {
  _id: string;
  name: string;
  email: string;
  signature?: string;
  roleName?: string;
}

const DEFAULT_SIGNATORIES: SignatoryUser[] = [
  {
    _id: "sig-sivaganeshan",
    name: "SIVAGANESHAN.V.A",
    email: "sivaganeshan@truflow.com",
    signature: "/signature/signature-sivaganeshan.png",
    roleName: "Quality Engineer",
  },
  {
    _id: "sig-karthikeyan",
    name: "KARTHIKEYAN.A",
    email: "karthikeyan@truflow.com",
    signature: "/signature/signature-karthikeyan.jpeg",
    roleName: "Technical Reviewer",
  },
  {
    _id: "sig-kannathasan",
    name: "KANNATHASAN",
    email: "kannathasan@truflow.com",
    signature: "/signature/signature-kannadhasan.png",
    roleName: "Approver",
  },
  {
    _id: "sig-admin",
    name: "System Administrator",
    email: "admin@truflow.com",
    signature: "",
    roleName: "System Administrator",
  },
  {
    _id: "sig-qe",
    name: "Quality Engineer",
    email: "qe@truflow.com",
    signature: "",
    roleName: "Quality Engineer",
  },
];

interface HydroTestFormProps {
  data: HydroTestCertificateData;
  onChange: (newData: HydroTestCertificateData) => void;
  errors?: Record<string, string>;
  onSaveDraft?: () => void;
  onSubmitForApproval?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  submitLabel?: string;
  onSwitchToPreview?: () => void;
}

export const HydroTestForm: React.FC<HydroTestFormProps> = ({
  data,
  onChange,
  errors = {},
  onSaveDraft,
  onSubmitForApproval,
  onCancel,
  isSaving = false,
  submitLabel = "Save & Submit for Approval",
  onSwitchToPreview,
}) => {
  const [openSections, setOpenSections] = useState({
    orderInfo: true,
    pressureTests: true,
    remarks: true,
    signatories: true,
  });

  const [signatories, setSignatories] = useState<SignatoryUser[]>(DEFAULT_SIGNATORIES);

  useEffect(() => {
    let ignore = false;
    async function loadSignatories() {
      try {
        const res = await fetch("/api/users/signatories");
        if (res.ok) {
          const json = await res.json();
          if (!ignore && Array.isArray(json.signatories) && json.signatories.length > 0) {
            const apiList: SignatoryUser[] = json.signatories;
            const merged = [...apiList];
            for (const def of DEFAULT_SIGNATORIES) {
              const exists = merged.some(
                (u) => u.name.trim().toLowerCase() === def.name.trim().toLowerCase()
              );
              if (!exists) {
                merged.push(def);
              }
            }
            setSignatories(merged);
          }
        }
      } catch (err) {
        console.error("Failed to load signatories:", err);
      }
    }
    loadSignatories();
    return () => {
      ignore = true;
    };
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFieldChange = (
    field: keyof HydroTestCertificateData,
    val: unknown
  ) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  // Pressure Tests management
  const tests = data.tests || {
    shellHydro: {
      id: "shell-hydro",
      name: "SHELL TEST (HYDROSTATIC)",
      enabled: true,
      pressure: "30",
      duration: "15",
      results: "Zero Leak - Accepted",
    },
    seatHydro: {
      id: "seat-hydro",
      name: "SEAT TEST (HYDROSTATIC)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
    seatAir: {
      id: "seat-air",
      name: "SEAT TEST (AIR)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
    backSeatHydro: {
      id: "back-seat-hydro",
      name: "BACK SEAT TEST (HYDROSTATIC)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
  };

  const handleTestToggle = (
    testKey: keyof typeof tests,
    checked: boolean
  ) => {
    onChange({
      ...data,
      tests: {
        ...tests,
        [testKey]: {
          ...tests[testKey],
          enabled: checked,
          pressure: checked
            ? tests[testKey].pressure === "-"
              ? ""
              : tests[testKey].pressure
            : "-",
          duration: checked
            ? tests[testKey].duration === "-"
              ? ""
              : tests[testKey].duration
            : "-",
          results: checked
            ? tests[testKey].results === "-"
              ? "Zero Leak - Accepted"
              : tests[testKey].results
            : "-",
        },
      },
    });
  };

  const handleTestValueChange = (
    testKey: keyof typeof tests,
    field: keyof MaterialHydroPressureTestItem,
    val: string
  ) => {
    onChange({
      ...data,
      tests: {
        ...tests,
        [testKey]: {
          ...tests[testKey],
          [field]: val,
        },
      },
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ===================================================================== */}
      {/* TOP HEADER CONTROLS                                                   */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-3 z-20 backdrop-blur-md bg-white/95">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Template Form
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hydro Test Certificate</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-bold">
              EN 10204 3.1
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToPreview && (
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Layout</span>
            </button>
          )}

          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition shadow-2xs"
            >
              Save Draft
            </button>
          )}

          {onSubmitForApproval && (
            <button
              type="button"
              onClick={onSubmitForApproval}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] disabled:opacity-50 transition shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{submitLabel}</span>
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. ORDER & GENERAL DETAILS                                            */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleSection("orderInfo")}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Header &amp; Order Details
              </h3>
              <p className="text-xs text-slate-500">
                Customer, PO number, Project, Standards, and Drawing references
              </p>
            </div>
          </div>
          {openSections.orderInfo ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {openSections.orderInfo && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.customerName || ""}
                  onChange={(e) => handleFieldChange("customerName", e.target.value)}
                  placeholder="e.g. Petrofac / L&T / Aramco"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.customerName ? "border-red-400 bg-red-50/30" : "border-slate-200"
                  } focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition`}
                />
                {errors.customerName && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {errors.customerName}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PO NO
                </label>
                <input
                  type="text"
                  value={data.poNo || ""}
                  onChange={(e) => handleFieldChange("poNo", e.target.value)}
                  placeholder="e.g. 10053152"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={data.projectName || ""}
                  onChange={(e) => handleFieldChange("projectName", e.target.value)}
                  placeholder="e.g. Flare Gas Recovery"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={data.date ? String(data.date).split("T")[0] : ""}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PRODUCT Type
                </label>
                <input
                  type="text"
                  value={data.productType || ""}
                  onChange={(e) => handleFieldChange("productType", e.target.value)}
                  placeholder="e.g. Triple Offset Butterfly Valve"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Testing Std
                </label>
                <input
                  type="text"
                  value={data.testingStd || ""}
                  onChange={(e) => handleFieldChange("testingStd", e.target.value)}
                  placeholder="e.g. API 598"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  F TO F Std
                </label>
                <input
                  type="text"
                  value={data.fToFStd || ""}
                  onChange={(e) => handleFieldChange("fToFStd", e.target.value)}
                  placeholder="e.g. API 609 / ASME B16.10"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificates No (Ref / Manual)
                </label>
                <input
                  type="text"
                  value={data.certificateNumber || ""}
                  onChange={(e) => handleFieldChange("certificateNumber", e.target.value)}
                  placeholder="Leave empty for auto HTC-XXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition font-mono"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  DESIGN
                </label>
                <input
                  type="text"
                  value={data.design || ""}
                  onChange={(e) => handleFieldChange("design", e.target.value)}
                  placeholder="e.g. Offset / High Performance"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mfg Std
                </label>
                <input
                  type="text"
                  value={data.mfgStd || ""}
                  onChange={(e) => handleFieldChange("mfgStd", e.target.value)}
                  placeholder="e.g. API 609A / BS 5155 / IS 3095"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ends Std
                </label>
                <input
                  type="text"
                  value={data.endsStd || ""}
                  onChange={(e) => handleFieldChange("endsStd", e.target.value)}
                  placeholder="e.g. ASME B16.5 / Wafer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GAD NO
                </label>
                <input
                  type="text"
                  value={data.gadNo || ""}
                  onChange={(e) => handleFieldChange("gadNo", e.target.value)}
                  placeholder="e.g. GAD-2024-001"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. PRESSURE TEST AND INSPECTION (WITH USE / IGNORE CHECKBOXES)         */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleSection("pressureTests")}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>Pressure Test &amp; Inspection</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  4 Tests with Use/Ignore Checkboxes
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Check to enable a test; uncheck to ignore and display &quot;-&quot; on the certificate
              </p>
            </div>
          </div>
          {openSections.pressureTests ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {openSections.pressureTests && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Test standard rule */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold text-slate-800">
                  TEST ACCORDING TO :
                </span>
              </div>
              <input
                type="text"
                value={data.testAccordingTo || ""}
                onChange={(e) => handleFieldChange("testAccordingTo", e.target.value)}
                placeholder="API 598"
                className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#FF2D01] focus:outline-none font-bold"
              />
            </div>

            {/* 4 Test Items Cards */}
            <div className="space-y-3">
              {(
                [
                  {
                    key: "shellHydro" as const,
                    name: "SHELL TEST (HYDROSTATIC)",
                    badge: "Hydrostatic",
                  },
                  {
                    key: "seatHydro" as const,
                    name: "SEAT TEST (HYDROSTATIC)",
                    badge: "Hydrostatic",
                  },
                  {
                    key: "seatAir" as const,
                    name: "SEAT TEST (AIR)",
                    badge: "Pneumatic / Air",
                  },
                  {
                    key: "backSeatHydro" as const,
                    name: "BACK SEAT TEST (HYDROSTATIC)",
                    badge: "Hydrostatic",
                  },
                ] as const
              ).map(({ key, name, badge }) => {
                const item = tests[key];
                const isEnabled = Boolean(item.enabled);

                return (
                  <div
                    key={key}
                    className={`p-4 rounded-2xl border transition-all ${
                      isEnabled
                        ? "bg-white border-orange-200 shadow-xs"
                        : "bg-slate-50/60 border-slate-200 opacity-80"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      {/* Checkbox & Test Title */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) => handleTestToggle(key, e.target.checked)}
                            className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                          />
                          <span
                            className={`text-xs font-black tracking-tight ${
                              isEnabled ? "text-slate-900" : "text-slate-500"
                            }`}
                          >
                            {name}
                          </span>
                        </label>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isEnabled
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isEnabled ? "Included" : "Ignored (-)"}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          ({badge})
                        </span>
                      </div>

                      {/* Inputs if enabled */}
                      {isEnabled ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 lg:max-w-xl">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-0.5">
                              <span>PRESSURE</span>
                              <span className="font-mono text-slate-400">Kg/cm2</span>
                            </div>
                            <input
                              type="text"
                              value={item.pressure || ""}
                              onChange={(e) =>
                                handleTestValueChange(key, "pressure", e.target.value)
                              }
                              placeholder="e.g. 30"
                              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none font-mono"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-0.5">
                              <span>DURATION</span>
                              <span className="font-mono text-slate-400">SECONDS</span>
                            </div>
                            <input
                              type="text"
                              value={item.duration || ""}
                              onChange={(e) =>
                                handleTestValueChange(key, "duration", e.target.value)
                              }
                              placeholder="e.g. 15"
                              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none font-mono"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-0.5">
                              <span>RESULTS</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleTestValueChange(
                                    key,
                                    "results",
                                    "Zero Leak - Accepted"
                                  )
                                }
                                className="text-[9px] text-orange-600 hover:underline"
                              >
                                Set Accepted
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item.results || ""}
                              onChange={(e) =>
                                handleTestValueChange(key, "results", e.target.value)
                              }
                              placeholder="Zero Leak - Accepted"
                              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic py-1 flex items-center gap-1.5">
                          <span>Test marked as ignored. Pressure, Duration, and Results will display as &quot;-&quot;.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side inspections */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                Additional Inspection Statuses
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    DIMENSIONAL INSPECTION
                  </label>
                  <input
                    type="text"
                    value={data.dimensionalInspection || "OK"}
                    onChange={(e) =>
                      handleFieldChange("dimensionalInspection", e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-emerald-700"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    VISUAL INSPECTION
                  </label>
                  <input
                    type="text"
                    value={data.visualInspection || "OK"}
                    onChange={(e) => handleFieldChange("visualInspection", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-emerald-700"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    OPERATIONAL INSPECTION
                  </label>
                  <input
                    type="text"
                    value={data.operationalInspection || "OK"}
                    onChange={(e) =>
                      handleFieldChange("operationalInspection", e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. REMARKS / NOTES                                                    */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleSection("remarks")}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Remarks / General Observations
              </h3>
              <p className="text-xs text-slate-500">
                Optional remarks or test notes displayed on the certificate
              </p>
            </div>
          </div>
          {openSections.remarks ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {openSections.remarks && (
          <div className="p-5 sm:p-6 space-y-3">
            <textarea
              rows={3}
              value={data.remarks || ""}
              onChange={(e) => handleFieldChange("remarks", e.target.value)}
              placeholder="e.g. All hydrostatic tests witnessed and verified in accordance with API 598 standards."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF2D01] focus:outline-none transition leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. SIGNATORIES & APPROVAL WORKFLOW                                    */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleSection("signatories")}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Signatories &amp; Certification Sign-Off
              </h3>
              <p className="text-xs text-slate-500">
                Prepared by, Reviewed by, and Approved by signatories
              </p>
            </div>
          </div>
          {openSections.signatories ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {openSections.signatories && (
          <div className="p-5 space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* 1. PREPARED BY */}
              <div className="space-y-2 border border-slate-200 p-3.5 rounded-2xl bg-slate-50/50">
                <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#FF2D01]" />
                  <span>1. PREPARED BY</span>
                </label>
                <select
                  value={
                    signatories.find(
                      (u) => u.name.trim().toLowerCase() === (data.preparedBy || "").trim().toLowerCase()
                    )?._id || ""
                  }
                  onChange={(e) => {
                    const selId = e.target.value;
                    if (!selId) {
                      onChange({
                        ...data,
                        preparedBy: "",
                        preparedSignatureUrl: "",
                      });
                      return;
                    }
                    const sel = signatories.find((u) => u._id === selId);
                    if (sel) {
                      const sigUrl =
                        sel.signature ||
                        DEFAULT_SIGNATORIES.find(
                          (d) => d.name.trim().toLowerCase() === sel.name.trim().toLowerCase()
                        )?.signature ||
                        "";
                      onChange({
                        ...data,
                        preparedBy: sel.name,
                        preparedSignatureUrl: sigUrl,
                      });
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 cursor-pointer font-medium"
                >
                  <option value="">-- Select Signatory --</option>
                  {signatories.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} {u.roleName ? `(${u.roleName})` : ""}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={data.preparedBy || ""}
                  onChange={(e) => handleFieldChange("preparedBy", e.target.value)}
                  placeholder="Or type custom name"
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
                {data.preparedSignatureUrl && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.preparedSignatureUrl}
                      alt="Prepared Sign"
                      className="h-7 w-auto object-contain mix-blend-multiply"
                    />
                    <span className="text-[10px] font-bold text-emerald-800">Sign Linked</span>
                  </div>
                )}
              </div>

              {/* 2. REVIEWED BY */}
              <div className="space-y-2 border border-slate-200 p-3.5 rounded-2xl bg-slate-50/50">
                <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>2. REVIEWED BY</span>
                </label>
                <select
                  value={
                    signatories.find(
                      (u) =>
                        u.name.trim().toLowerCase() ===
                        (data.reviewedBy || data.witnessedBy || "").trim().toLowerCase()
                    )?._id || ""
                  }
                  onChange={(e) => {
                    const selId = e.target.value;
                    if (!selId) {
                      onChange({
                        ...data,
                        reviewedBy: "",
                        reviewedSignatureUrl: "",
                        witnessedBy: "",
                        witnessSignatureUrl: "",
                      });
                      return;
                    }
                    const sel = signatories.find((u) => u._id === selId);
                    if (sel) {
                      const sigUrl =
                        sel.signature ||
                        DEFAULT_SIGNATORIES.find(
                          (d) => d.name.trim().toLowerCase() === sel.name.trim().toLowerCase()
                        )?.signature ||
                        "";
                      onChange({
                        ...data,
                        reviewedBy: sel.name,
                        reviewedSignatureUrl: sigUrl,
                        witnessedBy: sel.name,
                        witnessSignatureUrl: sigUrl,
                      });
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 cursor-pointer font-medium"
                >
                  <option value="">-- Select Signatory --</option>
                  {signatories.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} {u.roleName ? `(${u.roleName})` : ""}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={data.reviewedBy || data.witnessedBy || ""}
                  onChange={(e) => {
                    onChange({
                      ...data,
                      reviewedBy: e.target.value,
                      witnessedBy: e.target.value,
                    });
                  }}
                  placeholder="Or type custom name"
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
                {(data.reviewedSignatureUrl || data.witnessSignatureUrl) && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.reviewedSignatureUrl || data.witnessSignatureUrl}
                      alt="Reviewed Sign"
                      className="h-7 w-auto object-contain mix-blend-multiply"
                    />
                    <span className="text-[10px] font-bold text-emerald-800">Sign Linked</span>
                  </div>
                )}
              </div>

              {/* 3. APPROVED BY */}
              <div className="space-y-2 border border-slate-200 p-3.5 rounded-2xl bg-slate-50/50">
                <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>3. APPROVED BY</span>
                </label>
                <select
                  value={
                    signatories.find(
                      (u) => u.name.trim().toLowerCase() === (data.approvedBy || "").trim().toLowerCase()
                    )?._id || ""
                  }
                  onChange={(e) => {
                    const selId = e.target.value;
                    if (!selId) {
                      onChange({
                        ...data,
                        approvedBy: "",
                        approvedSignatureUrl: "",
                      });
                      return;
                    }
                    const sel = signatories.find((u) => u._id === selId);
                    if (sel) {
                      const sigUrl =
                        sel.signature ||
                        DEFAULT_SIGNATORIES.find(
                          (d) => d.name.trim().toLowerCase() === sel.name.trim().toLowerCase()
                        )?.signature ||
                        "";
                      onChange({
                        ...data,
                        approvedBy: sel.name,
                        approvedSignatureUrl: sigUrl,
                      });
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 cursor-pointer font-medium"
                >
                  <option value="">-- Select Signatory --</option>
                  {signatories.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} {u.roleName ? `(${u.roleName})` : ""}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={data.approvedBy || ""}
                  onChange={(e) => handleFieldChange("approvedBy", e.target.value)}
                  placeholder="Or type custom name"
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
                {data.approvedSignatureUrl && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.approvedSignatureUrl}
                      alt="Approved Sign"
                      className="h-7 w-auto object-contain mix-blend-multiply"
                    />
                    <span className="text-[10px] font-bold text-emerald-800">Sign Linked</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
