"use client";

import React, { useState, useEffect } from "react";
import {
  PaintingReportCertificateData,
  AtmosphericConditionRow,
  PaintingCoatItem,
} from "@/types/certificate";
import {
  FileText,
  Sliders,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

interface PaintingReportFormProps {
  data: PaintingReportCertificateData;
  onChange: (newData: PaintingReportCertificateData) => void;
  errors?: Record<string, string>;
  onSaveDraft?: () => void;
  onSubmitForApproval?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  submitLabel?: string;
  onSwitchToPreview?: () => void;
}

interface SignatoryUser {
  _id: string;
  name: string;
  roleName?: string;
  signature?: string;
}

/**
 * Robust parser for date/time strings like "15.06.26 @ 10.00 am", "15/06/2026 10:00 am", or "2026-06-15 10:00"
 */
function parseCustomDateTime(str: string): Date | null {
  if (!str) return null;
  const trimmed = str.trim();

  // Pattern: DD.MM.YY @ HH.MM am/pm or DD/MM/YYYY @ HH:MM am/pm
  const m = trimmed.match(
    /^(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{2,4})\s*@?\s*(\d{1,2})[:\.](\d{2})\s*(am|pm)?$/i
  );
  if (m) {
    const [, d, month, y, h, min, meridiem] = m;
    let year = parseInt(y, 10);
    if (year < 100) year += 2000;
    let hour = parseInt(h, 10);
    if (meridiem) {
      const lower = meridiem.toLowerCase();
      if (lower === "pm" && hour < 12) hour += 12;
      if (lower === "am" && hour === 12) hour = 0;
    }
    const parsed = new Date(year, parseInt(month, 10) - 1, parseInt(d, 10), hour, parseInt(min, 10));
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // Fallback to standard Date parser
  const std = new Date(trimmed);
  return isNaN(std.getTime()) ? null : std;
}

/**
 * Formats a Date object to "DD.MM.YY @ HH.MM am/pm" (matching reference format: 15.06.26 @ 10.00 am)
 */
function formatCustomDateTime(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear()).slice(-2);
  let h = date.getHours();
  const min = String(date.getMinutes()).padStart(2, "0");
  const meridiem = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  const hStr = String(h).padStart(2, "0");
  return `${d}.${m}.${y} @ ${hStr}.${min} ${meridiem}`;
}

export const PaintingReportForm: React.FC<PaintingReportFormProps> = ({
  data,
  onChange,
  onSaveDraft,
  onSubmitForApproval,
  onCancel,
  isSaving = false,
  submitLabel = "Submit for Approval",
  onSwitchToPreview,
}) => {
  const [openSections, setOpenSections] = useState({
    general: true,
    atmospheric: true,
    surfacePrep: true,
    paintingSystem: true,
    instruments: true,
    signatories: true,
  });

  const [signatories, setSignatories] = useState<SignatoryUser[]>([]);

  useEffect(() => {
    fetch("/api/users/signatories")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.signatories)) {
          setSignatories(resData.signatories);
        }
      })
      .catch((err) => console.error("Failed to fetch signatories:", err));
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = <K extends keyof PaintingReportCertificateData>(
    field: K,
    val: PaintingReportCertificateData[K]
  ) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  // =========================================================================
  // ATMOSPHERIC CONDITIONS HANDLERS & AUTO-FILL DURATION
  // =========================================================================
  const atmosphericRows = Array.isArray(data.atmosphericConditions)
    ? data.atmosphericConditions
    : [];

  const handleAtmosphericChange = (
    index: number,
    field: keyof AtmosphericConditionRow,
    value: string
  ) => {
    const updated = [...atmosphericRows];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-fill time gap if editing row 0 dateTime
    if (index === 0 && field === "dateTime") {
      const baseDate = parseCustomDateTime(value);
      if (baseDate) {
        autoFillTimes(updated, baseDate);
      }
    }

    handleChange("atmosphericConditions", updated);
  };

  const autoFillTimes = (rows: AtmosphericConditionRow[], baseDate: Date) => {
    // Row 0: Base Date/Time (e.g. 15.06.26 @ 10.00 am)
    // Row 1: +4 hours (e.g. 15.06.26 @ 02.00 pm)
    // Row 2: Next day 10.00 am (+24 hours, e.g. 16.06.26 @ 10.00 am)
    // Row 3: Day 3 05.30 pm (base date + 2 days @ 17:30, e.g. 17.06.26 @ 05.30 pm)
    // Row 4+: Continues pattern
    for (let i = 1; i < rows.length; i++) {
      if (i === 1) {
        const r1 = new Date(baseDate.getTime() + 4 * 3600 * 1000);
        rows[i].dateTime = formatCustomDateTime(r1);
      } else if (i === 2) {
        const r2 = new Date(baseDate.getTime() + 24 * 3600 * 1000);
        rows[i].dateTime = formatCustomDateTime(r2);
      } else if (i === 3) {
        const r3 = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() + 2,
          17,
          30
        );
        rows[i].dateTime = formatCustomDateTime(r3);
      } else {
        const extraDays = Math.floor(i / 2) + 1;
        const hour = i % 2 === 0 ? 10 : 17;
        const min = i % 2 === 0 ? 0 : 30;
        const rx = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() + extraDays,
          hour,
          min
        );
        rows[i].dateTime = formatCustomDateTime(rx);
      }
    }
  };

  const triggerAutoFillSchedule = () => {
    if (atmosphericRows.length === 0) return;
    const baseDate = parseCustomDateTime(atmosphericRows[0]?.dateTime || "");
    if (!baseDate) {
      alert("Please enter a valid start date & time in row 1 first (e.g. 15.06.26 @ 10.00 am)");
      return;
    }
    const updated = [...atmosphericRows];
    autoFillTimes(updated, baseDate);
    handleChange("atmosphericConditions", updated);
  };

  const addAtmosphericRow = () => {
    const newIdx = atmosphericRows.length + 1;
    let newDateTime = "";
    if (atmosphericRows.length > 0) {
      const baseDate = parseCustomDateTime(atmosphericRows[0]?.dateTime || "");
      if (baseDate) {
        const extraDays = Math.floor(atmosphericRows.length / 2) + 1;
        const hour = atmosphericRows.length % 2 === 0 ? 10 : 17;
        const min = atmosphericRows.length % 2 === 0 ? 0 : 30;
        const rx = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() + extraDays,
          hour,
          min
        );
        newDateTime = formatCustomDateTime(rx);
      }
    }
    const newRow: AtmosphericConditionRow = {
      id: `atm-${Date.now()}-${newIdx}`,
      dateTime: newDateTime,
      process: "Final",
      dryBulbTemp: "13",
      wetBulbTemp: "6",
      dewPoint: "3",
      rh: "68%",
      steelTemp: "13",
    };
    handleChange("atmosphericConditions", [...atmosphericRows, newRow]);
  };

  const removeAtmosphericRow = (idx: number) => {
    if (atmosphericRows.length <= 1) {
      alert("You must have at least one atmospheric condition row.");
      return;
    }
    const updated = atmosphericRows.filter((_, i) => i !== idx);
    handleChange("atmosphericConditions", updated);
  };

  // =========================================================================
  // PAINTING COATS HANDLERS
  // =========================================================================
  const coats = Array.isArray(data.coats) ? data.coats : [];

  const handleCoatChange = (
    index: number,
    field: keyof PaintingCoatItem,
    value: string
  ) => {
    const updated = [...coats];
    updated[index] = { ...updated[index], [field]: value };
    handleChange("coats", updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* TOP ACTION BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-50 text-[#FF2D01] rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Surface Preparation &amp; Painting Inspection Report
            </h2>
            <p className="text-xs text-slate-500">
              Fill and customize inspection parameters, environmental readings, and coats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToPreview && (
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Mode</span>
            </button>
          )}

          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          )}

          {onSubmitForApproval && (
            <button
              type="button"
              onClick={onSubmitForApproval}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#FF2D01] hover:bg-[#e02800] transition shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. GENERAL & ORDER DETAILS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("general")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF2D01]" />
            <span className="text-sm font-bold text-slate-800">
              1. Customer, Order &amp; Product Details
            </span>
          </div>
          {openSections.general ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.general && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={data.customerName || ""}
                onChange={(e) => handleChange("customerName", e.target.value)}
                placeholder="e.g. Acewater Pte Ltd"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer PO No</label>
              <input
                type="text"
                value={data.customerPO || ""}
                onChange={(e) => handleChange("customerPO", e.target.value)}
                placeholder="e.g. SGS190306"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Inspection</label>
              <input
                type="date"
                value={data.date || ""}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location / Place</label>
              <input
                type="text"
                value={data.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. COIMBATORE"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Valve Type</label>
              <input
                type="text"
                value={data.valveType || ""}
                onChange={(e) => handleChange("valveType", e.target.value)}
                placeholder="e.g. Dual plate check valve"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Valve Size</label>
              <input
                type="text"
                value={data.valveSize || ""}
                onChange={(e) => handleChange("valveSize", e.target.value)}
                placeholder='e.g. 48" or Dual plate check valve-48"'
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Colour / Shade <span className="text-[#FF2D01]">(Default: RAL3020 / Red)</span>
              </label>
              <input
                type="text"
                value={data.colourShade || "RAL3020 / Red"}
                onChange={(e) => handleChange("colourShade", e.target.value)}
                placeholder="RAL3020 / Red"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tag No.</label>
              <input
                type="text"
                value={data.tagNo || ""}
                onChange={(e) => handleChange("tagNo", e.target.value)}
                placeholder="e.g. 2631301001-002"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Atmospheric Condition At Work Site
              </label>
              <input
                type="text"
                value={data.atmosphericConditionAtWorkSite || "Cleanliness Class 1"}
                onChange={(e) => handleChange("atmosphericConditionAtWorkSite", e.target.value)}
                placeholder="e.g. Cleanliness Class 1"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quantity (QTY)</label>
              <input
                type="text"
                value={data.qty || "2"}
                onChange={(e) => handleChange("qty", e.target.value)}
                placeholder="e.g. 2"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. ATMOSPHERIC CONDITIONS & AUTO-FILL DURATION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("atmospheric")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF2D01]" />
            <span className="text-sm font-bold text-slate-800">
              2. Atmospheric Conditions at Work Site ({atmosphericRows.length} Rows)
            </span>
          </div>
          {openSections.atmospheric ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.atmospheric && (
          <div className="p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs ">
              {/* <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Auto-fill Duration:</strong> Editing row 1 date &amp; time will auto-calculate
                  time gaps (e.g. 10.00 am &rarr; 02.00 pm &rarr; next day 10.00 am &rarr; day 3 05.30 pm).
                </span>
              </div> */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={triggerAutoFillSchedule}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-fill Time Gaps</span>
                </button>
                <button
                  type="button"
                  onClick={addAtmosphericRow}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              </div>
            </div>

            {/* Atmospheric Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2.5 min-w-[170px]">Date &amp; Time</th>
                    <th className="p-2.5 min-w-[110px]">Process</th>
                    <th className="p-2.5 min-w-[95px]">Dry Bulb (°C)</th>
                    <th className="p-2.5 min-w-[95px]">Wet Bulb (°C)</th>
                    <th className="p-2.5 min-w-[85px]">Dew Point</th>
                    <th className="p-2.5 min-w-[75px]">RH%</th>
                    <th className="p-2.5 min-w-[95px]">Steel Temp (°C)</th>
                    <th className="p-2.5 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {atmosphericRows.map((row, idx) => (
                    <tr key={row.id || `atm-form-${idx}`} className="hover:bg-slate-50/80">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.dateTime}
                          onChange={(e) =>
                            handleAtmosphericChange(idx, "dateTime", e.target.value)
                          }
                          placeholder="15.06.26 @ 10.00 am"
                          className="w-full font-mono text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.process}
                          onChange={(e) =>
                            handleAtmosphericChange(idx, "process", e.target.value)
                          }
                          placeholder="Blasting / Primer / Midcoat / Final"
                          className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] font-semibold text-slate-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.dryBulbTemp}
                          onChange={(e) =>
                            handleAtmosphericChange(idx, "dryBulbTemp", e.target.value)
                          }
                          placeholder="13"
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.wetBulbTemp}
                          onChange={(e) =>
                            handleAtmosphericChange(idx, "wetBulbTemp", e.target.value)
                          }
                          placeholder="6"
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.dewPoint}
                          onChange={(e) =>
                            handleAtmosphericChange(idx, "dewPoint", e.target.value)
                          }
                          placeholder="3"
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.rh}
                          onChange={(e) => handleAtmosphericChange(idx, "rh", e.target.value)}
                          placeholder="70%"
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.steelTemp}
                          onChange={(e) =>
                            handleAtmosphericChange(idx, "steelTemp", e.target.value)
                          }
                          placeholder="13"
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeAtmosphericRow(idx)}
                          title="Remove row"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. SURFACE PREPARATION & CLEANING */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("surfacePrep")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF2D01]" />
            <span className="text-sm font-bold text-slate-800">
              3. Surface Preparation &amp; Cleaning
            </span>
          </div>
          {openSections.surfacePrep ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.surfacePrep && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Abrasive Cleaning</label>
              <input
                type="text"
                value={data.abrasiveCleaning || "ISO 8501-1"}
                onChange={(e) => handleChange("abrasiveCleaning", e.target.value)}
                placeholder="ISO 8501-1"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Abrasive Checked for Cleanliness
              </label>
              <select
                value={data.abrasiveCheckedForCleanliness || "YES"}
                onChange={(e) => handleChange("abrasiveCheckedForCleanliness", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900 font-semibold bg-white"
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
                <option value="YES / NO">YES / NO</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dust Level</label>
              <input
                type="text"
                value={data.dustLevel || "≤1"}
                onChange={(e) => handleChange("dustLevel", e.target.value)}
                placeholder="≤1"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specified Standard</label>
              <input
                type="text"
                value={data.specifiedStandard || "ISO 8501-Sa 21/2"}
                onChange={(e) => handleChange("specifiedStandard", e.target.value)}
                placeholder="ISO 8501-Sa 21/2"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Profile Thickness Required
              </label>
              <input
                type="text"
                value={data.profileThicknessRequired || ""}
                onChange={(e) => handleChange("profileThicknessRequired", e.target.value)}
                placeholder="Leave empty or enter specified thickness"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Surface Cleanliness</label>
              <input
                type="text"
                value={data.surfaceCleanliness || "Class 1"}
                onChange={(e) => handleChange("surfaceCleanliness", e.target.value)}
                placeholder="Class 1"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Observed Cleanliness</label>
              <input
                type="text"
                value={data.observed || "White corundum"}
                onChange={(e) => handleChange("observed", e.target.value)}
                placeholder="White corundum"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. PAINTING SYSTEM FOR VALVES & ACCESSORIES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("paintingSystem")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF2D01]" />
            <span className="text-sm font-bold text-slate-800">
              4. Painting System for Valves &amp; Accessories ({coats.length} Coats)
            </span>
          </div>
          {openSections.paintingSystem ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.paintingSystem && (
          <div className="p-5 space-y-6 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Painting System Section Title
              </label>
              <input
                type="text"
                value={data.paintingSystemHeader || "PAINTING SYSTEM FOR CARBON STEEL VALVES & ACCESSORIES"}
                onChange={(e) => handleChange("paintingSystemHeader", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900 uppercase font-bold"
              />
            </div>

            {/* Coats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coats.map((coat, idx) => (
                <div
                  key={coat.id || `coat-card-${idx}`}
                  className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-sm text-slate-800">
                      Coat {idx + 1}: {coat.coatName}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Applied Coat Name
                    </label>
                    <input
                      type="text"
                      value={coat.appliedCoat}
                      onChange={(e) => handleCoatChange(idx, "appliedCoat", e.target.value)}
                      placeholder="e.g. Primer (Barrier 80 S)"
                      className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Application Method
                    </label>
                    <input
                      type="text"
                      value={coat.applicationMethod}
                      onChange={(e) => handleCoatChange(idx, "applicationMethod", e.target.value)}
                      placeholder="Conventional air spray"
                      className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Paint Mfg. Name
                    </label>
                    <input
                      type="text"
                      value={coat.paintMfgName}
                      onChange={(e) => handleCoatChange(idx, "paintMfgName", e.target.value)}
                      placeholder="Jotun"
                      className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={coat.productName}
                      onChange={(e) => handleCoatChange(idx, "productName", e.target.value)}
                      placeholder="Check valve"
                      className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Colour / Shade
                    </label>
                    <input
                      type="text"
                      value={coat.colourShade}
                      onChange={(e) => handleCoatChange(idx, "colourShade", e.target.value)}
                      placeholder="Red"
                      className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        DFT Req. (µm)
                      </label>
                      <input
                        type="text"
                        value={coat.dftRequired}
                        onChange={(e) => handleCoatChange(idx, "dftRequired", e.target.value)}
                        placeholder="50-60"
                        className="w-full border border-slate-300 rounded-xl px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        DFT Obs. (µm)
                      </label>
                      <input
                        type="text"
                        value={coat.dftObserved}
                        onChange={(e) => handleCoatChange(idx, "dftObserved", e.target.value)}
                        placeholder="40-60"
                        className="w-full border border-slate-300 rounded-xl px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white font-mono font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Pull-off & Adhesion Tests */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/30 space-y-3">
              <span className="font-bold text-xs text-slate-800 block">
                Optional Pull-Off &amp; Adhesion Tests
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pull Off Test ISO 4624 (Req)
                  </label>
                  <input
                    type="text"
                    value={data.pullOffTestRequired || ""}
                    onChange={(e) => handleChange("pullOffTestRequired", e.target.value)}
                    placeholder="Min.5 Mpa"
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pull Off Test Actual
                  </label>
                  <input
                    type="text"
                    value={data.pullOffTestActual || ""}
                    onChange={(e) => handleChange("pullOffTestActual", e.target.value)}
                    placeholder="14.28 / 13.98 / 15.12 Mpa"
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pull Off Test Location
                  </label>
                  <input
                    type="text"
                    value={data.pullOffTestLocation || ""}
                    onChange={(e) => handleChange("pullOffTestLocation", e.target.value)}
                    placeholder="Intermediate coat"
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Adhesion (X method) ISO 16276-2 (Req)
                  </label>
                  <input
                    type="text"
                    value={data.adhesionTestRequired || ""}
                    onChange={(e) => handleChange("adhesionTestRequired", e.target.value)}
                    placeholder="Req: Lv.0"
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Adhesion Test Actual
                  </label>
                  <input
                    type="text"
                    value={data.adhesionTestActual || ""}
                    onChange={(e) => handleChange("adhesionTestActual", e.target.value)}
                    placeholder="Actual : Lv.0"
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Adhesion Test Location
                  </label>
                  <input
                    type="text"
                    value={data.adhesionTestLocation || ""}
                    onChange={(e) => handleChange("adhesionTestLocation", e.target.value)}
                    placeholder="Location : Top coat"
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. INSTRUMENTS, CALIBRATION & COMMENTS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("instruments")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF2D01]" />
            <span className="text-sm font-bold text-slate-800">
              5. Instruments, Calibration &amp; Inspection Comments
            </span>
          </div>
          {openSections.instruments ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.instruments && (
          <div className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Instrument Used for Inspection
              </label>
              <input
                type="text"
                value={data.instrumentUsed || "(Coat Thickness Gauge) -KENCY"}
                onChange={(e) => handleChange("instrumentUsed", e.target.value)}
                placeholder="(Coat Thickness Gauge) -KENCY"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Calibration of Instruments
              </label>
              <textarea
                rows={2}
                value={
                  data.calibrationOfInstruments ||
                  "Calibration verified with known foil thickness and found acceptable - CTG-02, Due - 17-11-2026"
                }
                onChange={(e) => handleChange("calibrationOfInstruments", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Inspection Comments
              </label>
              <textarea
                rows={2}
                value={
                  data.inspectionComments ||
                  "The paint has no sagging , no delamination & the surface is uniform & smooth ."
                }
                onChange={(e) => handleChange("inspectionComments", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] text-slate-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. SIGNATORIES (PREPARED, REVIEWED, APPROVED) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("signatories")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-800">
              6. Signatories (Prepared By, Reviewed By &amp; Approved By)
            </span>
          </div>
          {openSections.signatories ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

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
                      (u) => u.name.toLowerCase() === (data.preparedBy || "").toLowerCase()
                    )?._id || ""
                  }
                  onChange={(e) => {
                    const sel = signatories.find((u) => u._id === e.target.value);
                    if (sel) {
                      handleChange("preparedBy", sel.name);
                      if (sel.signature) handleChange("preparedSignatureUrl", sel.signature);
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
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
                  onChange={(e) => handleChange("preparedBy", e.target.value)}
                  placeholder="Or type custom name"
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
                {data.preparedSignatureUrl && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
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
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>2. REVIEWED BY</span>
                </label>
                <select
                  value={
                    signatories.find(
                      (u) => u.name.toLowerCase() === (data.reviewedBy || "").toLowerCase()
                    )?._id || ""
                  }
                  onChange={(e) => {
                    const sel = signatories.find((u) => u._id === e.target.value);
                    if (sel) {
                      handleChange("reviewedBy", sel.name);
                      if (sel.signature) handleChange("reviewedSignatureUrl", sel.signature);
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
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
                  value={data.reviewedBy || ""}
                  onChange={(e) => handleChange("reviewedBy", e.target.value)}
                  placeholder="Or type custom name"
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
                {data.reviewedSignatureUrl && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    <img
                      src={data.reviewedSignatureUrl}
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
                      (u) => u.name.toLowerCase() === (data.approvedBy || "").toLowerCase()
                    )?._id || ""
                  }
                  onChange={(e) => {
                    const sel = signatories.find((u) => u._id === e.target.value);
                    if (sel) {
                      handleChange("approvedBy", sel.name);
                      if (sel.signature) handleChange("approvedSignatureUrl", sel.signature);
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
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
                  onChange={(e) => handleChange("approvedBy", e.target.value)}
                  placeholder="Or type custom name"
                  className="w-full border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
                {data.approvedSignatureUrl && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
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

            {/* Company Footer Info */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={data.companyName || "TRUFLOW AUTOMATION & CONTROLS PRIVATE LIMITED"}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Address</label>
                <input
                  type="text"
                  value={
                    data.companyAddress ||
                    "S.F No. 617/ 2H2, Vadakku Thottam, L&T Road, MALUMICHAMPATTI post, Coimbatore- 641021, Tamil Nadu"
                  }
                  onChange={(e) => handleChange("companyAddress", e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] text-slate-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
          >
            Save Draft
          </button>
        )}
        {onSubmitForApproval && (
          <button
            type="button"
            onClick={onSubmitForApproval}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-[#FF2D01] hover:bg-[#e02800] transition shadow-md disabled:opacity-50"
          >
            {submitLabel}
          </button>
        )}
      </div>
    </div>
  );
};
