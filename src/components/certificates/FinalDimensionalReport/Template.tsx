"use client";

import React from "react";
import {
  FinalDimensionalReportCertificateData,
  DimensionalReportColumn,
  DimensionalReportRow,
} from "@/types/certificate";
import {
  DEFAULT_FINAL_DIMENSIONAL_COLUMNS,
  formatDisplayDate,
} from "@/lib/certificateDefaults";

interface FinalDimensionalReportTemplateProps {
  data: FinalDimensionalReportCertificateData;
  certificateNumber?: string;
  revision?: number;
  status?: string;
}

export const FinalDimensionalReportTemplate: React.FC<
  FinalDimensionalReportTemplateProps
> = ({ data, certificateNumber, status }) => {
  const currentStatus = (status || data.status || "DRAFT").toUpperCase();
  const isDraft = currentStatus === "DRAFT" || !currentStatus;
  const isApproved = currentStatus === "APPROVED";

  // Signature display rules matching Valve Functional Report:
  // DRAFT: no signatures (dashed lines)
  // PENDING_APPROVAL / REJECTED: Prepared signature only
  // APPROVED: Prepared + Approved signatures
  const preparedSigUrl =
    data.preparedSignatureUrl || data.witnessSignatureUrl;
  const approvedSigUrl =
    data.approvedSignatureUrl || data.verifiedSignatureUrl;

  const showPreparedSignature = !isDraft && Boolean(preparedSigUrl);
  const showApprovedSignature = isApproved && Boolean(approvedSigUrl);

  const certNo = certificateNumber || data.certificateNumber || "DRAFT";

  // Active columns (fallback to default 15 if empty)
  const columns: DimensionalReportColumn[] =
    data.columns && data.columns.length > 0
      ? data.columns
      : DEFAULT_FINAL_DIMENSIONAL_COLUMNS;

  // Active rows
  const rows: DimensionalReportRow[] = data.rows || [];

  // Minimum row count to maintain the proportion of the official template
  const MIN_ROWS = 10;
  const emptyRowsCount = Math.max(0, MIN_ROWS - rows.length);

  return (
    <div
      id="certificate-a4-document"
      data-certificate-page="1"
      data-orientation="landscape"
      className="certificate-a4-page bg-white mx-auto print:m-0 print:p-0 box-border text-black select-text shadow-sm"
      style={{
        width: "1123px",
        minHeight: "794px",
        padding: "16px 20px",
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      }}
    >
      {/* Outer border container */}
      <div className="w-full border-[1.5px] border-black flex flex-col p-0 box-border bg-white text-[10px] leading-tight text-black">
        {/* ========================================================================= */}
        {/* 1. HEADER (FINAL DIMENSIONAL REPORT + TRUFLOW LOGO)                       */}
        {/* ========================================================================= */}
        <div className="relative border-b-[1.5px] border-black px-4 py-2.5 flex items-center justify-center min-h-[56px]">
          <h1 className="text-xl font-black tracking-wider uppercase text-black text-center">
            FINAL DIMENSIONAL REPORT
          </h1>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/truflow-logo.png"
              alt="TRUFLOW"
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ALIGNED METADATA SECTION NEXT TO HEADER                                */}
        {/* ========================================================================= */}
        <div className="w-full border-b-[1.5px] border-black text-[10px]">
          {/* Row 1: Certificate No (Left) | Date (Center) | Approved GAD No (Right) */}
          <div className="grid grid-cols-12 border-b border-black">
            <div className="col-span-5 px-3 py-1.5 border-r border-black flex items-center gap-2">
              <span className="font-bold text-black uppercase tracking-wider whitespace-nowrap text-[9.5px]">
                Certificate No :
              </span>
              <span className="font-bold text-slate-900 font-mono text-[10px]">
                {certNo}
              </span>
            </div>
            <div className="col-span-3 px-3 py-1.5 border-r border-black flex items-center gap-2">
              <span className="font-bold text-black uppercase tracking-wider whitespace-nowrap text-[9.5px]">
                Date :
              </span>
              <span className="font-semibold text-slate-900 text-[10px]">
                {formatDisplayDate(data.date)}
              </span>
            </div>
            <div className="col-span-4 px-3 py-1.5 flex items-center gap-2">
              <span className="font-bold text-black uppercase tracking-wider whitespace-nowrap text-[9.5px]">
                Approved GAD No :
              </span>
              <span className="font-semibold text-slate-900 font-mono text-[10px]">
                {data.approvedGadNo || "-"}
              </span>
            </div>
          </div>

          {/* Row 2: Size (Left) | Quantity (Center) | Units notice (Right) */}
          <div className="grid grid-cols-12 border-b border-black">
            <div className="col-span-5 px-3 py-1.5 border-r border-black flex items-center gap-2">
              <span className="font-bold text-black uppercase tracking-wider whitespace-nowrap text-[9.5px]">
                Size :
              </span>
              <span className="font-semibold text-slate-900 text-[10px]">
                {data.size || "-"}
              </span>
            </div>
            <div className="col-span-3 px-3 py-1.5 border-r border-black flex items-center gap-2">
              <span className="font-bold text-black uppercase tracking-wider whitespace-nowrap text-[9.5px]">
                Quantity :
              </span>
              <span className="font-semibold text-slate-900 text-[10px]">
                {data.quantity || "-"}
              </span>
            </div>
            <div className="col-span-4 px-3 py-1.5 flex items-center justify-end font-semibold text-slate-800 text-[9.5px]">
              {data.dimensionUnitText || "All Dimensions are in mm unless otherwise stated"}
            </div>
          </div>

          {/* Row 3: Centered Equipment / Item Description banner */}
          <div className="w-full bg-white text-center py-1.5 px-4 font-black text-[11px] tracking-widest uppercase text-black">
            {data.itemDescription || "Y - STRAINER"}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DIMENSIONAL MEASUREMENT TABLE                                          */}
        {/* ========================================================================= */}
        <div className="w-full flex-1 overflow-x-hidden">
          <table className="w-full border-collapse border-b border-black text-center text-[9px] leading-tight">
            <thead>
              <tr className="bg-white">
                {/* First Column: Valve Serial Number */}
                <th
                  className="border-r border-b border-black p-1.5 font-bold text-black uppercase align-middle bg-white"
                  style={{ width: "95px", minWidth: "85px" }}
                >
                  Valve S.No
                </th>

                {/* Dynamic measurement columns (All WHITE headers) */}
                {columns.map((col, idx) => (
                  <th
                    key={col.id || idx}
                    className="border-r last:border-r-0 border-b border-black p-1 font-bold text-black uppercase align-middle bg-white text-[8.5px] leading-tight"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Inspected measurement rows */}
              {rows.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="border-r border-b border-black p-1.5 font-mono font-medium text-slate-900 text-[9.5px]">
                    {row.valveSerialNo || "-"}
                  </td>
                  {columns.map((col, cIdx) => (
                    <td
                      key={col.id || cIdx}
                      className="border-r last:border-r-0 border-b border-black p-1 text-slate-900 font-mono text-[9.5px]"
                    >
                      {row.values?.[col.id] !== undefined &&
                      row.values?.[col.id] !== ""
                        ? row.values[col.id]
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Blank filler rows to maintain clean official grid proportions */}
              {Array.from({ length: emptyRowsCount }).map((_, fIdx) => (
                <tr key={`fill-${fIdx}`} className="h-[22px]">
                  <td className="border-r border-b border-black p-1 text-transparent">
                    &nbsp;
                  </td>
                  {columns.map((col, cIdx) => (
                    <td
                      key={`fill-c-${cIdx}`}
                      className="border-r last:border-r-0 border-b border-black p-1 text-transparent"
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========================================================================= */}
        {/* 4. CERTIFICATION DECLARATION NOTE                                         */}
        {/* ========================================================================= */}
        <div className="p-2 text-center text-[9px] leading-relaxed border-b border-black text-slate-800 bg-white">
          <p>
            {data.declarationText ||
              "This is to certify that the dimensional inspection of the items listed above has been carried out and found to be in accordance with the approved drawing and specifications."}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 5. SIGNATURE BOXES (MATCHING VALVE FUNCTIONAL REPORT)                     */}
        {/* ========================================================================= */}
        <div className="w-full grid grid-cols-2 border-b border-black">
          {/* Left Signature: PREPARED BY */}
          <div className="p-2 border-r border-black flex flex-col items-center justify-between min-h-[78px]">
            <span className="font-bold text-[9.5px] uppercase tracking-wider text-black">
              PREPARED BY
            </span>
            <div className="h-[38px] w-full flex items-center justify-center my-0.5">
              {showPreparedSignature && preparedSigUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preparedSigUrl}
                  alt="Prepared Signature"
                  className="h-full w-auto object-contain mix-blend-multiply"
                />
              ) : (
                <div className="w-36 border-b border-dashed border-slate-300 my-2" />
              )}
            </div>
            <span className="font-semibold text-[9.5px] text-slate-900">
              {data.preparedBy || data.witnessedBy || "SIVAGANESHAN.V.A"}
            </span>
          </div>

          {/* Right Signature: APPROVED BY */}
          <div className="p-2 flex flex-col items-center justify-between min-h-[78px]">
            <span className="font-bold text-[9.5px] uppercase tracking-wider text-black">
              APPROVED BY
            </span>
            <div className="h-[38px] w-full flex items-center justify-center my-0.5">
              {showApprovedSignature && approvedSigUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={approvedSigUrl}
                  alt="Approved Signature"
                  className="h-full w-auto object-contain mix-blend-multiply"
                />
              ) : (
                <div className="w-36 border-b border-dashed border-slate-300 my-2" />
              )}
            </div>
            <span className="font-semibold text-[9.5px] text-slate-900">
              {data.approvedBy || data.verifiedBy || "KARTHIKEYAN.A"}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. FOOTER: COMPANY NAME & ADDRESS                                         */}
        {/* ========================================================================= */}
        <div className="p-2 text-center bg-white">
          <div className="font-bold text-[10px] uppercase tracking-wide text-black">
            {data.companyName ||
              "TRUFLOW AUTOMATION & CONTROLS PRIVATE LIMITED"}
          </div>
          <div className="text-[8.5px] text-slate-800 mt-0.5 leading-snug">
            {data.companyAddress ||
              "S.F No. 617/ 2H2, Vadakku Thottam, L&T Road, MALUMICHAMPATTI post, Coimbatore- 641021, Tamil Nadu"}
          </div>
        </div>
      </div>
    </div>
  );
};
