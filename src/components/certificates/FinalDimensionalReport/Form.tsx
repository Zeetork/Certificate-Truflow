"use client";

import React, { useState } from "react";
import {
  FinalDimensionalReportCertificateData,
  DimensionalReportColumn,
  DimensionalReportRow,
} from "@/types/certificate";
import {
  FileText,
  Sliders,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ClipboardPaste,
  Sparkles,
  HelpCircle,
  Eye,
} from "lucide-react";
import { SignatorySelector } from "../common/SignatorySelector";
import { DEFAULT_FINAL_DIMENSIONAL_COLUMNS } from "@/lib/certificateDefaults";

interface FinalDimensionalReportFormProps {
  data: FinalDimensionalReportCertificateData;
  onChange: (newData: FinalDimensionalReportCertificateData) => void;
  errors?: Record<string, string>;
  onSaveDraft?: () => void;
  onSubmitForApproval?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  submitLabel?: string;
  onSwitchToPreview?: () => void;
}

let rowIdCounter = 0;
function generateRowId(): string {
  rowIdCounter += 1;
  return `fdr-row-${Date.now()}-${rowIdCounter}`;
}

let colIdCounter = 0;
function generateColId(): string {
  colIdCounter += 1;
  return `col-custom-${Date.now()}-${colIdCounter}`;
}

export const FinalDimensionalReportForm: React.FC<
  FinalDimensionalReportFormProps
> = ({
  data,
  onChange,
  errors = {},
  onSaveDraft,
  onSubmitForApproval,
  onCancel,
  isSaving = false,
  submitLabel = "Submit for Approval",
  onSwitchToPreview,
}) => {
  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    general: true,
    headersCrud: true,
    inspection: true,
    signatories: true,
  });

  // Modal for Excel paste
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [excelPasteText, setExcelPasteText] = useState("");

  // New column creation inline state
  const [newColLabel, setNewColLabel] = useState("");
  const [newColReference, setNewColReference] = useState("");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCommonChange = <
    K extends keyof FinalDimensionalReportCertificateData
  >(
    field: K,
    value: FinalDimensionalReportCertificateData[K]
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Safe columns and rows accessors
  const columns: DimensionalReportColumn[] =
    data.columns && data.columns.length > 0
      ? data.columns
      : DEFAULT_FINAL_DIMENSIONAL_COLUMNS;

  const rows: DimensionalReportRow[] = data.rows || [];

  // =========================================================================
  // COLUMN CRUD & REORDER HANDLERS
  // =========================================================================

  const handleAddColumn = () => {
    if (!newColLabel.trim()) return;
    const newCol: DimensionalReportColumn = {
      id: generateColId(),
      label: newColLabel.trim(),
      referenceValue: newColReference.trim() || undefined,
    };
    const updatedCols = [...columns, newCol];
    handleCommonChange("columns", updatedCols);
    setNewColLabel("");
    setNewColReference("");
  };

  const handleUpdateColumn = (
    index: number,
    field: "label" | "referenceValue",
    value: string
  ) => {
    const updatedCols = [...columns];
    updatedCols[index] = {
      ...updatedCols[index],
      [field]: value,
    };
    handleCommonChange("columns", updatedCols);
  };

  const handleDeleteColumn = (index: number) => {
    if (columns.length <= 1) {
      alert("At least one measurement column is required.");
      return;
    }
    const updatedCols = columns.filter((_, idx) => idx !== index);
    handleCommonChange("columns", updatedCols);
  };

  const handleMoveColumn = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= columns.length) return;

    const updatedCols = [...columns];
    const [movedCol] = updatedCols.splice(index, 1);
    updatedCols.splice(targetIndex, 0, movedCol);
    handleCommonChange("columns", updatedCols);
  };

  const handleResetDefaultColumns = () => {
    if (
      window.confirm(
        "Reset columns to the 15 standard dimensional report headers? Any custom columns will be replaced."
      )
    ) {
      handleCommonChange("columns", DEFAULT_FINAL_DIMENSIONAL_COLUMNS);
    }
  };

  // =========================================================================
  // ROW CRUD & DATA HANDLERS
  // =========================================================================

  const updateRows = (newRows: DimensionalReportRow[]) => {
    handleCommonChange("rows", newRows);
  };

  const handleAddRows = (count: number = 1) => {
    const lastRow = rows[rows.length - 1];
    let nextSerial = 2519901001;

    if (lastRow?.valveSerialNo) {
      const parsed = parseInt(lastRow.valveSerialNo, 10);
      if (!isNaN(parsed)) {
        nextSerial = parsed + 1;
      }
    }

    const added: DimensionalReportRow[] = [];
    for (let i = 0; i < count; i++) {
      added.push({
        id: generateRowId(),
        valveSerialNo: String(nextSerial + i),
        values: {},
      });
    }

    updateRows([...rows, ...added]);
  };

  const handleDuplicateRow = (index: number) => {
    const source = rows[index];
    if (!source) return;

    let nextSerial = "";
    const parsed = parseInt(source.valveSerialNo, 10);
    if (!isNaN(parsed)) {
      nextSerial = String(parsed + 1);
    } else {
      nextSerial = source.valveSerialNo ? `${source.valveSerialNo}-copy` : "";
    }

    const duplicated: DimensionalReportRow = {
      id: generateRowId(),
      valveSerialNo: nextSerial,
      values: { ...source.values },
    };

    const newRows = [...rows];
    newRows.splice(index + 1, 0, duplicated);
    updateRows(newRows);
  };

  const handleDeleteRow = (index: number) => {
    const newRows = rows.filter((_, idx) => idx !== index);
    updateRows(newRows);
  };

  const handleRowFieldChange = (
    rowIndex: number,
    field: "valveSerialNo",
    val: string
  ) => {
    const updated = [...rows];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [field]: val,
    };
    updateRows(updated);
  };

  const handleRowColumnValueChange = (
    rowIndex: number,
    colId: string,
    val: string
  ) => {
    const updated = [...rows];
    updated[rowIndex] = {
      ...updated[rowIndex],
      values: {
        ...(updated[rowIndex].values || {}),
        [colId]: val,
      },
    };
    updateRows(updated);
  };

  const handleAutoFillSerialNumbers = () => {
    if (rows.length === 0) return;
    const firstVal = rows[0].valveSerialNo;
    const baseNum = parseInt(firstVal, 10);
    if (isNaN(baseNum)) {
      alert("First Valve S.No must be a numeric value to auto-increment.");
      return;
    }

    const updated = rows.map((r, idx) => ({
      ...r,
      valveSerialNo: String(baseNum + idx),
    }));
    updateRows(updated);
  };

  // Excel paste handler
  const handleProcessExcelPaste = () => {
    if (!excelPasteText.trim()) {
      setPasteModalOpen(false);
      return;
    }

    const lines = excelPasteText.trim().split(/\r?\n/);
    const newRows: DimensionalReportRow[] = [];

    lines.forEach((line) => {
      if (!line.trim()) return;
      const cells = line.split("\t").map((c) => c.trim());
      if (cells.length === 0) return;

      const serial = cells[0] || "";
      const rowValues: Record<string, string> = {};

      columns.forEach((col, cIdx) => {
        // cells[1 + cIdx] corresponds to columns in order
        const cellVal = cells[1 + cIdx];
        if (cellVal !== undefined) {
          rowValues[col.id] = cellVal;
        }
      });

      newRows.push({
        id: generateRowId(),
        valveSerialNo: serial,
        values: rowValues,
      });
    });

    if (newRows.length > 0) {
      updateRows([...rows, ...newRows]);
    }

    setExcelPasteText("");
    setPasteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. REPORT DETAILS & HEADER ALIGNED SECTION                                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection("general")}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 border-b border-slate-200 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#FF2D01]" />
            <h3 className="font-bold text-slate-900 text-sm">
              1. Report &amp; Header Alignment Details
            </h3>
          </div>
          {openSections.general ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {openSections.general && (
          <div className="p-5 space-y-4">
            {/* Customer & Order Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="Customer / Client Name"
                  value={data.customerName || ""}
                  onChange={(e) =>
                    handleCommonChange("customerName", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Sales Order No
                </label>
                <input
                  type="text"
                  placeholder="e.g. 510"
                  value={data.salesOrderNo || ""}
                  onChange={(e) =>
                    handleCommonChange("salesOrderNo", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Customer PO No
                </label>
                <input
                  type="text"
                  placeholder="e.g. PO-89021"
                  value={data.customerPO || ""}
                  onChange={(e) =>
                    handleCommonChange("customerPO", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>
            </div>

            {/* Inspection Date, Approved GAD No & Equipment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Inspection Date
                </label>
                <input
                  type="date"
                  value={data.date || ""}
                  onChange={(e) =>
                    handleCommonChange("date", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Approved GAD No
                </label>
                <input
                  type="text"
                  placeholder="e.g. 113101-TU12-DR-MVA-06201"
                  value={data.approvedGadNo || ""}
                  onChange={(e) =>
                    handleCommonChange("approvedGadNo", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Product / Equipment Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Y - STRAINER"
                  value={data.itemDescription || ""}
                  onChange={(e) =>
                    handleCommonChange("itemDescription", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 uppercase transition"
                />
              </div>
            </div>

            {/* Size, Quantity & Dimension Unit Notice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. DN 32 PN 63"
                  value={data.size || ""}
                  onChange={(e) => handleCommonChange("size", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 No's"
                  value={data.quantity || ""}
                  onChange={(e) =>
                    handleCommonChange("quantity", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Dimension Unit Notice
                </label>
                <input
                  type="text"
                  placeholder="e.g. All Dimensions are - mm"
                  value={data.dimensionUnitText || ""}
                  onChange={(e) =>
                    handleCommonChange("dimensionUnitText", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 transition"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC TABLE HEADERS & REFERENCE CRUD & REORDER                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection("headersCrud")}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 border-b border-slate-200 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#FF2D01]" />
            <div className="text-left">
              <h3 className="font-bold text-slate-900 text-sm">
                2. Configure Table Headers &amp; Drawing References (CRUD &amp; Reorder)
              </h3>
              <p className="text-[11px] text-slate-500">
                Rename, rearrange, add, or delete column headers. Reference tolerances are shown as input placeholders.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF2D01]/10 text-[#FF2D01]">
              {columns.length} Columns
            </span>
            {openSections.headersCrud ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </button>

        {openSections.headersCrud && (
          <div className="p-5 space-y-5">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {/* Add Column Mini-Form */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <input
                  type="text"
                  placeholder="New Column Header (e.g. Wall Thickness)"
                  value={newColLabel}
                  onChange={(e) => setNewColLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColumn();
                    }
                  }}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 bg-white min-w-[200px]"
                />
                <input
                  type="text"
                  placeholder="Reference Tolerance (e.g. 15 ± 0.5)"
                  value={newColReference}
                  onChange={(e) => setNewColReference(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColumn();
                    }
                  }}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 bg-white min-w-[160px]"
                />
                <button
                  type="button"
                  onClick={handleAddColumn}
                  disabled={!newColLabel.trim()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#FF2D01] text-white hover:bg-[#e02800] disabled:opacity-40 transition shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
              </div>

              {/* Reset to 15 standard headers */}
              <button
                type="button"
                onClick={handleResetDefaultColumns}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                title="Reset columns to the 15 standard headers"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset to Default 15 Headers</span>
              </button>
            </div>

            {/* Reorderable Column Headers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {columns.map((col, index) => {
                const isFirst = index === 0;
                const isLast = index === columns.length - 1;

                return (
                  <div
                    key={col.id || index}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-xs transition space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        #{index + 1}
                      </span>
                      {/* Reorder & Delete actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveColumn(index, "left")}
                          disabled={isFirst}
                          title="Move column earlier / left"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 transition"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveColumn(index, "right")}
                          disabled={isLast}
                          title="Move column later / right"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 transition"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(index)}
                          title="Delete column"
                          className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Column Label Input */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                        Header Name
                      </label>
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) =>
                          handleUpdateColumn(index, "label", e.target.value)
                        }
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 bg-white"
                      />
                    </div>

                    {/* Column Reference Value / Placeholder */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                        Reference / Tolerance (Placeholder)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 255 ± 4"
                        value={col.referenceValue || ""}
                        onChange={(e) =>
                          handleUpdateColumn(
                            index,
                            "referenceValue",
                            e.target.value
                          )
                        }
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 bg-slate-50/50"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. INSPECTED VALVES & MEASUREMENTS TABLE                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection("inspection")}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 border-b border-slate-200 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#FF2D01]" />
            <div className="text-left">
              <h3 className="font-bold text-slate-900 text-sm">
                3. Inspected Valve Measurements Data
              </h3>
              <p className="text-[11px] text-slate-500">
                Input measured dimensions for each valve. Placeholders show reference drawing tolerances.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
              {rows.length} Valves
            </span>
            {openSections.inspection ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </button>

        {openSections.inspection && (
          <div className="p-5 space-y-4">
            {/* Quick Helper Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddRows(1)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                >
                  +1 Row
                </button>
                <button
                  type="button"
                  onClick={() => handleAddRows(5)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                >
                  +5 Rows
                </button>
                <button
                  type="button"
                  onClick={() => handleAddRows(10)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-black transition shadow-2xs"
                >
                  +10 Rows
                </button>
                <button
                  type="button"
                  onClick={handleAutoFillSerialNumbers}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  title="Auto-fill sequential serial numbers from row 1"
                >
                  Auto-fill S.No
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPasteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#FF2D01] text-white hover:bg-[#e02800] transition shadow-xs"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste from Excel</span>
                </button>
              </div>
            </div>

            {/* Scrollable Data Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[550px] shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 sticky top-0 z-10 text-[10px] uppercase font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5 border-b border-r border-slate-200 w-12 text-center">
                      #
                    </th>
                    <th className="p-2.5 border-b border-r border-slate-200 min-w-[120px]">
                      Valve S.No
                    </th>
                    {columns.map((col, idx) => (
                      <th
                        key={col.id || idx}
                        className="p-2.5 border-b border-r last:border-r-0 border-slate-200 min-w-[110px] text-center"
                      >
                        <div className="font-bold text-slate-900 leading-tight">
                          {col.label}
                        </div>
                        {col.referenceValue && (
                          <div className="text-[9px] text-[#FF2D01] font-mono mt-0.5 font-normal">
                            Ref: {col.referenceValue}
                          </div>
                        )}
                      </th>
                    ))}
                    <th className="p-2.5 border-b border-slate-200 w-20 text-center sticky right-0 bg-slate-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 3}
                        className="p-8 text-center text-slate-400"
                      >
                        No valve rows added yet. Click &ldquo;+1 Row&rdquo; or &ldquo;Paste from Excel&rdquo; above.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, rIdx) => (
                      <tr
                        key={row.id || rIdx}
                        className="hover:bg-orange-50/20 transition-colors"
                      >
                        <td className="p-2 border-r border-slate-100 text-center font-mono text-slate-400 text-[11px]">
                          {rIdx + 1}
                        </td>
                        <td className="p-2 border-r border-slate-100">
                          <input
                            type="text"
                            placeholder="e.g. 2519901001"
                            value={row.valveSerialNo || ""}
                            onChange={(e) =>
                              handleRowFieldChange(
                                rIdx,
                                "valveSerialNo",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 bg-white"
                          />
                        </td>
                        {columns.map((col) => (
                          <td
                            key={col.id}
                            className="p-2 border-r last:border-r-0 border-slate-100 text-center"
                          >
                            <input
                              type="text"
                              placeholder={col.referenceValue || "-"}
                              value={row.values?.[col.id] || ""}
                              onChange={(e) =>
                                handleRowColumnValueChange(
                                  rIdx,
                                  col.id,
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 bg-white placeholder:text-slate-300 placeholder:font-sans"
                            />
                          </td>
                        ))}
                        <td className="p-2 text-center sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.04)]">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicateRow(rIdx)}
                              title="Duplicate Row"
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(rIdx)}
                              title="Delete Row"
                              className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. VERIFICATION SIGNATORIES & CERTIFICATION DECLARATION                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection("signatories")}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 border-b border-slate-200 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#FF2D01]" />
            <h3 className="font-bold text-slate-900 text-sm">
              4. Verification Signatories &amp; Certification Declaration
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
              witnessedBy={data.preparedBy || data.witnessedBy}
              verifiedBy={data.approvedBy || data.verifiedBy}
              witnessSignatureUrl={
                data.preparedSignatureUrl || data.witnessSignatureUrl
              }
              verifiedSignatureUrl={
                data.approvedSignatureUrl || data.verifiedSignatureUrl
              }
              onChangeWitnessedBy={(name, sigUrl) => {
                handleCommonChange("preparedBy", name);
                handleCommonChange("witnessedBy", name);
                if (sigUrl !== undefined) {
                  handleCommonChange("preparedSignatureUrl", sigUrl);
                  handleCommonChange("witnessSignatureUrl", sigUrl);
                }
              }}
              onChangeVerifiedBy={(name, sigUrl) => {
                handleCommonChange("approvedBy", name);
                handleCommonChange("verifiedBy", name);
                if (sigUrl !== undefined) {
                  handleCommonChange("approvedSignatureUrl", sigUrl);
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
                  "This is to certify that the dimensional inspection of the items listed above has been carried out and found to be in accordance with the approved drawing and specifications."
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
                  Company Name (Footer)
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
                  Company Address (Footer)
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

      {/* ========================================================================= */}
      {/* BOTTOM ACTION BAR (SAVE DRAFT / SUBMIT)                                    */}
      {/* ========================================================================= */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
          )}
          {onSwitchToPreview && (
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Certificate</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition shadow-2xs disabled:opacity-50"
            >
              Save as Draft
            </button>
          )}
          {onSubmitForApproval && (
            <button
              type="button"
              onClick={onSubmitForApproval}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <span>{isSaving ? "Saving..." : submitLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXCEL PASTE MODAL                                                         */}
      {/* ========================================================================= */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-[#FF2D01]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Paste Tabular Rows from Excel
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Copy rows from Excel and paste them here. The first column will be used as <strong>Valve S.No</strong>, followed by columns matching your configured measurement headers.
            </p>

            <textarea
              rows={8}
              value={excelPasteText}
              onChange={(e) => setExcelPasteText(e.target.value)}
              placeholder={`2519901001\t32\t256\t168\t27\t154\t111\t21\t4\t79\t35\t129\t12\t70\t256\t171\n2519901002\t32\t254\t170\t25\t156\t109\t23\t4\t77\t37\t127\t10\t68\t254\t169`}
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D01]/20 bg-slate-50"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessExcelPaste}
                disabled={!excelPasteText.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] rounded-xl shadow-xs disabled:opacity-50"
              >
                Import Rows
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
