"use client";

import React, { useState } from "react";
import {
  WarrantyCertificateData,
  WarrantyCertificateItem,
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
  RotateCcw,
  ShieldCheck,
  Building,
  Eye,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { SignatorySelector } from "../common/SignatorySelector";
import {
  DEFAULT_WARRANTY_CERTIFICATE_DATA,
  SAMPLE_WARRANTY_CERTIFICATE_DATA,
} from "@/lib/certificateDefaults";

interface WarrantyCertificateFormProps {
  data: WarrantyCertificateData;
  onChange: (newData: WarrantyCertificateData) => void;
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
  return `wc-item-${Date.now()}-${itemIdCounter}`;
}

export const WarrantyCertificateForm: React.FC<WarrantyCertificateFormProps> = ({
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
    orderDetails: true,
    productItems: true,
    warrantyTerms: true,
    signatory: true,
    companyFooter: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFieldChange = <K extends keyof WarrantyCertificateData>(
    field: K,
    value: WarrantyCertificateData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  // Line items management
  const lineItems: WarrantyCertificateItem[] = data.lineItems || [
    {
      id: generateUniqueItemId(),
      sNo: 1,
      description: "Gate Valve - 6\"",
      quantity: "1 No's",
      size: "6\"",
      remarks: "Standard Supply",
    },
  ];

  const updateLineItems = (newItems: WarrantyCertificateItem[]) => {
    const reindexed = newItems.map((item, idx) => ({
      ...item,
      sNo: idx + 1,
    }));
    onChange({
      ...data,
      lineItems: reindexed,
      // If single item, keep productDescription synchronized
      productDescription:
        reindexed.length === 1 && reindexed[0].description
          ? `${reindexed[0].sNo}. ${reindexed[0].description} - ${reindexed[0].quantity || "1 No's"}`
          : data.productDescription,
    });
  };

  const handleAddItem = () => {
    const nextItem: WarrantyCertificateItem = {
      id: generateUniqueItemId(),
      sNo: lineItems.length + 1,
      description: "",
      quantity: "1 No's",
      size: "",
      remarks: "",
    };
    updateLineItems([...lineItems, nextItem]);
  };

  const handleDuplicateItem = (index: number) => {
    const target = lineItems[index];
    if (!target) return;
    const duplicated: WarrantyCertificateItem = {
      ...target,
      id: generateUniqueItemId(),
    };
    const updated = [...lineItems];
    updated.splice(index + 1, 0, duplicated);
    updateLineItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length <= 1) {
      // Clear instead of removing last item
      updateLineItems([
        {
          id: generateUniqueItemId(),
          sNo: 1,
          description: "",
          quantity: "1 No's",
          size: "",
          remarks: "",
        },
      ]);
      return;
    }
    const updated = lineItems.filter((_, idx) => idx !== index);
    updateLineItems(updated);
  };

  const handleItemChange = (
    index: number,
    field: keyof WarrantyCertificateItem,
    value: string
  ) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateLineItems(updated);
  };

  const handleLoadSampleData = () => {
    if (
      window.confirm(
        "Load sample data from reference certificate (IL & FS Tamil Nadu Power Company)? Any unsaved edits will be replaced."
      )
    ) {
      onChange({ ...SAMPLE_WARRANTY_CERTIFICATE_DATA });
    }
  };

  const handleResetStandardTerms = () => {
    onChange({
      ...data,
      declarationText: DEFAULT_WARRANTY_CERTIFICATE_DATA.declarationText,
      warrantyTermsText: DEFAULT_WARRANTY_CERTIFICATE_DATA.warrantyTermsText,
      warrantyPeriodSupply: "18 months from the date of supply",
      warrantyPeriodInstallation: "12 months from the date of installation",
      warrantyNoteText: DEFAULT_WARRANTY_CERTIFICATE_DATA.warrantyNoteText,
      closingText: "",
      coverageDeclaration: "",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* TOP ACTION BAR                                                            */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-800">
            Warranty Certificate Editor
          </span>
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition"
            title="Load sample values from reference document"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Sample Data</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToPreview && (
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Preview</span>
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
          )}

          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
          )}

          {onSubmitForApproval && (
            <button
              type="button"
              onClick={onSubmitForApproval}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : submitLabel}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ORDER & CUSTOMER METADATA SECTION                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("orderDetails")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-sm text-slate-800 hover:bg-slate-100/80 transition"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF2D01]" />
            <span>1. Customer & Order Details</span>
          </div>
          {openSections.orderDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openSections.orderDetails && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Customer */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.customerName ?? ""}
                  onChange={(e) =>
                    handleFieldChange("customerName", e.target.value)
                  }
                  placeholder="e.g. ABC Private Limited"
                  className={`w-full text-xs sm:text-sm border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] ${
                    errors.customerName
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Our Sales Order No. */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Our Sales Order No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.salesOrderNo ?? ""}
                  onChange={(e) =>
                    handleFieldChange("salesOrderNo", e.target.value)
                  }
                  placeholder="e.g. 510"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white font-mono"
                />
              </div>

              {/* Customer PO No. */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer PO No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.customerPO ?? ""}
                  onChange={(e) =>
                    handleFieldChange("customerPO", e.target.value)
                  }
                  placeholder="e.g. P000900"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white font-mono"
                />
              </div>

              {/* Product Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Description
                </label>
                <input
                  type="text"
                  value={data.productDescription ?? ""}
                  onChange={(e) =>
                    handleFieldChange("productDescription", e.target.value)
                  }
                  placeholder="e.g. Please refer above Sales Order"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              {/* Customer PO Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer PO Date
                </label>
                <input
                  type="date"
                  value={data.poDate ?? ""}
                  onChange={(e) => handleFieldChange("poDate", e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              {/* Certificate Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Certificate Date
                </label>
                <input
                  type="date"
                  value={data.date ?? data.certificateDate ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({
                      ...data,
                      date: val,
                      certificateDate: val,
                    });
                  }}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              {/* Place / Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Place of Issue
                </label>
                <input
                  type="text"
                  value={data.place ?? ""}
                  onChange={(e) => handleFieldChange("place", e.target.value)}
                  placeholder="e.g. Coimbatore"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. PRODUCT DESCRIPTION & LINE ITEMS                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("productItems")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-sm text-slate-800 hover:bg-slate-100/80 transition"
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#FF2D01]" />
            <span>2. Product Description & Equipment Items</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
              {lineItems.length} {lineItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          {openSections.productItems ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openSections.productItems && (
          <div className="p-5 space-y-4">
            {/* Primary description summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Summary Product Description (Single Line View)
              </label>
              <input
                type="text"
                value={data.productDescription || ""}
                onChange={(e) =>
                  handleFieldChange("productDescription", e.target.value)
                }
                placeholder="e.g. 1. Gate Valve - 6&quot; 1no&#39;s"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This appears in the &ldquo;Product Description:&rdquo; block on
                the certificate. For multiple distinct items, fill out the item
                table below.
              </p>
            </div>

            {/* Itemized table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
              <div className="p-3 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Detailed Line Items Table
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 w-28">Size / Class</th>
                      <th className="py-2.5 px-3 w-24">Quantity</th>
                      <th className="py-2.5 px-3 w-32">Remarks</th>
                      <th className="py-2.5 px-3 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-600">
                          {item.sNo || idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(idx, "description", e.target.value)
                            }
                            placeholder="e.g. Gate Valve - 6&quot;"
                            className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01]"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.size || ""}
                            onChange={(e) =>
                              handleItemChange(idx, "size", e.target.value)
                            }
                            placeholder="e.g. 6&quot; / 150#"
                            className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01]"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.quantity || ""}
                            onChange={(e) =>
                              handleItemChange(idx, "quantity", e.target.value)
                            }
                            placeholder="e.g. 1 No&#39;s"
                            className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01] font-bold"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.remarks || ""}
                            onChange={(e) =>
                              handleItemChange(idx, "remarks", e.target.value)
                            }
                            placeholder="e.g. Tested OK"
                            className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#FF2D01]"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicateItem(idx)}
                              title="Duplicate"
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              title="Delete"
                              className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. WARRANTY TERMS & CONDITIONS                                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("warrantyTerms")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-sm text-slate-800 hover:bg-slate-100/80 transition"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF2D01]" />
            <span>3. Warranty Terms, Coverage & Conditions</span>
          </div>
          {openSections.warrantyTerms ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openSections.warrantyTerms && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-500">
                Customize the warranty certificate wording and coverage duration
              </span>
              <button
                type="button"
                onClick={handleResetStandardTerms}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Standard TruFlow Terms</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Salutation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Salutation
                </label>
                <select
                  value={data.salutation || "Dear Sir,"}
                  onChange={(e) =>
                    handleFieldChange("salutation", e.target.value)
                  }
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white cursor-pointer"
                >
                  <option value="Dear Sir,">Dear Sir,</option>
                  <option value="To whom so here it may concern,">
                    To whom so here it may concern,
                  </option>
                  <option value="To Whom It May Concern,">
                    To Whom It May Concern,
                  </option>
                  <option value="Dear Customer,">Dear Customer,</option>
                </select>
              </div>

              {/* Warranty Period Supply/Invoice */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warranty Period from Supply / Invoice
                </label>
                <input
                  type="text"
                  value={
                    data.warrantyPeriodSupply ||
                    "18 months from the date of invoice"
                  }
                  onChange={(e) =>
                    handleFieldChange("warrantyPeriodSupply", e.target.value)
                  }
                  placeholder="e.g. 18 months from the date of invoice"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              {/* Warranty Period Installation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warranty Period from Installation
                </label>
                <input
                  type="text"
                  value={
                    data.warrantyPeriodInstallation ||
                    "12 months from the date of installation"
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "warrantyPeriodInstallation",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 12 months from the date of installation"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              {/* Quality Coverage Declaration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quality Management Confirmation Banner
                </label>
                <input
                  type="text"
                  value={
                    data.coverageDeclaration ||
                    "This certificate confirms warranty coverage in accordance with standard TruFlow quality management and customer warranty provisions."
                  }
                  onChange={(e) =>
                    handleFieldChange("coverageDeclaration", e.target.value)
                  }
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>
            </div>

            {/* Custom Warranty Paragraph Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Warranty Statement Body Text
              </label>
              <textarea
                rows={3}
                value={
                  data.warrantyTermsText ||
                  DEFAULT_WARRANTY_CERTIFICATE_DATA.warrantyTermsText
                }
                onChange={(e) =>
                  handleFieldChange("warrantyTermsText", e.target.value)
                }
                className="w-full text-xs border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white leading-relaxed"
              />
            </div>

            {/* Warranty Exclusions Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warranty Exclusions Note
              </label>
              <textarea
                rows={2}
                value={
                  data.warrantyNoteText ||
                  DEFAULT_WARRANTY_CERTIFICATE_DATA.warrantyNoteText
                }
                onChange={(e) =>
                  handleFieldChange("warrantyNoteText", e.target.value)
                }
                className="w-full text-xs border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white leading-relaxed"
              />
            </div>

            {/* Closing Sentence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Closing Sentence
              </label>
              <input
                type="text"
                value={
                  data.closingText ||
                  DEFAULT_WARRANTY_CERTIFICATE_DATA.closingText
                }
                onChange={(e) =>
                  handleFieldChange("closingText", e.target.value)
                }
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. SIGNATORY & STAMP SECTION                                              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("signatory")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-sm text-slate-800 hover:bg-slate-100/80 transition"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF2D01]" />
            <span>4. Signatory, Digital Signature & Seal Stamp</span>
          </div>
          {openSections.signatory ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openSections.signatory && (
          <div className="p-5 space-y-5">
            {/* Signatory Selector Component */}
            <SignatorySelector
              isWarranty={true}
              issuedBy={data.signatoryName || data.witnessedBy || "Elavarasan.K"}
              witnessedBy={data.witnessedBy || "Elavarasan.K"}
              witnessSignatureUrl={
                data.witnessSignatureUrl || "/signature/truflow-signature.png"
              }
              onChangeIssuedBy={(name, sigUrl) => {
                onChange({
                  ...data,
                  signatoryName: name,
                  witnessedBy: name,
                  witnessSignatureUrl: sigUrl || data.witnessSignatureUrl,
                });
              }}
              onChangeWitnessedBy={(name, sigUrl) => {
                onChange({
                  ...data,
                  signatoryName: name,
                  witnessedBy: name,
                  witnessSignatureUrl: sigUrl || data.witnessSignatureUrl,
                });
              }}
              onChangeVerifiedBy={() => {}}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              {/* Signatory Designation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={data.signatoryDesignation || "Authorized Signatory"}
                  onChange={(e) =>
                    handleFieldChange("signatoryDesignation", e.target.value)
                  }
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              {/* Signatory Company Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Signatory Company Affiliation
                </label>
                <input
                  type="text"
                  value={data.signatoryCompany || "Truflow Solutions Pvt Ltd"}
                  onChange={(e) =>
                    handleFieldChange("signatoryCompany", e.target.value)
                  }
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>
            </div>

            {/* Stamp & Signature Toggles */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showSignatures !== false}
                  onChange={(e) =>
                    handleFieldChange("showSignatures", e.target.checked)
                  }
                  className="w-4 h-4 text-[#FF2D01] rounded focus:ring-[#FF2D01]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Show Digital Signature & Stamp on Certificate
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showStamp !== false}
                  onChange={(e) =>
                    handleFieldChange("showStamp", e.target.checked)
                  }
                  className="w-4 h-4 text-[#FF2D01] rounded focus:ring-[#FF2D01]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Include Official Truflow Round Seal Stamp
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. COMPANY FOOTER & COMPLIANCE DETAILS                                    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("companyFooter")}
          className="w-full p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-sm text-slate-800 hover:bg-slate-100/80 transition"
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#FF2D01]" />
            <span>5. Company Name, Address & Footer Branding</span>
          </div>
          {openSections.companyFooter ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openSections.companyFooter && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name (Header & Footer)
                </label>
                <input
                  type="text"
                  value={
                    data.companyName || "TRUFLOW SOLUTIONS PRIVATE LIMITED"
                  }
                  onChange={(e) =>
                    handleFieldChange("companyName", e.target.value)
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  value={data.gstNo || "33AAJCR6720N1Z1"}
                  onChange={(e) => handleFieldChange("gstNo", e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={data.companyWebsite || "www.truflow.com"}
                  onChange={(e) =>
                    handleFieldChange("companyWebsite", e.target.value)
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={data.companyEmail || "sales@truflow.com"}
                  onChange={(e) =>
                    handleFieldChange("companyEmail", e.target.value)
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Works Address
                </label>
                <input
                  type="text"
                  value={
                    data.companyAddress ||
                    "S.F. No-617/2H2, Vadakku Thottam, L&T Road, Malumichampatti, Coimbatore-641 021, Tamil Nadu, India."
                  }
                  onChange={(e) =>
                    handleFieldChange("companyAddress", e.target.value)
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF2D01] bg-white"
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
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
        )}

        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
        )}

        {onSubmitForApproval && (
          <button
            type="button"
            onClick={onSubmitForApproval}
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF2D01] hover:bg-[#e02800] rounded-xl shadow-xs transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : submitLabel}
          </button>
        )}
      </div>
    </div>
  );
};
