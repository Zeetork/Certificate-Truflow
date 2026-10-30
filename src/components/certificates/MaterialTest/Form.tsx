"use client";

import React, { useState, useEffect } from "react";
import {
  MaterialTestCertificateData,
  MaterialHydroLineItem,
  MaterialHydroChemicalItem,
} from "@/types/certificate";
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Layers,
  FlaskConical,
  UserCheck,
  ShieldCheck,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  findMaterialSpec,
  getChemicalReference,
  getMechanicalReference,
  STANDARD_GRADE_NAMES,
  ASTM_PRESET_MATERIALS,
  ALL_PRESET_MATERIALS,
} from "@/lib/materialSpecs";

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

interface MaterialTestFormProps {
  data: MaterialTestCertificateData;
  onChange: (newData: MaterialTestCertificateData) => void;
  errors?: Record<string, string>;
  onSaveDraft?: () => void;
  onSubmitForApproval?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  submitLabel?: string;
  onSwitchToPreview?: () => void;
}

let itemIdCounter = 0;
function generateUniqueId(prefix = "mt"): string {
  itemIdCounter += 1;
  return `${prefix}-${Date.now()}-${itemIdCounter}`;
}

const DEFAULT_LINE_ITEM: MaterialHydroLineItem = {
  itemNo: 1,
  description: "TRIPLE OFFSET BUTTERFLY VALVE",
  qty: "1",
  classPn: "150#",
  inchDn: "2\"",
  mmDn: "50",
  serialNo: "TF-2401",
  ends: "WAFER",
  body: "WCB",
  disc: "CF8M",
  shaft: "SS410",
  seat: "PTFE",
  glandSeal: "GRAPHITE",
};

const DEFAULT_MATERIAL_ITEM: MaterialHydroChemicalItem = {
  partName: "BODY",
  bodyHeatNo: "H-5120",
  qty: "1",
  material: "ASTM A216 WCB",
  c: "0.22",
  si: "0.45",
  mn: "0.85",
  p: "0.025",
  s: "0.020",
  cr: "0.15",
  mo: "0.04",
  ni: "0.12",
  cu: "0.08",
  v: "0.01",
  other1: "-",
  other2: "-",
  ce: "0.38",
  tsMpa: "510",
  ysMpa: "285",
  elPercent: "24",
  raPsi: "42",
  hardn: "152",
  impactTestTemp: "-",
};

export const MaterialTestForm: React.FC<MaterialTestFormProps> = ({
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
    lineItems: true,
    materialProps: true,
    signatories: true,
  });

  const [signatories, setSignatories] = useState<SignatoryUser[]>(DEFAULT_SIGNATORIES);
  const [customMaterialRows, setCustomMaterialRows] = useState<Record<string, boolean>>({});

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
    field: keyof MaterialTestCertificateData,
    val: unknown
  ) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  // Line items management
  const lineItems: MaterialHydroLineItem[] =
    data.lineItems && data.lineItems.length > 0
      ? data.lineItems
      : [{ ...DEFAULT_LINE_ITEM, id: generateUniqueId("mt-item") }];

  const updateLineItems = (newItems: MaterialHydroLineItem[]) => {
    const reindexed = newItems.map((item, idx) => ({
      ...item,
      itemNo: idx + 1,
    }));
    onChange({
      ...data,
      lineItems: reindexed,
    });
  };

  const handleAddLineItem = () => {
    const newItem: MaterialHydroLineItem = {
      id: generateUniqueId("mt-item"),
      itemNo: lineItems.length + 1,
      description: "",
      qty: "1",
      classPn: lineItems[lineItems.length - 1]?.classPn || "150#",
      inchDn: "",
      mmDn: "",
      serialNo: "",
      ends: lineItems[lineItems.length - 1]?.ends || "WAFER",
      body: lineItems[lineItems.length - 1]?.body || "WCB",
      disc: lineItems[lineItems.length - 1]?.disc || "CF8M",
      shaft: lineItems[lineItems.length - 1]?.shaft || "SS410",
      seat: lineItems[lineItems.length - 1]?.seat || "PTFE",
      glandSeal: lineItems[lineItems.length - 1]?.glandSeal || "GRAPHITE",
    };
    updateLineItems([...lineItems, newItem]);
  };

  const handleDuplicateLineItem = (index: number) => {
    const source = lineItems[index];
    const cloned: MaterialHydroLineItem = {
      ...source,
      id: generateUniqueId("mt-item"),
      itemNo: lineItems.length + 1,
      serialNo: "",
    };
    const nextList = [...lineItems];
    nextList.splice(index + 1, 0, cloned);
    updateLineItems(nextList);
  };

  const handleDeleteLineItem = (index: number) => {
    if (lineItems.length <= 1) {
      alert("At least one line item is required on the certificate.");
      return;
    }
    const nextList = lineItems.filter((_, idx) => idx !== index);
    updateLineItems(nextList);
  };

  const handleLineItemChange = (
    index: number,
    field: keyof MaterialHydroLineItem,
    value: string
  ) => {
    const nextList = [...lineItems];
    nextList[index] = {
      ...nextList[index],
      [field]: value,
    };
    onChange({
      ...data,
      lineItems: nextList,
    });
  };

  // Chemical & Mechanical items management
  const materialItems: MaterialHydroChemicalItem[] =
    data.materialItems && data.materialItems.length > 0
      ? data.materialItems
      : [{ ...DEFAULT_MATERIAL_ITEM, id: generateUniqueId("mt-mat") }];

  const updateMaterialItems = (newItems: MaterialHydroChemicalItem[]) => {
    onChange({
      ...data,
      materialItems: newItems,
    });
  };

  const handleAddMaterialItem = () => {
    const newItem: MaterialHydroChemicalItem = {
      id: generateUniqueId("mt-mat"),
      partName: "DISC",
      bodyHeatNo: "",
      qty: "1",
      material: "ASTM A351 CF8M",
      c: "0.06",
      si: "0.75",
      mn: "1.10",
      p: "0.030",
      s: "0.015",
      cr: "18.5",
      mo: "2.20",
      ni: "9.80",
      cu: "-",
      v: "-",
      other1: "-",
      other2: "-",
      ce: "-",
      tsMpa: "540",
      ysMpa: "260",
      elPercent: "35",
      raPsi: "-",
      hardn: "160",
      impactTestTemp: "-",
    };
    updateMaterialItems([...materialItems, newItem]);
  };

  const handleDuplicateMaterialItem = (index: number) => {
    const source = materialItems[index];
    const cloned: MaterialHydroChemicalItem = {
      ...source,
      id: generateUniqueId("mt-mat"),
      bodyHeatNo: "",
    };
    const nextList = [...materialItems];
    nextList.splice(index + 1, 0, cloned);
    updateMaterialItems(nextList);
  };

  const handleDeleteMaterialItem = (index: number) => {
    if (materialItems.length <= 1) {
      alert("At least one material / heat number row is required.");
      return;
    }
    const nextList = materialItems.filter((_, idx) => idx !== index);
    updateMaterialItems(nextList);
  };

  const handleMaterialItemChange = (
    index: number,
    field: keyof MaterialHydroChemicalItem,
    value: string
  ) => {
    const nextList = [...materialItems];
    nextList[index] = {
      ...nextList[index],
      [field]: value,
    };
    onChange({
      ...data,
      materialItems: nextList,
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
            <span>Material Test Certificate</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-orange-100 text-[#FF2D01] font-bold">
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
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF2D01] flex items-center justify-center font-bold text-xs">
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
                  placeholder="Leave empty for auto MTC-XXXX"
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
      {/* 2. DESCRIPTION / MATERIAL LINE ITEMS (WITH + BUTTON)                  */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleSection("lineItems")}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF2D01] flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Description / Material Line Items
                </h3>
                <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {lineItems.length} {lineItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Valve description, class, DN, serial number, and materials (Body, Disc, Shaft, Seat, Gland)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddLineItem();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] rounded-xl transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line Item</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("lineItems")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              {openSections.lineItems ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.lineItems && (
          <div className="p-5 sm:p-6 space-y-4">
            {lineItems.map((item, index) => (
              <div
                key={item.id || `line-${index}`}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-orange-200 transition space-y-3"
              >
                {/* Header row with item # and actions */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      Line Item #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicateLineItem(index)}
                      title="Duplicate this line item"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLineItem(index)}
                        title="Delete this line item"
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Valve Description & Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  <div className="lg:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "description", e.target.value)
                      }
                      placeholder="TRIPLE OFFSET BUTTERFLY VALVE"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      QTY (PCS)
                    </label>
                    <input
                      type="text"
                      value={item.qty || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "qty", e.target.value)
                      }
                      placeholder="1"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      CLASS (PN)
                    </label>
                    <input
                      type="text"
                      value={item.classPn || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "classPn", e.target.value)
                      }
                      placeholder="150#"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      INCH (DN)
                    </label>
                    <input
                      type="text"
                      value={item.inchDn || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "inchDn", e.target.value)
                      }
                      placeholder={'2"'}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      MM (DN)
                    </label>
                    <input
                      type="text"
                      value={item.mmDn || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "mmDn", e.target.value)
                      }
                      placeholder="50"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Serial No, Ends & Part Materials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Serial No.
                    </label>
                    <input
                      type="text"
                      value={item.serialNo || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "serialNo", e.target.value)
                      }
                      placeholder="TF-2401"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold text-orange-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Ends
                    </label>
                    <input
                      type="text"
                      value={item.ends || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "ends", e.target.value)
                      }
                      placeholder="WAFER"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Body
                    </label>
                    <input
                      type="text"
                      value={item.body || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "body", e.target.value)
                      }
                      placeholder="WCB"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Disc
                    </label>
                    <input
                      type="text"
                      value={item.disc || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "disc", e.target.value)
                      }
                      placeholder="CF8M"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Shaft
                    </label>
                    <input
                      type="text"
                      value={item.shaft || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "shaft", e.target.value)
                      }
                      placeholder="SS410"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Seat
                    </label>
                    <input
                      type="text"
                      value={item.seat || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "seat", e.target.value)
                      }
                      placeholder="PTFE"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Gland Seal
                    </label>
                    <input
                      type="text"
                      value={item.glandSeal || ""}
                      onChange={(e) =>
                        handleLineItemChange(index, "glandSeal", e.target.value)
                      }
                      placeholder="GRAPHITE"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Add button */}
            <button
              type="button"
              onClick={handleAddLineItem}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-[#FF2D01] hover:text-[#FF2D01] rounded-2xl text-xs font-bold text-slate-500 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Valve Line Item</span>
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. CHEMICAL COMPOSITION & MECHANICAL PROPERTIES                       */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => toggleSection("materialProps")}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF2D01] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Chemical Composition % &amp; Mechanical Properties
                </h3>
                <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {materialItems.length} Part {materialItems.length === 1 ? "Row" : "Rows"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Heat numbers, metallurgy (C, Si, Mn, Cr, Mo, Ni...) and mechanical test results
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddMaterialItem();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Part / Heat Row</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("materialProps")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              {openSections.materialProps ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.materialProps && (
          <div className="p-5 sm:p-6 space-y-4">
            {materialItems.map((mat, index) => {
              const rowKey = mat.id || `mat-${index}`;
              const activeSpec = findMaterialSpec(mat.material);
              const isCustom =
                customMaterialRows[rowKey] ||
                Boolean(mat.material && !ALL_PRESET_MATERIALS.includes(mat.material));

              const tsRef = getMechanicalReference(activeSpec, "tsMpa");
              const ysRef = getMechanicalReference(activeSpec, "ysMpa");
              const elRef = getMechanicalReference(activeSpec, "elPercent");
              const raRef = getMechanicalReference(activeSpec, "raPsi");
              const hardnRef = getMechanicalReference(activeSpec, "hardn");
              const impactRef = getMechanicalReference(activeSpec, "impactTestTemp");

              return (
              <div
                key={mat.id || `mat-${index}`}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-400 transition space-y-3"
              >
                {/* Part Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {mat.partName ? `${mat.partName} - Heat #${mat.bodyHeatNo || "Pending"}` : `Part / Heat Row #${index + 1}`}
                    </span>
                    {activeSpec && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF2D01] border border-orange-200/60 font-mono">
                        Spec: {activeSpec.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicateMaterialItem(index)}
                      title="Duplicate this material row"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {materialItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterialItem(index)}
                        title="Delete this material row"
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Part Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      PART NAME
                    </label>
                    <input
                      type="text"
                      value={mat.partName || ""}
                      onChange={(e) =>
                        handleMaterialItemChange(index, "partName", e.target.value)
                      }
                      placeholder="e.g. BODY / DISC / SHAFT"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      BODY HEAT NO.
                    </label>
                    <input
                      type="text"
                      value={mat.bodyHeatNo || ""}
                      onChange={(e) =>
                        handleMaterialItemChange(index, "bodyHeatNo", e.target.value)
                      }
                      placeholder="e.g. H-5120"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold text-orange-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={mat.qty || ""}
                      onChange={(e) =>
                        handleMaterialItemChange(index, "qty", e.target.value)
                      }
                      placeholder="1"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        MATERIAL GRADE
                      </label>
                      {activeSpec && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {activeSpec.name}
                        </span>
                      )}
                    </div>
                    <select
                      value={
                        ALL_PRESET_MATERIALS.includes(mat.material)
                          ? mat.material
                          : mat.material
                          ? "__custom__"
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "__custom__") {
                          setCustomMaterialRows((prev) => ({ ...prev, [rowKey]: true }));
                        } else {
                          setCustomMaterialRows((prev) => ({ ...prev, [rowKey]: false }));
                          handleMaterialItemChange(index, "material", val);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold cursor-pointer"
                    >
                      <option value="">-- Select Material --</option>
                      <optgroup label="Standard Grades (from meterial.json)">
                        {STANDARD_GRADE_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="ASTM Specification Grades">
                        {ASTM_PRESET_MATERIALS.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </optgroup>
                      <option value="__custom__">Custom / Enter manually...</option>
                    </select>

                    {isCustom && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={mat.material || ""}
                          onChange={(e) =>
                            handleMaterialItemChange(index, "material", e.target.value)
                          }
                          placeholder="Type custom grade..."
                          className="w-full px-2 py-1 text-xs rounded-lg border border-orange-300 bg-orange-50/20 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none uppercase font-semibold"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomMaterialRows((prev) => ({ ...prev, [rowKey]: false }));
                            handleMaterialItemChange(index, "material", "WCB");
                          }}
                          className="text-[10px] text-slate-500 hover:text-slate-800 underline whitespace-nowrap"
                          title="Reset to standard grade"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chemical composition inputs */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FlaskConical className="w-3 h-3 text-orange-500" />
                      <span>Chemical Composition %</span>
                    </div>
                    {activeSpec && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        Reference limits: <strong className="text-slate-800 font-bold font-mono">{activeSpec.name}</strong>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-13 gap-1.5 text-xs">
                    {[
                      { key: "c" as const, label: "C" },
                      { key: "si" as const, label: "Si" },
                      { key: "mn" as const, label: "Mn" },
                      { key: "p" as const, label: "P" },
                      { key: "s" as const, label: "S" },
                      { key: "cr" as const, label: "Cr" },
                      { key: "mo" as const, label: "Mo" },
                      { key: "ni" as const, label: "Ni" },
                      { key: "cu" as const, label: "Cu" },
                      { key: "v" as const, label: "V" },
                      { key: "other1" as const, label: "Oth 1" },
                      { key: "other2" as const, label: "Oth 2" },
                      { key: "ce" as const, label: "CE" },
                    ].map(({ key, label }) => {
                      const refVal = getChemicalReference(activeSpec, key);
                      return (
                        <div key={key}>
                          <label
                            className="min-h-[24px] flex flex-col justify-end items-center text-center text-[9px] font-bold text-slate-600 mb-0.5 leading-tight"
                            title={refVal ? `${label} (${refVal})` : label}
                          >
                            <span>
                              {label}
                              {refVal && (
                                <span className="text-[#FF2D01] font-semibold text-[8px] ml-0.5">
                                  ({refVal})
                                </span>
                              )}
                            </span>
                          </label>
                          <input
                            type="text"
                            value={mat[key] || ""}
                            onChange={(e) =>
                              handleMaterialItemChange(index, key, e.target.value)
                            }
                            placeholder="-"
                            className="w-full px-1.5 py-1 text-center font-mono text-[11px] rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mechanical properties inputs */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-orange-500" />
                      <span>Mechanical Properties</span>
                    </div>
                    {activeSpec && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        Reference limits: <strong className="text-slate-800 font-bold font-mono">{activeSpec.name}</strong>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                    <div>
                      <label
                        className="block text-[9.5px] font-bold text-slate-600 mb-0.5"
                        title={tsRef ? `T.S (MPa) (${tsRef})` : "T.S (MPa)"}
                      >
                        <span>T.S (MPa)</span>
                        {tsRef && (
                          <span className="text-[#FF2D01] font-semibold text-[8.5px] ml-1">
                            ({tsRef})
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={mat.tsMpa || ""}
                        onChange={(e) =>
                          handleMaterialItemChange(index, "tsMpa", e.target.value)
                        }
                        placeholder="510"
                        className="w-full px-2 py-1 font-mono rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[9.5px] font-bold text-slate-600 mb-0.5"
                        title={ysRef ? `Y.S (MPa) (${ysRef})` : "Y.S (MPa)"}
                      >
                        <span>Y.S (MPa)</span>
                        {ysRef && (
                          <span className="text-[#FF2D01] font-semibold text-[8.5px] ml-1">
                            ({ysRef})
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={mat.ysMpa || ""}
                        onChange={(e) =>
                          handleMaterialItemChange(index, "ysMpa", e.target.value)
                        }
                        placeholder="285"
                        className="w-full px-2 py-1 font-mono rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[9.5px] font-bold text-slate-600 mb-0.5"
                        title={elRef ? `E.L (%) (${elRef})` : "E.L (%)"}
                      >
                        <span>E.L (%)</span>
                        {elRef && (
                          <span className="text-[#FF2D01] font-semibold text-[8.5px] ml-1">
                            ({elRef})
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={mat.elPercent || ""}
                        onChange={(e) =>
                          handleMaterialItemChange(index, "elPercent", e.target.value)
                        }
                        placeholder="24"
                        className="w-full px-2 py-1 font-mono rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[9.5px] font-bold text-slate-600 mb-0.5"
                        title={raRef ? `RA Ψ (%) (${raRef})` : "RA Ψ (%)"}
                      >
                        <span>RA Ψ (%)</span>
                        {raRef && (
                          <span className="text-[#FF2D01] font-semibold text-[8.5px] ml-1">
                            ({raRef})
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={mat.raPsi || ""}
                        onChange={(e) =>
                          handleMaterialItemChange(index, "raPsi", e.target.value)
                        }
                        placeholder="42"
                        className="w-full px-2 py-1 font-mono rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[9.5px] font-bold text-slate-600 mb-0.5"
                        title={hardnRef ? `Hardness HB (${hardnRef})` : "Hardness HB"}
                      >
                        <span>Hardness HB</span>
                        {hardnRef && (
                          <span className="text-[#FF2D01] font-semibold text-[8.5px] ml-1">
                            ({hardnRef})
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={mat.hardn || ""}
                        onChange={(e) =>
                          handleMaterialItemChange(index, "hardn", e.target.value)
                        }
                        placeholder="152"
                        className="w-full px-2 py-1 font-mono rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[9.5px] font-bold text-slate-600 mb-0.5"
                        title={impactRef ? `Impact Temp. AKV(J) (${impactRef})` : "Impact Temp. AKV(J)"}
                      >
                        <span>Impact Temp. AKV(J)</span>
                        {impactRef && (
                          <span className="text-[#FF2D01] font-semibold text-[8.5px] ml-1">
                            ({impactRef})
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={mat.impactTestTemp || ""}
                        onChange={(e) =>
                          handleMaterialItemChange(index, "impactTestTemp", e.target.value)
                        }
                        placeholder="-"
                        className="w-full px-2 py-1 font-mono rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#FF2D01] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
            })}

            {/* Bottom Add button */}
            <button
              type="button"
              onClick={handleAddMaterialItem}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-slate-800 hover:text-slate-800 rounded-2xl text-xs font-bold text-slate-500 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Material / Heat Number Row</span>
            </button>
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
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF2D01] flex items-center justify-center font-bold text-xs">
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
