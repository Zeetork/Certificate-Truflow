"use client";

import React, { useState } from "react";
import {
  ValveFunctionalTestCertificateData,
  ValveFunctionalTestLineItem,
} from "@/types/certificate";
import {
  FileText,
  Settings,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ClipboardPaste,
  ArrowDownToLine,
  Layers,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { SignatorySelector } from "../common/SignatorySelector";

interface ValveFunctionalTestFormProps {
  data: ValveFunctionalTestCertificateData;
  onChange: (newData: ValveFunctionalTestCertificateData) => void;
  errors?: Record<string, string>;
  onSaveDraft?: () => void;
  onSubmitForApproval?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  submitLabel?: string;
  onSwitchToPreview?: () => void;
}

let itemIdCounter = 0;
function generateUniqueItemId(): string {
  itemIdCounter += 1;
  return `vft-${Date.now()}-${itemIdCounter}`;
}

const DEFAULT_LINE_ITEM: ValveFunctionalTestLineItem = {
  sNo: 1,
  tagNo: "1",
  valveType: "Ball Valve",
  valveSize: "20",
  moc: "WCB Body ss316/PTF",
  endConnection: "Flanged",
  actType: "pneumatic actuator",
  model: "ZRC20SA",
  failPosition: "Fail Close / Fail Open",
  hasLsb: false,
  lsbModelNo: "NA",
  lsbFunction: "Pass/ Fail",
  hasSov: false,
  sovModelNo: "NA",
  sovFunction: "Pass/ Fail",
  hasPositioner: false,
  posinier: "NA",
  poFunction: "Pass/ Fail",
  hasAfr: false,
  afrModelNo: "NA",
  afrFunction: "Pass/ Fail",
  stroke1Open: "0.3 sec",
  stroke1Close: "0.3 sec",
  stroke2Open: "0.3 sec",
  stroke2Close: "0.3 sec",
  stroke3Open: "0.3 sec",
  stroke3Close: "0.3 sec",
  valveFunction: "Pass/ Fail",
};

export const ValveFunctionalTestForm: React.FC<ValveFunctionalTestFormProps> = ({
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
    commonInfo: true,
    lineItems: true,
    signatories: true,
  });

  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCommonChange = <K extends keyof ValveFunctionalTestCertificateData>(
    field: K,
    value: ValveFunctionalTestCertificateData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  // Ensure lineItems array is initialized
  const lineItems: ValveFunctionalTestLineItem[] =
    data.lineItems && data.lineItems.length > 0
      ? data.lineItems
      : [
          {
            ...DEFAULT_LINE_ITEM,
            id: generateUniqueItemId(),
          },
        ];

  const updateLineItems = (newItems: ValveFunctionalTestLineItem[]) => {
    const reindexed = newItems.map((item, idx) => ({
      ...item,
      sNo: idx + 1,
    }));
    onChange({ ...data, lineItems: reindexed });
  };

  // Add rows helper
  const handleAddRows = (count: number) => {
    const baseItem = lineItems[lineItems.length - 1] || DEFAULT_LINE_ITEM;
    const newItems: ValveFunctionalTestLineItem[] = [];
    for (let i = 0; i < count; i++) {
      const nextIndex = lineItems.length + i + 1;
      newItems.push({
        ...baseItem,
        id: generateUniqueItemId(),
        sNo: nextIndex,
        tagNo: String(nextIndex),
      });
    }
    updateLineItems([...lineItems, ...newItems]);
  };

  // Duplicate specific row
  const handleDuplicateRow = (index: number) => {
    const source = lineItems[index];
    const duplicated: ValveFunctionalTestLineItem = {
      ...source,
      id: generateUniqueItemId(),
      sNo: lineItems.length + 1,
      tagNo: `${source.tagNo}-COPY`,
    };
    const updated = [...lineItems];
    updated.splice(index + 1, 0, duplicated);
    updateLineItems(updated);
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    if (lineItems.length <= 1) return;
    const updated = lineItems.filter((_, idx) => idx !== index);
    updateLineItems(updated);
  };

  // Change individual field in row
  const handleItemFieldChange = (
    index: number,
    field: keyof ValveFunctionalTestLineItem,
    value: unknown
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    updateLineItems(updated);
  };

  // Toggle accessory checkbox for a specific row
  const handleToggleRowAccessory = (
    index: number,
    accessory: "hasLsb" | "hasSov" | "hasPositioner" | "hasAfr"
  ) => {
    const updated = [...lineItems];
    const current = updated[index];
    const nextVal = !current[accessory];

    const updates: Partial<ValveFunctionalTestLineItem> = {
      [accessory]: nextVal,
    };

    if (accessory === "hasLsb") {
      if (!nextVal) {
        updates.lsbModelNo = "NA";
        updates.lsbFunction = "Pass/ Fail";
      } else if (current.lsbModelNo === "NA" || !current.lsbModelNo) {
        updates.lsbModelNo = "";
        updates.lsbFunction = "Pass";
      }
    } else if (accessory === "hasSov") {
      if (!nextVal) {
        updates.sovModelNo = "NA";
        updates.sovFunction = "Pass/ Fail";
      } else if (current.sovModelNo === "NA" || !current.sovModelNo) {
        updates.sovModelNo = "";
        updates.sovFunction = "Pass";
      }
    } else if (accessory === "hasPositioner") {
      if (!nextVal) {
        updates.posinier = "NA";
        updates.poFunction = "Pass/ Fail";
      } else if (current.posinier === "NA" || !current.posinier) {
        updates.posinier = "";
        updates.poFunction = "Pass";
      }
    } else if (accessory === "hasAfr") {
      if (!nextVal) {
        updates.afrModelNo = "NA";
        updates.afrFunction = "Pass/ Fail";
      } else if (current.afrModelNo === "NA" || !current.afrModelNo) {
        updates.afrModelNo = "";
        updates.afrFunction = "Pass";
      }
    }

    updated[index] = { ...current, ...updates };
    updateLineItems(updated);
  };

  // Bulk toggle accessory for ALL rows
  const handleBulkToggleAccessory = (
    accessory: "hasLsb" | "hasSov" | "hasPositioner" | "hasAfr",
    enable: boolean
  ) => {
    const updated = lineItems.map((item) => {
      const updates: Partial<ValveFunctionalTestLineItem> = {
        [accessory]: enable,
      };
      if (accessory === "hasLsb") {
        if (!enable) {
          updates.lsbModelNo = "NA";
          updates.lsbFunction = "Pass/ Fail";
        } else if (item.lsbModelNo === "NA" || !item.lsbModelNo) {
          updates.lsbModelNo = "";
          updates.lsbFunction = "Pass";
        }
      } else if (accessory === "hasSov") {
        if (!enable) {
          updates.sovModelNo = "NA";
          updates.sovFunction = "Pass/ Fail";
        } else if (item.sovModelNo === "NA" || !item.sovModelNo) {
          updates.sovModelNo = "";
          updates.sovFunction = "Pass";
        }
      } else if (accessory === "hasPositioner") {
        if (!enable) {
          updates.posinier = "NA";
          updates.poFunction = "Pass/ Fail";
        } else if (item.posinier === "NA" || !item.posinier) {
          updates.posinier = "";
          updates.poFunction = "Pass";
        }
      } else if (accessory === "hasAfr") {
        if (!enable) {
          updates.afrModelNo = "NA";
          updates.afrFunction = "Pass/ Fail";
        } else if (item.afrModelNo === "NA" || !item.afrModelNo) {
          updates.afrModelNo = "";
          updates.afrFunction = "Pass";
        }
      }
      return { ...item, ...updates };
    });
    updateLineItems(updated);
  };

  // Copy row 1 values to all other rows
  const handleCopyRow1ToAll = () => {
    if (lineItems.length <= 1) return;
    const row1 = lineItems[0];
    const updated = lineItems.map((item, idx) => {
      if (idx === 0) return item;
      return {
        ...item,
        valveType: row1.valveType,
        valveSize: row1.valveSize,
        moc: row1.moc,
        endConnection: row1.endConnection,
        actType: row1.actType,
        model: row1.model,
        failPosition: row1.failPosition,
        hasLsb: row1.hasLsb,
        lsbModelNo: row1.lsbModelNo,
        lsbFunction: row1.lsbFunction,
        hasSov: row1.hasSov,
        sovModelNo: row1.sovModelNo,
        sovFunction: row1.sovFunction,
        hasPositioner: row1.hasPositioner,
        posinier: row1.posinier,
        poFunction: row1.poFunction,
        hasAfr: row1.hasAfr,
        afrModelNo: row1.afrModelNo,
        afrFunction: row1.afrFunction,
        stroke1Open: row1.stroke1Open,
        stroke1Close: row1.stroke1Close,
        stroke2Open: row1.stroke2Open,
        stroke2Close: row1.stroke2Close,
        stroke3Open: row1.stroke3Open,
        stroke3Close: row1.stroke3Close,
        valveFunction: row1.valveFunction,
      };
    });
    updateLineItems(updated);
  };

  // Parse pasted Excel or TSV data
  const handleImportPastedData = () => {
    if (!pasteText.trim()) return;

    const lines = pasteText
      .trim()
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0);

    const parsedItems: ValveFunctionalTestLineItem[] = [];

    lines.forEach((line, i) => {
      const cols = line.split("\t").map((c) => c.trim());
      // Expecting columns in rough order or filling available
      // [Tag, ValveType, ValveSize, MOC, EndConn, ActType, Model, FailPos, LsbModel, SovModel, PoModel, AfrModel]
      const newItem: ValveFunctionalTestLineItem = {
        ...DEFAULT_LINE_ITEM,
        id: generateUniqueItemId(),
        sNo: lineItems.length + i + 1,
        tagNo: cols[0] || String(lineItems.length + i + 1),
        valveType: cols[1] || DEFAULT_LINE_ITEM.valveType,
        valveSize: cols[2] || DEFAULT_LINE_ITEM.valveSize,
        moc: cols[3] || DEFAULT_LINE_ITEM.moc,
        endConnection: cols[4] || DEFAULT_LINE_ITEM.endConnection,
        actType: cols[5] || DEFAULT_LINE_ITEM.actType,
        model: cols[6] || DEFAULT_LINE_ITEM.model,
        failPosition: cols[7] || DEFAULT_LINE_ITEM.failPosition,
        hasLsb: Boolean(cols[8] && cols[8] !== "NA"),
        lsbModelNo: cols[8] || "NA",
        hasSov: Boolean(cols[9] && cols[9] !== "NA"),
        sovModelNo: cols[9] || "NA",
        hasPositioner: Boolean(cols[10] && cols[10] !== "NA"),
        posinier: cols[10] || "NA",
        hasAfr: Boolean(cols[11] && cols[11] !== "NA"),
        afrModelNo: cols[11] || "NA",
      };
      parsedItems.push(newItem);
    });

    if (parsedItems.length > 0) {
      updateLineItems([...lineItems, ...parsedItems]);
      setPasteText("");
      setPasteModalOpen(false);
    }
  };

  // Filtered rows for fast scanning
  const filteredRows = searchTerm.trim()
    ? lineItems.filter(
        (item) =>
          item.tagNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.valveType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : lineItems;

  return (
    <div className="space-y-6 w-full">
      {/* ============================================================== */}
      {/* 1. COMMON HEADER FIELDS CARD (SAME FOR ALL 50-100 ITEMS)       */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("commonInfo")}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 border-b border-slate-200 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF2D01]" />
            <h3 className="font-bold text-slate-900 text-sm">
              1. Common Customer &amp; Test Information
            </h3>
          </div>
          {openSections.commonInfo ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {openSections.commonInfo && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                CUSTOMER NAME :- <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.customerName || ""}
                onChange={(e) => handleCommonChange("customerName", e.target.value)}
                placeholder="Enter customer name..."
                className={`w-full text-xs border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] transition ${
                  errors.customerName ? "border-red-500 bg-red-50/20" : "border-slate-300"
                }`}
              />
              {errors.customerName && (
                <p className="mt-1 text-[11px] text-red-600">{errors.customerName}</p>
              )}
            </div>

            {/* Place of Test */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                PLACE OF TEST
              </label>
              <input
                type="text"
                value={data.placeOfTest || ""}
                onChange={(e) => handleCommonChange("placeOfTest", e.target.value)}
                placeholder="Coimbatore"
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] transition"
              />
            </div>

            {/* Customer PO */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                CUSTOMER PO :-
              </label>
              <input
                type="text"
                value={data.customerPO || ""}
                onChange={(e) => handleCommonChange("customerPO", e.target.value)}
                placeholder="Enter customer PO..."
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] transition"
              />
            </div>

            {/* Date of Test */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                DATE OF TEST :
              </label>
              <input
                type="date"
                value={data.dateOfTest || ""}
                onChange={(e) => handleCommonChange("dateOfTest", e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] transition"
              />
            </div>

            {/* Sales Order No */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                SALES ORDER NO :-
              </label>
              <input
                type="text"
                value={data.salesOrderNo || ""}
                onChange={(e) => handleCommonChange("salesOrderNo", e.target.value)}
                placeholder="e.g. ZIS26270145"
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] transition"
              />
            </div>

            {/* Tested By */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                TESTED BY :
              </label>
              <input
                type="text"
                value={data.testedBy || ""}
                onChange={(e) => handleCommonChange("testedBy", e.target.value)}
                placeholder="SIVAGANESHAN.V.A"
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. EXCEL BULK LINE ITEMS SPREADSHEET TABLE                      */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Controls Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-[#FF2D01]" />
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  2. Valve Line Items Spreadsheet
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF2D01]/10 text-[#FF2D01]">
                  {lineItems.length} {lineItems.length === 1 ? "Line Item" : "Line Items"} ({lineItems.length} Pages PDF)
                </span>
              </div>
            </div>

            {/* Excel Row Insertion Quick Actions */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => handleAddRows(1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
              >
                <span>+1 Row</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddRows(5)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
              >
                <span>+5 Rows</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddRows(10)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
              >
                <span>+10 Rows</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddRows(50)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-black transition shadow-2xs"
              >
                <span>+50 Rows</span>
              </button>
              <button
                type="button"
                onClick={() => setPasteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#FF2D01] text-white hover:bg-[#e02800] transition shadow-xs"
                title="Paste tabular data from Excel"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste from Excel</span>
              </button>
            </div>
          </div>

          {/* Quick Helper Tools Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 text-xs">
            {/* Accessory selection checkboxes for all rows */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Accessories:</span>
              </span>

              {/* LSB */}
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">LSB</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasLsb", true)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 rounded"
                >
                  All ON
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasLsb", false)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded"
                >
                  OFF
                </button>
              </div>

              {/* SOV */}
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">SOV</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasSov", true)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 rounded"
                >
                  All ON
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasSov", false)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded"
                >
                  OFF
                </button>
              </div>

              {/* Positioner */}
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">Positioner</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasPositioner", true)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 rounded"
                >
                  All ON
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasPositioner", false)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded"
                >
                  OFF
                </button>
              </div>

              {/* AFR */}
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">AFR</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasAfr", true)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 rounded"
                >
                  All ON
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => handleBulkToggleAccessory("hasAfr", false)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded"
                >
                  OFF
                </button>
              </div>
            </div>

            {/* Copy Row 1 to all & quick search */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyRow1ToAll}
                className="inline-flex items-center gap-1 px-2.5 py-1 font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                title="Copy common valve specifications and timings from row 1 to all rows below"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-blue-600" />
                <span>Fill Down Row 1</span>
              </button>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rows..."
                className="w-36 px-2.5 py-1 text-xs border border-slate-300 bg-white rounded-lg outline-none focus:ring-1 focus:ring-[#FF2D01]"
              />
            </div>
          </div>
        </div>

        {/* Spreadsheet Table with Sticky Header & Smooth Horizontal Scroll */}
        <div className="overflow-x-auto max-h-[650px] overflow-y-auto border-b border-slate-200">
          <table className="w-full min-w-[2100px] border-collapse text-left text-xs bg-white">
            <thead className="sticky top-0 z-20 bg-slate-100 border-b border-slate-300 font-bold text-slate-700 shadow-2xs text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-2.5 border-r border-slate-300 w-12 text-center bg-slate-100">
                  #
                </th>
                <th className="p-2.5 border-r border-slate-300 w-24">Tag No</th>
                <th className="p-2.5 border-r border-slate-300 w-36">Valve Type</th>
                <th className="p-2.5 border-r border-slate-300 w-24">Valve Size</th>
                <th className="p-2.5 border-r border-slate-300 w-44">MOC</th>
                <th className="p-2.5 border-r border-slate-300 w-32">End Connection</th>
                <th className="p-2.5 border-r border-slate-300 w-40">ACT Type</th>
                <th className="p-2.5 border-r border-slate-300 w-32">Model</th>
                <th className="p-2.5 border-r border-slate-300 w-44">Fail Position</th>

                {/* 4 Accessories Columns with Checkbox indicator */}
                <th className="p-2.5 border-r border-slate-300 w-44 bg-blue-50/50">
                  <div className="flex items-center gap-1.5">
                    <span>LSB Model No</span>
                  </div>
                </th>
                <th className="p-2.5 border-r border-slate-300 w-32 bg-blue-50/50">
                  LSB Function
                </th>

                <th className="p-2.5 border-r border-slate-300 w-44 bg-amber-50/50">
                  <div className="flex items-center gap-1.5">
                    <span>SOV Model No</span>
                  </div>
                </th>
                <th className="p-2.5 border-r border-slate-300 w-32 bg-amber-50/50">
                  SOV Function
                </th>

                <th className="p-2.5 border-r border-slate-300 w-44 bg-emerald-50/50">
                  <div className="flex items-center gap-1.5">
                    <span>Positioner</span>
                  </div>
                </th>
                <th className="p-2.5 border-r border-slate-300 w-32 bg-emerald-50/50">
                  Positioner
                </th>

                <th className="p-2.5 border-r border-slate-300 w-44 bg-purple-50/50">
                  <div className="flex items-center gap-1.5">
                    <span>AFR Model No</span>
                  </div>
                </th>
                <th className="p-2.5 border-r border-slate-300 w-32 bg-purple-50/50">
                  AFR Function
                </th>

                {/* Stoke Timings (Open / Close) */}
                <th className="p-2.5 border-r border-slate-300 w-32">Stoke 1 (O / C)</th>
                <th className="p-2.5 border-r border-slate-300 w-32">Stoke 2 (O / C)</th>
                <th className="p-2.5 border-r border-slate-300 w-32">Stoke 3 (O / C)</th>
                <th className="p-2.5 border-r border-slate-300 w-32">Valve Function</th>
                <th className="p-2.5 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRows.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id || index}
                    className={`hover:bg-slate-50/80 transition ${
                      isEven ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    {/* Row Index */}
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-slate-500">
                      {item.sNo}
                    </td>

                    {/* Tag No */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.tagNo || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "tagNo", e.target.value)
                        }
                        placeholder="Tag"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none font-bold"
                      />
                    </td>

                    {/* Valve Type */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.valveType || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "valveType", e.target.value)
                        }
                        placeholder="Ball Valve"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none"
                      />
                    </td>

                    {/* Valve Size */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.valveSize || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "valveSize", e.target.value)
                        }
                        placeholder="20"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none font-medium"
                      />
                    </td>

                    {/* MOC */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.moc || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "moc", e.target.value)
                        }
                        placeholder="WCB Body ss316/PTF"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none"
                      />
                    </td>

                    {/* End Connection */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.endConnection || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "endConnection", e.target.value)
                        }
                        placeholder="Flanged"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none"
                      />
                    </td>

                    {/* ACT Type */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.actType || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "actType", e.target.value)
                        }
                        placeholder="pneumatic actuator"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none"
                      />
                    </td>

                    {/* Model */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.model || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "model", e.target.value)
                        }
                        placeholder="ZRC20SA"
                        className="w-full px-2 py-1 text-xs font-mono font-semibold border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none"
                      />
                    </td>

                    {/* Fail Position */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.failPosition || ""}
                        onChange={(e) =>
                          handleItemFieldChange(index, "failPosition", e.target.value)
                        }
                        placeholder="Fail Close / Fail Open"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none"
                      />
                    </td>

                    {/* LSB (Checkbox + Model No) */}
                    <td className="p-1 border-r border-slate-200 bg-blue-50/20">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={Boolean(item.hasLsb)}
                          onChange={() => handleToggleRowAccessory(index, "hasLsb")}
                          title="Check to include LSB Model No & LSB Function in certificate report"
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          disabled={!item.hasLsb}
                          value={item.hasLsb ? item.lsbModelNo || "" : "NA"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "lsbModelNo", e.target.value)
                          }
                          placeholder="e.g. APL-210N"
                          className={`w-full px-2 py-1 text-xs rounded border outline-none ${
                            item.hasLsb
                              ? "bg-white border-blue-200 focus:border-blue-500"
                              : "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </td>

                    {/* LSB Function */}
                    <td className="p-1 border-r border-slate-200 bg-blue-50/20">
                      {item.hasLsb ? (
                        <input
                          type="text"
                          value={item.lsbFunction || "Pass/ Fail"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "lsbFunction", e.target.value)
                          }
                          placeholder="Pass"
                          className="w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400 italic px-2">
                          Ignored
                        </span>
                      )}
                    </td>

                    {/* SOV (Checkbox + Model No) */}
                    <td className="p-1 border-r border-slate-200 bg-amber-50/20">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={Boolean(item.hasSov)}
                          onChange={() => handleToggleRowAccessory(index, "hasSov")}
                          title="Check to include SOV Model No & SOV Function in certificate report"
                          className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          disabled={!item.hasSov}
                          value={item.hasSov ? item.sovModelNo || "" : "NA"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "sovModelNo", e.target.value)
                          }
                          placeholder="e.g. ZLV310"
                          className={`w-full px-2 py-1 text-xs rounded border outline-none ${
                            item.hasSov
                              ? "bg-white border-amber-200 focus:border-amber-500"
                              : "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </td>

                    {/* SOV Function */}
                    <td className="p-1 border-r border-slate-200 bg-amber-50/20">
                      {item.hasSov ? (
                        <input
                          type="text"
                          value={item.sovFunction || "Pass/ Fail"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "sovFunction", e.target.value)
                          }
                          placeholder="Pass"
                          className="w-full px-2 py-1 text-xs border border-amber-200 rounded bg-white outline-none focus:border-amber-500"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400 italic px-2">
                          Ignored
                        </span>
                      )}
                    </td>

                    {/* Posinier (Checkbox + Model No) */}
                    <td className="p-1 border-r border-slate-200 bg-emerald-50/20">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={Boolean(item.hasPositioner)}
                          onChange={() =>
                            handleToggleRowAccessory(index, "hasPositioner")
                          }
                          title="Check to include Positioner Model & Po Function in certificate report"
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          disabled={!item.hasPositioner}
                          value={item.hasPositioner ? item.posinier || "" : "NA"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "posinier", e.target.value)
                          }
                          placeholder="Positioner Model"
                          className={`w-full px-2 py-1 text-xs rounded border outline-none ${
                            item.hasPositioner
                              ? "bg-white border-emerald-200 focus:border-emerald-500"
                              : "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </td>

                    {/* Po Function */}
                    <td className="p-1 border-r border-slate-200 bg-emerald-50/20">
                      {item.hasPositioner ? (
                        <input
                          type="text"
                          value={item.poFunction || "Pass/ Fail"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "poFunction", e.target.value)
                          }
                          placeholder="Pass"
                          className="w-full px-2 py-1 text-xs border border-emerald-200 rounded bg-white outline-none focus:border-emerald-500"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400 italic px-2">
                          Ignored
                        </span>
                      )}
                    </td>

                    {/* AFR (Checkbox + Model No) */}
                    <td className="p-1 border-r border-slate-200 bg-purple-50/20">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={Boolean(item.hasAfr)}
                          onChange={() => handleToggleRowAccessory(index, "hasAfr")}
                          title="Check to include AFR Model No & AFR Function in certificate report"
                          className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          disabled={!item.hasAfr}
                          value={item.hasAfr ? item.afrModelNo || "" : "NA"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "afrModelNo", e.target.value)
                          }
                          placeholder="e.g. AFR200"
                          className={`w-full px-2 py-1 text-xs rounded border outline-none ${
                            item.hasAfr
                              ? "bg-white border-purple-200 focus:border-purple-500"
                              : "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </td>

                    {/* AFR Function */}
                    <td className="p-1 border-r border-slate-200 bg-purple-50/20">
                      {item.hasAfr ? (
                        <input
                          type="text"
                          value={item.afrFunction || "Pass/ Fail"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "afrFunction", e.target.value)
                          }
                          placeholder="Pass"
                          className="w-full px-2 py-1 text-xs border border-purple-200 rounded bg-white outline-none focus:border-purple-500"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400 italic px-2">
                          Ignored
                        </span>
                      )}
                    </td>

                    {/* Stoke 1 (Open / Close) */}
                    <td className="p-1 border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={item.stroke1Open || "0.3 sec"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "stroke1Open", e.target.value)
                          }
                          placeholder="Open"
                          title="Stoke 1 Open Time"
                          className="w-14 px-1.5 py-1 text-[11px] border border-slate-200 rounded bg-white outline-none text-center"
                        />
                        <span className="text-slate-300">/</span>
                        <input
                          type="text"
                          value={item.stroke1Close || "0.3 sec"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "stroke1Close", e.target.value)
                          }
                          placeholder="Close"
                          title="Stoke 1 Close Time"
                          className="w-14 px-1.5 py-1 text-[11px] border border-slate-200 rounded bg-white outline-none text-center"
                        />
                      </div>
                    </td>

                    {/* Stoke 2 (Open / Close) */}
                    <td className="p-1 border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={item.stroke2Open || "0.3 sec"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "stroke2Open", e.target.value)
                          }
                          placeholder="Open"
                          title="Stoke 2 Open Time"
                          className="w-14 px-1.5 py-1 text-[11px] border border-slate-200 rounded bg-white outline-none text-center"
                        />
                        <span className="text-slate-300">/</span>
                        <input
                          type="text"
                          value={item.stroke2Close || "0.3 sec"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "stroke2Close", e.target.value)
                          }
                          placeholder="Close"
                          title="Stoke 2 Close Time"
                          className="w-14 px-1.5 py-1 text-[11px] border border-slate-200 rounded bg-white outline-none text-center"
                        />
                      </div>
                    </td>

                    {/* Stoke 3 (Open / Close) */}
                    <td className="p-1 border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={item.stroke3Open || "0.3 sec"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "stroke3Open", e.target.value)
                          }
                          placeholder="Open"
                          title="Stoke 3 Open Time"
                          className="w-14 px-1.5 py-1 text-[11px] border border-slate-200 rounded bg-white outline-none text-center"
                        />
                        <span className="text-slate-300">/</span>
                        <input
                          type="text"
                          value={item.stroke3Close || "0.3 sec"}
                          onChange={(e) =>
                            handleItemFieldChange(index, "stroke3Close", e.target.value)
                          }
                          placeholder="Close"
                          title="Stoke 3 Close Time"
                          className="w-14 px-1.5 py-1 text-[11px] border border-slate-200 rounded bg-white outline-none text-center"
                        />
                      </div>
                    </td>

                    {/* Valve Function */}
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.valveFunction || "Pass/ Fail"}
                        onChange={(e) =>
                          handleItemFieldChange(index, "valveFunction", e.target.value)
                        }
                        placeholder="Pass"
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-[#FF2D01] rounded bg-transparent focus:bg-white outline-none font-semibold text-slate-800"
                      />
                    </td>

                    {/* Action buttons */}
                    <td className="p-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateRow(index)}
                          title="Duplicate line item"
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(index)}
                            title="Delete line item"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Bar: Summary & Quick Addition */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Sparkles className="w-4 h-4 text-[#FF2D01]" />
            <span>
              Total <strong>{lineItems.length} line items</strong> entered. Each line item will generate <strong>1 complete A4 report page</strong> in the official certificate PDF.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddRows(1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
            >
              <span>+ Add Next Row</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddRows(10)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#FF2D01] text-white hover:bg-[#e02800] transition shadow-xs"
            >
              <span>+ Add 10 Rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. SIGNATORIES & DECLARATION SECTION                           */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("signatories")}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 border-b border-slate-200 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#FF2D01]" />
            <h3 className="font-bold text-slate-900 text-sm">
              3. Verification Signatories &amp; Certification Declaration
            </h3>
          </div>
          {openSections.signatories ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {openSections.signatories && (
          <div className="p-5 space-y-5 bg-white">
            <SignatorySelector
              witnessedBy={data.witnessedBy}
              verifiedBy={data.verifiedBy}
              witnessSignatureUrl={data.witnessSignatureUrl}
              verifiedSignatureUrl={data.verifiedSignatureUrl}
              onChangeWitnessedBy={(name, sigUrl) => {
                handleCommonChange("witnessedBy", name);
                if (sigUrl !== undefined) {
                  handleCommonChange("witnessSignatureUrl", sigUrl);
                }
              }}
              onChangeVerifiedBy={(name, sigUrl) => {
                handleCommonChange("verifiedBy", name);
                if (sigUrl !== undefined) {
                  handleCommonChange("verifiedSignatureUrl", sigUrl);
                }
              }}
              errors={errors}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Certification Declaration Text
              </label>
              <textarea
                rows={2}
                value={
                  data.declarationText ||
                  "This is to certify that the solenoid valve listed above has been tested and inspected according to the applicable quality standards.\nIt has passed all specified tests and is compliant with the stated performance and safety requirements."
                }
                onChange={(e) =>
                  handleCommonChange("declarationText", e.target.value)
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Company Name (Header / Footer)
                </label>
                <input
                  type="text"
                  value={
                    data.companyName ||
                    "TRUFLOW AUTOMATION & CONTROLS PRIVATE LIMITED"
                  }
                  onChange={(e) =>
                    handleCommonChange("companyName", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Company Address
                </label>
                <input
                  type="text"
                  value={
                    data.companyAddress ||
                    "S.F No. 617/ 2H2, Vadakku Thottam, L&T Road, MALUMICHAMPATTI post, Coimbatore- 641021, Tamil Nadu"
                  }
                  onChange={(e) =>
                    handleCommonChange("companyAddress", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. FORM ACTION BUTTONS                                         */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div>
          {onSwitchToPreview && (
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition shadow-2xs"
            >
              <span>👁️ Document Preview ({lineItems.length} Pages)</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          )}

          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-2xs"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
          )}

          {onSubmitForApproval && (
            <button
              type="button"
              onClick={onSubmitForApproval}
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02700] rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isSaving ? "Processing..." : submitLabel}
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXCEL PASTE MODAL                                              */}
      {/* ============================================================== */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-[#FF2D01]" />
                <h3 className="font-bold text-slate-900 text-base">
                  Paste Data from Microsoft Excel / Google Sheets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Copy your rows from an Excel table and paste them below (tab-separated columns). Column order:
              <br />
              <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-800 inline-block mt-1">
                Tag No | Valve Type | Valve Size | MOC | End Conn | ACT Type | Model | Fail Position | LSB Model | SOV Model | Posinier | AFR Model
              </code>
            </p>

            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste tab-separated rows copied from Excel here..."
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportPastedData}
                disabled={!pasteText.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] rounded-xl shadow-xs disabled:opacity-50"
              >
                Import Rows into Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
