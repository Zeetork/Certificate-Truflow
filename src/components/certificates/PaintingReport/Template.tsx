"use client";

import React from "react";
import { PaintingReportCertificateData } from "@/types/certificate";

interface PaintingReportTemplateProps {
  data: PaintingReportCertificateData;
  certificateNumber?: string;
  revision?: number;
  status?: string;
}

export const PaintingReportTemplate: React.FC<PaintingReportTemplateProps> = ({
  data,
  certificateNumber,
  status,
}) => {
  const isApproved = status === "APPROVED";
  const isPendingApproval = status === "PENDING_APPROVAL";

  // Signature visibility logic:
  // - Draft: pending lines
  // - Pending Approval: Prepared signature shown, Reviewed/Approved pending
  // - Approved: All signatures shown + Stamp
  const showPreparedSignature = (isPendingApproval || isApproved) && Boolean(data.preparedSignatureUrl);
  const showReviewedSignature = isApproved && Boolean(data.reviewedSignatureUrl);
  const showApprovedSignature = isApproved && Boolean(data.approvedSignatureUrl);
  const showStamp = isApproved && Boolean(data.sealStampUrl);

  const displayCertNumber = certificateNumber || data.certificateNo || data.reportNo || "DRAFT";
  const displayDate = data.date || new Date().toISOString().split("T")[0];

  const defaultAtmospheric = [
    {
      id: "atm-1",
      dateTime: "15.06.26 @ 10.00 am",
      process: "Blasting",
      dryBulbTemp: "13",
      wetBulbTemp: "6",
      dewPoint: "3",
      rh: "70%",
      steelTemp: "13",
    },
    {
      id: "atm-2",
      dateTime: "15.06.26 @ 02.00 pm",
      process: "Primer",
      dryBulbTemp: "16",
      wetBulbTemp: "5",
      dewPoint: "4",
      rh: "68%",
      steelTemp: "13",
    },
    {
      id: "atm-3",
      dateTime: "16.06.26 @ 10.00 am",
      process: "Midcoat",
      dryBulbTemp: "15",
      wetBulbTemp: "5",
      dewPoint: "3",
      rh: "68%",
      steelTemp: "13",
    },
    {
      id: "atm-4",
      dateTime: "17.06.26 @ 05.30 pm",
      process: "Final",
      dryBulbTemp: "13",
      wetBulbTemp: "6",
      dewPoint: "3",
      rh: "68%",
      steelTemp: "13",
    },
  ];

  const atmosphericRows = Array.isArray(data.atmosphericConditions) && data.atmosphericConditions.length > 0
    ? data.atmosphericConditions
    : defaultAtmospheric;

  const defaultCoats = [
    {
      id: "coat-1",
      coatName: "Primer",
      appliedCoat: "Primer (Barrier 80 S)",
      applicationMethod: "Conventional air spray",
      paintMfgName: "Jotun",
      productName: "Check valve",
      colourShade: "Red",
      dftRequired: "50-60",
      dftObserved: "40-60",
    },
    {
      id: "coat-2",
      coatName: "Mid coat",
      appliedCoat: "Mid coat (Penguard M20)",
      applicationMethod: "Conventional air spray",
      paintMfgName: "Jotun",
      productName: "Check valve",
      colourShade: "Red",
      dftRequired: "70-80",
      dftObserved: "60-80",
    },
    {
      id: "coat-3",
      coatName: "Final",
      appliedCoat: "Final (Hardtop XP)",
      applicationMethod: "Conventional air spray",
      paintMfgName: "Jotun",
      productName: "Check valve",
      colourShade: "Red",
      dftRequired: ">=160",
      dftObserved: "180-280",
    },
  ];

  const coats = Array.isArray(data.coats) && data.coats.length > 0 ? data.coats : defaultCoats;

  return (
    <div className="w-full flex flex-col items-center py-4 bg-slate-100 print:bg-white print:p-0">
      <div
        id="certificate-a4-document"
        className="certificate-a4-page bg-white shadow-2xl print:shadow-none print:m-0 mx-auto text-black flex flex-col box-border print:!p-[10mm]"
        style={{
          width: "210mm",
          height: "297mm",
          minHeight: "297mm",
          maxHeight: "297mm",
          boxSizing: "border-box",
          padding: "10mm",
        }}
      >
        {/* Unified Outer Border Box */}
        <div className="w-full h-full border-[1.5px] border-black flex flex-col box-border bg-white overflow-hidden text-black leading-tight text-[12px]">
          
          {/* 1. TITLE & LOGO HEADER */}
          <div className="relative border-b-[1.5px] border-black px-4 py-2 flex items-center justify-center min-h-[52px] flex-shrink-0 bg-white">
            <h1 className="text-[13.5px] font-bold uppercase tracking-wider text-black leading-tight text-center max-w-[75%]">
              SURFACE PREPARATION &amp; PAINTING INSPECTION REPORT
            </h1>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pr-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/truflow-logo.png"
                alt="Truflow Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>

          {/* MIDDLE CONTENT CONTAINER (FLEX-1 EQUAL DISTRIBUTION) */}
          <div className="flex-1 flex flex-col min-h-0 w-full">

            {/* 2. CUSTOMER & ORDER DETAILS TABLE */}
            <div className="flex-[5] flex flex-col min-h-0">
              <table className="w-full h-full table-fixed border-collapse border-b-[1.5px] border-black text-[11px]">
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "25%" }} />
                </colgroup>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Customer Name:</td>
                    <td className="p-1 px-2.5 border-r border-black font-semibold text-slate-900 truncate">
                      {data.customerName || ""}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">Certificate No:</td>
                    <td className="p-1 px-2.5 font-mono font-bold text-slate-900 truncate">
                      {displayCertNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Customer Po No :</td>
                    <td className="p-1 px-2.5 border-r border-black font-semibold text-slate-900 truncate">
                      {data.customerPO || ""}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">Date :</td>
                    <td className="p-1 px-2.5 text-slate-900 truncate">
                      {displayDate}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Valve Type :</td>
                    <td className="p-1 px-2.5 border-r border-black text-slate-900 truncate">
                      {data.valveType || ""}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">Valve Size :</td>
                    <td className="p-1 px-2.5 text-slate-900 truncate">
                      {data.valveSize || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Colour /Shade:</td>
                    <td className="p-1 px-2.5 border-r border-black font-semibold text-slate-900 truncate">
                      {data.colourShade || "RAL3020 / Red"}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">Tag No. :</td>
                    <td className="p-1 px-2.5 font-mono text-slate-900 truncate">
                      {data.tagNo || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 px-2.5 font-bold border-r border-black">
                      Atmospheric Condition At Work Site :
                    </td>
                    <td className="p-1 px-2.5 border-r border-black text-slate-900 truncate">
                      {data.atmosphericConditionAtWorkSite || "Cleanliness Class 1"}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">QTY :</td>
                    <td className="p-1 px-2.5 font-semibold text-slate-900 truncate">
                      {data.qty || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. ATMOSPHERIC CONDITIONS TABLE */}
            <div style={{ flex: 1 + atmosphericRows.length }} className="flex flex-col min-h-0">
              <table className="w-full h-full table-fixed border-collapse border-b-[1.5px] border-black text-[11px] text-center">
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "13%" }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-black bg-slate-50/50 font-bold text-[11px]">
                    <th className="p-1 border-r border-black">Date &amp; Time</th>
                    <th className="p-1 border-r border-black">Process</th>
                    <th className="p-1 border-r border-black">Dry Bulb Temp(°C)</th>
                    <th className="p-1 border-r border-black">Wet Bulb Temp (°C)</th>
                    <th className="p-1 border-r border-black">Dew Point</th>
                    <th className="p-1 border-r border-black">RH%</th>
                    <th className="p-1">Steel Temp (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  {atmosphericRows.map((row, idx) => (
                    <tr
                      key={row.id || `atm-row-${idx}`}
                      className={idx < atmosphericRows.length - 1 ? "border-b border-black" : ""}
                    >
                      <td className="p-1 px-1.5 border-r border-black font-mono text-slate-900">
                        {row.dateTime}
                      </td>
                      <td className="p-1 px-1.5 border-r border-black font-semibold text-slate-900">
                        {row.process}
                      </td>
                      <td className="p-1 px-1.5 border-r border-black text-slate-900">
                        {row.dryBulbTemp}
                      </td>
                      <td className="p-1 px-1.5 border-r border-black text-slate-900">
                        {row.wetBulbTemp}
                      </td>
                      <td className="p-1 px-1.5 border-r border-black text-slate-900">
                        {row.dewPoint}
                      </td>
                      <td className="p-1 px-1.5 border-r border-black text-slate-900">
                        {row.rh}
                      </td>
                      <td className="p-1 px-1.5 text-slate-900">
                        {row.steelTemp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. SURFACE PREPARATION & CLEANING */}
            <div className="py-1 px-2 text-center font-bold text-[12px] uppercase tracking-wider border-b border-black bg-slate-50/40 flex-shrink-0">
              Surface Preparation &amp; Cleaning
            </div>
            <div className="flex-[3] flex flex-col min-h-0">
              <table className="w-full h-full table-fixed border-collapse border-b-[1.5px] border-black text-[11px]">
                <colgroup>
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "8%" }} />
                </colgroup>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Abrasive Cleaning</td>
                    <td className="p-1 px-2.5 border-r border-black text-slate-900 truncate">
                      {data.abrasiveCleaning || "ISO 8501-1"}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">
                      Abrasive checked for cleanliness
                    </td>
                    <td className="p-1 px-2.5 border-r border-black font-bold text-center text-slate-900">
                      {data.abrasiveCheckedForCleanliness || "YES"}
                    </td>
                    <td className="p-1 px-1.5 font-bold border-r border-black text-center">Dust Level</td>
                    <td className="p-1 px-1.5 font-semibold text-center text-slate-900">
                      {data.dustLevel || "≤1"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Specified Standard</td>
                    <td className="p-1 px-2.5 border-r border-black text-slate-900 truncate">
                      {data.specifiedStandard || "ISO 8501-Sa 21/2"}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">
                      Profile thickness Required :
                    </td>
                    <td colSpan={3} className="p-1 px-2.5 text-slate-900 truncate">
                      {data.profileThicknessRequired || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 px-2.5 font-bold border-r border-black">Surface cleanliness</td>
                    <td className="p-1 px-2.5 border-r border-black text-slate-900 truncate">
                      {data.surfaceCleanliness || "Class 1"}
                    </td>
                    <td className="p-1 px-2.5 font-bold border-r border-black">Observed :</td>
                    <td colSpan={3} className="p-1 px-2.5 text-slate-900 truncate">
                      {data.observed || "White corundum"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. PAINTING SYSTEM */}
            <div className="py-1 px-2 text-center font-bold text-[12px] uppercase tracking-wider border-b border-black bg-slate-50/40 flex-shrink-0">
              {data.paintingSystemHeader || "PAINTING SYSTEM FOR CARBON STEEL VALVES & ACCESSORIES"}
            </div>
            <div
              style={{
                flex:
                  7 +
                  (data.pullOffTestRequired ? 1 : 0) +
                  (data.adhesionTestRequired ? 1 : 0),
              }}
              className="flex flex-col min-h-0"
            >
              <table className="w-full h-full table-fixed border-collapse border-b-[1.5px] border-black text-[11px]">
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                </colgroup>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Application method</td>
                    {coats.map((c, idx) => (
                      <td
                        key={`app-m-${idx}`}
                        className={`p-1 px-2.5 text-slate-900 ${idx < coats.length - 1 ? "border-r border-black" : ""}`}
                      >
                        {c.applicationMethod || "Conventional air spray"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Applied Coat</td>
                    {coats.map((c, idx) => (
                      <td
                        key={`app-c-${idx}`}
                        className={`p-1 px-2.5 font-semibold text-slate-900 ${idx < coats.length - 1 ? "border-r border-black" : ""}`}
                      >
                        {c.appliedCoat || c.coatName}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Paint mfg.Name</td>
                    {coats.map((c, idx) => (
                      <td
                        key={`p-mfg-${idx}`}
                        className={`p-1 px-2.5 text-slate-900 ${idx < coats.length - 1 ? "border-r border-black" : ""}`}
                      >
                        {c.paintMfgName || "Jotun"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Product Name</td>
                    {coats.map((c, idx) => (
                      <td
                        key={`p-prod-${idx}`}
                        className={`p-1 px-2.5 text-slate-900 ${idx < coats.length - 1 ? "border-r border-black" : ""}`}
                      >
                        {c.productName || "Check valve"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">Colour /Shade</td>
                    {coats.map((c, idx) => (
                      <td
                        key={`p-col-${idx}`}
                        className={`p-1 px-2.5 text-slate-900 ${idx < coats.length - 1 ? "border-r border-black" : ""}`}
                      >
                        {c.colourShade || "Red"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">DFT Required (µm)</td>
                    {coats.map((c, idx) => (
                      <td
                        key={`p-dft-req-${idx}`}
                        className={`p-1 px-2.5 font-mono text-slate-900 ${idx < coats.length - 1 ? "border-r border-black" : ""}`}
                      >
                        {c.dftRequired || ""}
                      </td>
                    ))}
                  </tr>
                  <tr className={data.pullOffTestRequired || data.adhesionTestRequired ? "border-b border-black" : ""}>
                    <td className="p-1 px-2.5 font-bold border-r border-black">DFT observed (µm)</td>
                    {coats.map((c, idx) => (
                      <td
                        key={`p-dft-obs-${idx}`}
                        className={`p-1 px-2.5 font-mono font-semibold text-slate-900 ${idx < coats.length - 1 ? "border-r border-black" : ""}`}
                      >
                        {c.dftObserved || ""}
                      </td>
                    ))}
                  </tr>

                  {data.pullOffTestRequired && (
                    <tr className={data.adhesionTestRequired ? "border-b border-black" : ""}>
                      <td className="p-1 px-2.5 font-bold border-r border-black">Pull off test ISO 4624</td>
                      <td className="p-1 px-2.5 border-r border-black text-slate-900 font-mono">
                        Req: {data.pullOffTestRequired}
                      </td>
                      <td className="p-1 px-2.5 border-r border-black text-slate-900 font-mono">
                        Actual: {data.pullOffTestActual || ""}
                      </td>
                      <td className="p-1 px-2.5 text-slate-900">
                        Location: {data.pullOffTestLocation || ""}
                      </td>
                    </tr>
                  )}
                  {data.adhesionTestRequired && (
                    <tr>
                      <td className="p-1 px-2.5 font-bold border-r border-black">Adhesion(X method ) ISO 16276-2</td>
                      <td className="p-1 px-2.5 border-r border-black text-slate-900 font-mono">
                        {data.adhesionTestRequired}
                      </td>
                      <td className="p-1 px-2.5 border-r border-black text-slate-900 font-mono">
                        {data.adhesionTestActual || ""}
                      </td>
                      <td className="p-1 px-2.5 text-slate-900">
                        Location: {data.adhesionTestLocation || ""}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 6. INSTRUMENTS & COMMENTS */}
            <div className="flex-[3.5] flex flex-col min-h-0">
              <table className="w-full h-full table-fixed border-collapse border-b-[1.5px] border-black text-[11px]">
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "70%" }} />
                </colgroup>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">
                      Instrument used for Inspection
                    </td>
                    <td className="p-1 px-2.5 text-slate-900 truncate">
                      {data.instrumentUsed || "(Coat Thickness Gauge) -KENCY"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 px-2.5 font-bold border-r border-black">
                      Calibration of Instruments
                    </td>
                    <td className="p-1 px-2.5 text-slate-900 truncate text-[8.5px]">
                      {data.calibrationOfInstruments ||
                        "Calibration verified with known foil thickness and found acceptable - CTG-02, Due - 17-11-2026"}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-1.5 px-2.5 align-top">
                      <span className="font-bold">Inspection Comments : </span>
                      <span className="text-slate-900">
                        {data.inspectionComments ||
                          "The paint has no sagging , no delamination & the surface is uniform & smooth ."}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* 7. SIGNATURES (PREPARED, REVIEWED, APPROVED) */}
          <div className="w-full grid grid-cols-3 border-b-[1.5px] border-black text-center min-h-[96px] flex-shrink-0">
            <div className="p-2 border-r border-black flex flex-col justify-between items-center">
              <span className="font-bold text-[9px] uppercase tracking-wider text-black">
                PREPARED
              </span>
              <div className="h-[50px] w-full flex items-center justify-center my-0.5">
                {showPreparedSignature ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.preparedSignatureUrl}
                    alt="Prepared Signature"
                    className="h-full w-auto object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="w-24 border-b border-dashed border-slate-300 my-2" />
                )}
              </div>
              <span className="font-semibold text-[9.5px] text-slate-900 uppercase">
                {data.preparedBy || "ELAVARASAN"}
              </span>
            </div>

            <div className="p-2 border-r border-black flex flex-col justify-between items-center">
              <span className="font-bold text-[9px] uppercase tracking-wider text-black">
                REVIEWED
              </span>
              <div className="h-[50px] w-full flex items-center justify-center my-0.5">
                {showReviewedSignature ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.reviewedSignatureUrl}
                    alt="Reviewed Signature"
                    className="h-full w-auto object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="w-24 border-b border-dashed border-slate-300 my-2" />
                )}
              </div>
              <span className="font-semibold text-[9.5px] text-slate-900 uppercase">
                {data.reviewedBy || "ASHOK"}
              </span>
            </div>

            <div className="p-2 flex flex-col justify-between items-center relative">
              <span className="font-bold text-[9px] uppercase tracking-wider text-black">
                APPROVED
              </span>
              <div className="h-[50px] w-full flex items-center justify-center my-0.5 relative">
                {showApprovedSignature ? (
                  <div className="relative flex items-center justify-center h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.approvedSignatureUrl}
                      alt="Approved Signature"
                      className="h-full w-auto object-contain mix-blend-multiply"
                    />
                    {showStamp && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.sealStampUrl || "/signature/truflow-seal-stamp.png"}
                        alt="Truflow Stamp"
                        className="absolute -right-6 -top-2 h-12 w-auto mix-blend-multiply opacity-85 pointer-events-none"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-24 border-b border-dashed border-slate-300 my-2" />
                )}
              </div>
              <span className="font-semibold text-[9.5px] text-slate-900 uppercase">
                {data.approvedBy || "KANNATHASAN"}
              </span>
            </div>
          </div>

          {/* 8. COMPANY FOOTER */}
          <div className="py-2 text-center flex-shrink-0 bg-white">
            <p className="text-[9.5px] font-bold text-black uppercase tracking-wide">
              {data.companyName || "TRUFLOW AUTOMATION & CONTROLS PRIVATE LIMITED"}
            </p>
            <p className="text-[8px] text-slate-700 mt-0.5">
              {data.companyAddress ||
                "S.F No. 617/ 2H2, Vadakku Thottam, L&T Road, MALUMICHAMPATTI post, Coimbatore- 641021, Tamil Nadu"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
