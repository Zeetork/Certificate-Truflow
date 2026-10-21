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
  Eye,
  AlertCircle,
} from "lucide-react";

interface SignatoryUser {
  _id: string;
  name: string;
  email: string;
  signature?: string;
  roleName?: string;
}

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

  const [signatories, setSignatories] = useState<SignatoryUser[]>([]);

  useEffect(() => {
    let ignore = false;
    async function loadSignatories() {
      try {
        const res = await fetch("/api/users?status=active");
        if (!res.ok) return;
        const result = await res.json();
        const usersList: SignatoryUser[] = Array.isArray(result)
          ? result
          : result?.data || [];
        if (!ignore && Array.isArray(usersList)) {
          setSignatories(usersList);
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
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold text-blue-700"
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
            {materialItems.map((mat, index) => (
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
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold text-purple-700"
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
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      MATERIAL GRADE
                    </label>
                    <input
                      type="text"
                      value={mat.material || ""}
                      onChange={(e) =>
                        handleMaterialItemChange(index, "material", e.target.value)
                      }
                      placeholder="e.g. ASTM A216 WCB"
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                    />
                  </div>
                </div>

                {/* Chemical composition inputs */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <FlaskConical className="w-3 h-3 text-orange-500" />
                    <span>Chemical Composition %</span>
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
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-[9px] font-bold text-slate-400 text-center mb-0.5">
                          {label}
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
                    ))}
                  </div>
                </div>

                {/* Mechanical properties inputs */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-blue-500" />
                    <span>Mechanical Properties</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">
                        T.S (MPa)
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
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">
                        Y.S (MPa)
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
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">
                        E.L (%)
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
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">
                        RA Ψ (%)
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
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">
                        Hardness HB
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
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">
                        Impact Temp. AKV(J)
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
            ))}

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
                Prepared by, Witnessed by, and Approved by signatories
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
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Prepared By */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                  Prepared By
                </span>
                <select
                  value={data.preparedBy || ""}
                  onChange={(e) => {
                    const selected = signatories.find((s) => s.name === e.target.value);
                    onChange({
                      ...data,
                      preparedBy: e.target.value,
                      preparedSignatureUrl: selected?.signature || data.preparedSignatureUrl,
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="">-- Select or type manually --</option>
                  {signatories.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.roleName || "User"})
                    </option>
                  ))}
                  <option value="SIVAGANESHAN.V.A">SIVAGANESHAN.V.A</option>
                  <option value="Quality Engineer">Quality Engineer</option>
                </select>
                <input
                  type="text"
                  value={data.preparedBy || ""}
                  onChange={(e) => handleFieldChange("preparedBy", e.target.value)}
                  placeholder="Or enter custom name"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* Witnessed By */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                  Witnessed By
                </span>
                <select
                  value={data.witnessedBy || ""}
                  onChange={(e) => {
                    const selected = signatories.find((s) => s.name === e.target.value);
                    onChange({
                      ...data,
                      witnessedBy: e.target.value,
                      witnessSignatureUrl: selected?.signature || data.witnessSignatureUrl,
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="">-- Select or type manually --</option>
                  {signatories.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.roleName || "User"})
                    </option>
                  ))}
                  <option value="KARTHIKEYAN.A">KARTHIKEYAN.A</option>
                  <option value="SIVAGANESHAN.V.A">SIVAGANESHAN.V.A</option>
                </select>
                <input
                  type="text"
                  value={data.witnessedBy || ""}
                  onChange={(e) => handleFieldChange("witnessedBy", e.target.value)}
                  placeholder="Or enter custom name"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* Approved by */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                  Approved by
                </span>
                <select
                  value={data.approvedBy || ""}
                  onChange={(e) => {
                    const selected = signatories.find((s) => s.name === e.target.value);
                    onChange({
                      ...data,
                      approvedBy: e.target.value,
                      approvedSignatureUrl: selected?.signature || data.approvedSignatureUrl,
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="">-- Select or type manually --</option>
                  {signatories.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.roleName || "User"})
                    </option>
                  ))}
                  <option value="System Administrator">System Administrator</option>
                  <option value="KARTHIKEYAN.A">KARTHIKEYAN.A</option>
                </select>
                <input
                  type="text"
                  value={data.approvedBy || ""}
                  onChange={(e) => handleFieldChange("approvedBy", e.target.value)}
                  placeholder="Or enter custom name"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
