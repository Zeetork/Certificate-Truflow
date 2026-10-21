"use client";

import React from "react";
import {
  HydroTestCertificateData,
} from "@/types/certificate";
import { formatDisplayDate } from "@/lib/certificateDefaults";

interface HydroTestTemplateProps {
  data: HydroTestCertificateData;
  certificateNumber?: string;
  revision?: number;
  status?: string;
}

export const HydroTestTemplate: React.FC<HydroTestTemplateProps> = ({
  data,
  certificateNumber,
  status,
}) => {
  const currentStatus = (status || data.status || "DRAFT").toUpperCase();
  const isDraft = currentStatus === "DRAFT" || !currentStatus;
  const isApproved = currentStatus === "APPROVED";

  // Truflow Signatures workflow
  const showPreparedSignature = !isDraft && Boolean(data.preparedSignatureUrl);
  const showWitnessSignature =
    (isApproved || currentStatus === "PENDING_APPROVAL") &&
    Boolean(data.witnessSignatureUrl);
  const showApprovedSignature = isApproved && Boolean(data.approvedSignatureUrl);

  const certNo = certificateNumber || data.certificateNumber || "DRAFT";

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
      {/* Outer border box matching reference certificate */}
      <div className="w-full min-h-[762px] border-[1.5px] border-black flex flex-col justify-between p-0 box-border bg-white text-[10px] leading-tight text-black">
        <div>
          {/* ========================================================================= */}
          {/* 1. HEADER (COMPANY INFO | CERTIFICATE TITLE | LOGO)                       */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-12 border-b-[1.5px] border-black min-h-[92px]">
            {/* Company Details (Left 4 cols) */}
            <div className="col-span-4 p-2.5 border-r border-black flex flex-col justify-center">
              <div className="text-[13px] font-black tracking-tight uppercase text-black">
                TRUFLOW SOLUTIONS PVT. LTD.
              </div>
              <div className="text-[9.5px] leading-tight text-neutral-900 mt-0.5">
                S.F.No.617/2H2, Vadakku Thottam,
              </div>
              <div className="text-[9.5px] leading-tight text-neutral-900">
                Malumichampatti Post Office,
              </div>
              <div className="text-[9.5px] leading-tight text-neutral-900">
                Coimbatore, Tamilnadu, India - 641 021
              </div>
              <div className="text-[9.5px] font-bold text-neutral-900 mt-0.5 tracking-tight">
                GSTN: 33AAJCR6720N1Z1
              </div>
            </div>

            {/* Certificate Title & Standard (Center 5 cols) */}
            <div className="col-span-5 p-2.5 border-r border-black flex flex-col items-center justify-center text-center">
              <h1 className="text-[17px] font-black tracking-normal uppercase text-black">
                Hydro Test Certificate
              </h1>
              <div className="text-[11px] font-semibold text-neutral-800 mt-1">
                (According to EN 10204 3.1)
              </div>
            </div>

            {/* Brand Logo (Right 3 cols) */}
            <div className="col-span-3 p-2.5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/truflow-logo.png"
                alt="Truflow Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. ORDER DETAILS GRID (3 ROWS x 4 COLUMNS)                                */}
          {/* ========================================================================= */}
          <table className="w-full table-fixed border-collapse border-b-[1.5px] border-black text-[10px]">
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "21%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <tbody>
              <tr className="border-b border-black">
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">Customer Name : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.customerName || ""}
                  </span>
                </td>
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">PO NO : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.poNo || ""}
                  </span>
                </td>
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">Project Name : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.projectName || ""}
                  </span>
                </td>
                <td className="p-1 px-2 truncate">
                  <span className="font-bold">Date : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {formatDisplayDate(data.date)}
                  </span>
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">PRODUCT Type : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.productType || ""}
                  </span>
                </td>
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">Testing Std : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.testingStd || "API 598"}
                  </span>
                </td>
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">F TO F Std : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.fToFStd || ""}
                  </span>
                </td>
                <td className="p-1 px-2 truncate">
                  <span className="font-bold">Certificates No : </span>
                  <span className="font-semibold uppercase text-neutral-900 font-mono">
                    {certNo}
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">DESIGN : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.design || ""}
                  </span>
                </td>
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">Mfg Std : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.mfgStd || "API 609A / BS 5155 / IS 3095"}
                  </span>
                </td>
                <td className="p-1 px-2 border-r border-black truncate">
                  <span className="font-bold">Ends Std : </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.endsStd || ""}
                  </span>
                </td>
                <td className="p-1 px-2 truncate">
                  <span className="font-bold">GAD NO: </span>
                  <span className="font-normal uppercase text-neutral-900">
                    {data.gadNo || ""}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ========================================================================= */}
          {/* 3. PRESSURE TEST AND INSPECTION                                           */}
          {/* ========================================================================= */}
          <div className="w-full border-b-[1.5px] border-black">
            {/* Header Bar */}
            <div className="grid grid-cols-12 border-b border-black bg-neutral-50/50 py-1 px-2 text-[10px]">
              <div className="col-span-4 font-black uppercase text-black">
                PRESSURE TEST AND INSPECTION
              </div>
              <div className="col-span-8">
                <span className="font-bold">TEST ACCORDING TO : </span>
                <span className="font-semibold uppercase">
                  {data.testAccordingTo || "API 598"}
                </span>
              </div>
            </div>

            {/* Test items table */}
            <table className="w-full h-[100px] table-fixed border-collapse text-[9.5px]">
              <colgroup>
                <col style={{ width: "31%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <tbody>
                {/* Row 1: SHELL TEST */}
                <tr className="border-b border-black">
                  <td className="p-1 px-2 border-r border-black truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-3 h-3 border border-black text-[9px] font-bold leading-none bg-white">
                        {tests.shellHydro.enabled ? "✓" : ""}
                      </span>
                      <span className="font-bold uppercase tracking-tight">
                        SHELL TEST (HYDROSTATIC)
                      </span>
                    </div>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">PRESSURE: </span>
                    <span>{tests.shellHydro.enabled ? tests.shellHydro.pressure || "-" : "-"} Kg/cm2</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">DURATION: </span>
                    <span>{tests.shellHydro.enabled ? tests.shellHydro.duration || "-" : "-"} SECONDS</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">RESULTS: </span>
                    <span>{tests.shellHydro.enabled ? tests.shellHydro.results || "-" : "-"}</span>
                  </td>
                  <td className="p-1 px-2 truncate font-semibold">
                    <span>DIMENSIONAL INSPECTION: </span>
                    <span className="font-bold">{data.dimensionalInspection || "OK"}</span>
                  </td>
                </tr>

                {/* Row 2: SEAT TEST (HYDROSTATIC) */}
                <tr className="border-b border-black">
                  <td className="p-1 px-2 border-r border-black truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-3 h-3 border border-black text-[9px] font-bold leading-none bg-white">
                        {tests.seatHydro.enabled ? "✓" : ""}
                      </span>
                      <span className="font-bold uppercase tracking-tight">
                        SEAT TEST (HYDROSTATIC)
                      </span>
                    </div>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">PRESSURE: </span>
                    <span>{tests.seatHydro.enabled ? tests.seatHydro.pressure || "-" : "-"} Kg/cm2</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">DURATION: </span>
                    <span>{tests.seatHydro.enabled ? tests.seatHydro.duration || "-" : "-"} SECONDS</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">RESULTS: </span>
                    <span>{tests.seatHydro.enabled ? tests.seatHydro.results || "-" : "-"}</span>
                  </td>
                  <td className="p-1 px-2 truncate font-semibold">
                    <span>VISUAL INSPECTION: </span>
                    <span className="font-bold">{data.visualInspection || "OK"}</span>
                  </td>
                </tr>

                {/* Row 3: SEAT TEST (AIR) */}
                <tr className="border-b border-black">
                  <td className="p-1 px-2 border-r border-black truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-3 h-3 border border-black text-[9px] font-bold leading-none bg-white">
                        {tests.seatAir.enabled ? "✓" : ""}
                      </span>
                      <span className="font-bold uppercase tracking-tight">
                        SEAT TEST (AIR)
                      </span>
                    </div>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">PRESSURE: </span>
                    <span>{tests.seatAir.enabled ? tests.seatAir.pressure || "-" : "-"} Kg/cm2</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">DURATION: </span>
                    <span>{tests.seatAir.enabled ? tests.seatAir.duration || "-" : "-"} SECONDS</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">RESULTS: </span>
                    <span>{tests.seatAir.enabled ? tests.seatAir.results || "-" : "-"}</span>
                  </td>
                  <td className="p-1 px-2 truncate font-semibold">
                    <span>OPERATIONAL INSPECTION: </span>
                    <span className="font-bold">{data.operationalInspection || "OK"}</span>
                  </td>
                </tr>

                {/* Row 4: BACK SEAT TEST (HYDROSTATIC) */}
                <tr>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-3 h-3 border border-black text-[9px] font-bold leading-none bg-white">
                        {tests.backSeatHydro.enabled ? "✓" : ""}
                      </span>
                      <span className="font-bold uppercase tracking-tight">
                        BACK SEAT TEST (HYDROSTATIC)
                      </span>
                    </div>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">PRESSURE: </span>
                    <span>{tests.backSeatHydro.enabled ? tests.backSeatHydro.pressure || "-" : "-"} Kg/cm2</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">DURATION: </span>
                    <span>{tests.backSeatHydro.enabled ? tests.backSeatHydro.duration || "-" : "-"} SECONDS</span>
                  </td>
                  <td className="p-1 px-2 border-r border-black truncate">
                    <span className="font-semibold">RESULTS: </span>
                    <span>{tests.backSeatHydro.enabled ? tests.backSeatHydro.results || "-" : "-"}</span>
                  </td>
                  <td className="p-1 px-2 truncate bg-neutral-50/20">
                    {/* Empty cell matching reference */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* 4. OPEN BODY AREA / REMARKS (MATCHES Hydro Test Certificate.png)          */}
          {/* ========================================================================= */}
          <div className="min-h-[380px] p-4 flex flex-col justify-start">
            {data.remarks && (
              <div className="text-[11px] text-neutral-800 font-medium">
                <span className="font-bold uppercase">Remarks / Notes: </span>
                <span>{data.remarks}</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. FOOTER SIGNATORIES (PREPARED BY | WITNESSED BY | APPROVED BY)          */}
        {/* ========================================================================= */}
        <table className="w-full table-fixed border-collapse border-t-[1.5px] border-black text-center text-[10px]">
          <colgroup>
            <col style={{ width: "33.33%" }} />
            <col style={{ width: "33.34%" }} />
            <col style={{ width: "33.33%" }} />
          </colgroup>
          <tbody>
            <tr className="h-24">
              {/* Prepared By */}
              <td className="p-1.5 px-3 border-r border-black align-bottom pb-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {showPreparedSignature && data.preparedSignatureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.preparedSignatureUrl}
                      alt="Prepared Signature"
                      className="h-10 w-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="h-8" />
                  )}
                  {data.preparedBy && (
                    <span className="text-[10px] font-bold uppercase text-neutral-900 leading-tight mb-1">
                      {data.preparedBy}
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-black tracking-tight">
                    Prepared By
                  </span>
                </div>
              </td>

              {/* Witnessed By */}
              <td className="p-1.5 px-3 border-r border-black align-bottom pb-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {showWitnessSignature && data.witnessSignatureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.witnessSignatureUrl}
                      alt="Witness Signature"
                      className="h-10 w-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="h-8" />
                  )}
                  {data.witnessedBy && (
                    <span className="text-[10px] font-bold uppercase text-neutral-900 leading-tight mb-1">
                      {data.witnessedBy}
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-black tracking-tight">
                    Witnessed By
                  </span>
                </div>
              </td>

              {/* Approved by */}
              <td className="p-1.5 px-3 align-bottom pb-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {showApprovedSignature && data.approvedSignatureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.approvedSignatureUrl}
                      alt="Approved Signature"
                      className="h-10 w-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="h-8" />
                  )}
                  {data.approvedBy && (
                    <span className="text-[10px] font-bold uppercase text-neutral-900 leading-tight mb-1">
                      {data.approvedBy}
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-black tracking-tight">
                    Approved by
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
