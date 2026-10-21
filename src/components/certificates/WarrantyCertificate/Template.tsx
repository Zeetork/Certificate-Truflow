"use client";

import React from "react";
import {
  WarrantyCertificateData,
  WarrantyCertificateItem,
} from "@/types/certificate";
import { formatDisplayDate } from "@/lib/certificateDefaults";

interface WarrantyCertificateTemplateProps {
  data: WarrantyCertificateData;
  certificateNumber?: string;
  revision?: number;
  status?: string;
}

export const WarrantyCertificateTemplate: React.FC<WarrantyCertificateTemplateProps> = ({
  data,
  certificateNumber,
  revision = 0,
  status,
}) => {
  const currentStatus = (status || data.status || "DRAFT").toUpperCase();
  const isDraft = currentStatus === "DRAFT" || !currentStatus;
  const isApproved = currentStatus === "APPROVED";

  const certNo = certificateNumber || data.certificateNumber || "DRAFT";
  const showSignatures = data.showSignatures !== false && (!isDraft || isApproved);
  const showStamp = data.showStamp !== false;

  const poDateFormatted = data.poDate ? formatDisplayDate(data.poDate) : "";
  const certDateFormatted = data.date ? formatDisplayDate(data.date) : "";

  // Line items if provided
  const lineItems: WarrantyCertificateItem[] = data.lineItems || [];
  const hasMultipleLineItems = lineItems.length > 1;

  const signatoryName = data.signatoryName || data.witnessedBy || "Elavarasan.K";
  const signatoryDesignation = data.signatoryDesignation || "Authorized Signatory";
  const signatoryCompany = data.signatoryCompany || "Truflow Solutions Pvt Ltd";
  const signatureUrl =
    data.witnessSignatureUrl || "/signature/truflow-signature.png";
  const stampUrl = data.sealStampUrl || "/signature/truflow-seal-stamp.png";

  return (
    <div
      id="certificate-a4-document"
      data-certificate-page="1"
      data-orientation="portrait"
      className="certificate-a4-page bg-white mx-auto print:m-0 print:p-0 box-border text-black select-text shadow-sm"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "20px 24px",
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      }}
    >
      {/* Outer border container enclosing the entire certificate from top to bottom (recovering borders below) */}
      <div className="w-full h-full border-2 border-black flex flex-col p-0 box-border bg-white text-[11px] leading-normal min-h-[1075px] justify-between">
        {/* ========================================================================= */}
        {/* TOP SECTION: HEADER + METADATA TABLE + BODY CONTENT                      */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col">
          {/* 1. HEADER (WARRANTY CERTIFICATE TITLE + TRUFLOW LOGO) */}
          <div className="relative border-b-2 border-black px-6 py-4 flex items-center justify-between min-h-[64px] bg-white">
            <h1 className="text-xl sm:text-[22px] font-black tracking-wider uppercase text-black text-center flex-1 pl-12">
              WARRANTY CERTIFICATE
            </h1>
            <div className="flex items-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/truflow-logo.png"
                alt="TRUFLOW"
                className="h-9 w-auto object-contain"
              />
            </div>
          </div>

          {/* 2. ORDER & CERTIFICATE METADATA TABLE */}
          <table className="w-full table-fixed border-collapse border-b-2 border-black text-[11px]">
            <colgroup>
              <col style={{ width: "42%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "34%" }} />
            </colgroup>
            <tbody>
              {/* Row 1: Customer Name | SO no | Cus PO */}
              <tr className="border-b border-black">
                <td className="p-2.5 border-r border-black align-middle">
                  <span className="font-bold uppercase tracking-wide text-black">
                    Customer Name :{" "}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {data.customerName || "-"}
                  </span>
                </td>
                <td className="p-2.5 border-r border-black align-middle">
                  <span className="font-bold uppercase tracking-wide text-black">
                    SO no:{" "}
                  </span>
                  <span className="font-semibold font-mono text-slate-900">
                    {data.salesOrderNo || "-"}
                  </span>
                </td>
                <td className="p-2.5 align-middle">
                  <span className="font-bold uppercase tracking-wide text-black">
                    Cus PO:{" "}
                  </span>
                  <span className="font-semibold font-mono text-slate-900">
                    {data.customerPO || "-"}
                  </span>
                  {poDateFormatted && (
                    <span className="font-semibold text-slate-900 ml-1">
                      DT-{poDateFormatted}
                    </span>
                  )}
                </td>
              </tr>

              {/* Row 2: CERTIFICATE NO | Date & Location */}
              <tr>
                <td className="p-2.5 border-r border-black align-middle">
                  <span className="font-bold uppercase tracking-wide text-black">
                    CERTIFICATE NO:{" "}
                  </span>
                  <span className="font-bold font-mono text-slate-900">
                    {certNo}
                    {revision > 0 ? ` (Rev ${revision})` : ""}
                  </span>
                </td>
                <td colSpan={2} className="p-2.5 align-middle">
                  <span className="font-bold uppercase tracking-wide text-black">
                    Date :{" "}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {certDateFormatted || "-"} & {data.place || "Coimbatore"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 3. MAIN INNER BOX: PRODUCT DESCRIPTION & WARRANTY TERMS */}
          <div className="p-4 sm:p-5">
            <div className="p-4 sm:p-5 bg-white space-y-4">
              {/* Product Description */}
              <div>
                <div className="font-bold text-[12px] text-black uppercase tracking-wide mb-1.5">
                  Product Description:
                </div>
                {hasMultipleLineItems ? (
                  <table className="w-full border-collapse border border-black text-[10.5px] mt-2 mb-1">
                    <thead>
                      <tr className="bg-slate-100 border-b border-black text-black font-bold">
                        <th className="p-1.5 border-r border-black text-center w-12">
                          S.No
                        </th>
                        <th className="p-1.5 border-r border-black text-left">
                          Description
                        </th>
                        <th className="p-1.5 border-r border-black text-center w-20">
                          Size
                        </th>
                        <th className="p-1.5 border-r border-black text-center w-20">
                          Qty
                        </th>
                        <th className="p-1.5 text-left w-28">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          className="border-b border-slate-300 last:border-b-0"
                        >
                          <td className="p-1.5 border-r border-black text-center font-mono">
                            {item.sNo || idx + 1}
                          </td>
                          <td className="p-1.5 border-r border-black font-medium">
                            {item.description}
                          </td>
                          <td className="p-1.5 border-r border-black text-center font-mono">
                            {item.size || "-"}
                          </td>
                          <td className="p-1.5 border-r border-black text-center font-mono font-bold">
                            {item.quantity || "1 No's"}
                          </td>
                          <td className="p-1.5 text-slate-600">
                            {item.remarks || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-[11.5px] font-medium text-slate-900 pl-2 py-0.5">
                    {data.productDescription ||
                      (lineItems[0]?.description
                        ? `${lineItems[0].sNo || 1}. ${lineItems[0].description} - ${lineItems[0].quantity || "1 No's"}`
                        : "1. Gate Valve - 6\" 1no's")}
                  </div>
                )}
              </div>

              {/* Salutation */}
              <div className="text-[11.5px] font-semibold text-black pt-1">
                {data.salutation || "To whom so here it may concern,"}
              </div>

              {/* Paragraph 1: Confirmation of PO */}
              <p className="text-[11px] leading-relaxed text-black text-justify indent-6">
                {data.poConfirmationText ? (
                  data.poConfirmationText
                ) : (
                  <>
                    We hereby confirm that the supplied items are in accordance
                    with Purchase Order No.{" "}
                    <span className="font-bold">
                      {data.customerPO || "PO00900"}
                    </span>
                    {poDateFormatted && (
                      <>
                        , dated{" "}
                        <span className="font-bold">{poDateFormatted}</span>
                      </>
                    )}
                    .
                  </>
                )}
              </p>

              {/* Paragraph 2: Manufacturing & Warranty Period Terms */}
              <p className="text-[11px] leading-relaxed text-black text-justify indent-6">
                {data.warrantyTermsText || (
                  <>
                    The products supplied under the above-mentioned Purchase
                    Order are manufactured to the highest standards and in
                    accordance with the specified requirements. We confirm that
                    the products carry a standard warranty period of{" "}
                    <span className="font-bold">
                      {data.warrantyPeriodSupply ||
                        "18 months from the date of invoice"}
                    </span>{" "}
                    or{" "}
                    <span className="font-bold">
                      {data.warrantyPeriodInstallation ||
                        "12 months from the date of installation"}
                    </span>
                    , whichever is earlier.
                  </>
                )}
              </p>

              {/* Warranty Exclusions / Notes */}
              <div className="text-[10.5px] leading-relaxed text-black text-justify pt-1 indent-6">
                <span className="font-bold">Note: </span>
                {data.warrantyNoteText
                  ? data.warrantyNoteText.replace(/^Note:\s*/i, "")
                  : "The warranty is applicable only to manufacturing defects and does not cover normal wear and tear, improper usage, mishandling, or damage caused by improper installation or maintenance."}
              </div>

              {/* Closing sentence */}
              {data.closingText && (
                <p className="text-[10.5px] leading-relaxed text-slate-800 text-justify pt-0.5">
                  {data.closingText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: CONFIRMATION + SIGNATORY + RECOVERED ENCLOSED FOOTER      */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col mt-auto">
          {/* 4. QUALITY CONFIRMATION DECLARATION BANNER */}
          <div className="w-full border-t border-b border-black py-2.5 px-6 text-center bg-white">
            <p className="font-bold text-[11px] text-black tracking-wide leading-snug">
              {data.coverageDeclaration ||
                "This certificate confirms warranty coverage in accordance with standard TruFlow quality management and customer warranty provisions."}
            </p>
          </div>

          {/* 5. SIGNATORY SECTION */}
          <div className="w-full px-8 py-5 flex flex-col justify-between min-h-[140px] bg-white">
            <div className="text-[11.5px] font-semibold text-black">
              Yours sincerely,
            </div>

            {/* Stamp & Signature area */}
            <div className="relative mt-2 min-h-[70px] flex items-end">
              {/* Stamp and signature visuals */}
              {showSignatures && (
                <div className="absolute left-0 bottom-2 flex items-center gap-3 pointer-events-none">
                  {/* Seal Stamp */}
                  {showStamp && stampUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={stampUrl}
                      alt="Truflow Seal Stamp"
                      className="h-16 w-16 object-contain opacity-95"
                    />
                  )}

                  {/* Digital Signature */}
                  {signatureUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={signatureUrl}
                      alt="Signatory Signature"
                      className="h-12 w-auto object-contain -ml-4 mix-blend-multiply"
                    />
                  )}
                </div>
              )}

              {/* Dotted underline and name block */}
              <div className="space-y-1">
                <div className="text-slate-400 font-mono tracking-widest text-xs select-none">
                  ...............................................
                </div>
                <div className="font-bold text-[12px] uppercase tracking-wider text-black">
                  {signatoryName}
                </div>
                <div className="text-[10px] font-medium text-slate-700">
                  {signatoryCompany}
                </div>
              </div>
            </div>
          </div>

          {/* 6. RECOVERED COMPANY FOOTER (Fully enclosed inside the bottom border) */}
          <div className="w-full border-t-2 border-black px-6 py-3 text-center bg-white">
            <div className="font-bold uppercase text-[11px] tracking-wider text-black">
              {data.companyName || "TRUFLOW SOLUTIONS PRIVATE LIMITED"}
            </div>
            <div className="text-[9.5px] text-black mt-0.5 leading-tight">
              {data.companyAddress ||
                "S.F. No-617/2H2, Vadakku Thottam, L&T Road, Malumichampatti, Coimbatore-641 021, Tamil Nadu, India."}
            </div>
            <div className="text-[9px] text-black mt-1 font-medium leading-tight">
              <span>{data.companyWebsite || "www.truflow.com"}</span>
              <span className="mx-2">|</span>
              <span>
                Email: {data.companyEmail || "sales@truflow.com"}
              </span>
              <span className="mx-2">|</span>
              <span>
                GST No: {data.gstNo || "33AAJCR6720N1Z1"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
